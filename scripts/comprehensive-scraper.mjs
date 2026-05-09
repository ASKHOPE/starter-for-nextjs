import { chromium } from 'playwright';
import { Client, Databases, ID, Query } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DATA_FILE = path.resolve(__dirname, 'data/library.json');
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const databases = new Databases(client);

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const libraryData = {
    general_conference_talks: [], 
    come_follow_me: [],           
    gospel_principles: [],        
    hymns: [],
    childrens_songbook: [],
    new_hymns: [],
    youth_music: []
};

async function purgeCollection(collectionId) {
    console.log(`🧹 Purging collection ${collectionId}...`);
    try {
        let docs = await databases.listDocuments(DATABASE_ID, collectionId, [Query.limit(100)]);
        while (docs.documents.length > 0) {
            // Delete in batches of 10 concurrently
            const chunks = [];
            for (let i = 0; i < docs.documents.length; i += 10) {
                chunks.push(docs.documents.slice(i, i + 10));
            }

            for (const chunk of chunks) {
                await Promise.all(chunk.map(doc => 
                    databases.deleteDocument(DATABASE_ID, collectionId, doc.$id)
                        .catch(async e => {
                            if (e.code === 429) {
                                console.log("⏳ Purge rate limit hit, sleeping 5s...");
                                await delay(5000);
                            } else {
                                console.error(`Failed to delete ${doc.$id}: ${e.message}`);
                            }
                        })
                ));
            }
            docs = await databases.listDocuments(DATABASE_ID, collectionId, [Query.limit(100)]);
        }
    } catch (e) {
        console.error(`Error purging ${collectionId}: ${e.message}`);
    }
}

async function scrapeCollection(browser, url, type, options = {}) {
    console.log(`🔍 Scraping ${type} from ${url}...`);
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        
        // Music pages often load slow
        if (url.includes('/media/music/')) {
            await page.waitForTimeout(5000);
        }

        if (options.shouldScroll) {
            console.log(`⏬ Scrolling for ${type}...`);
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    let distance = 600;
                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight) {
                            setTimeout(() => {
                                if (document.body.scrollHeight === scrollHeight) {
                                    clearInterval(timer);
                                    resolve();
                                }
                            }, 1500);
                        }
                    }, 500);
                });
            });
            await page.waitForTimeout(3000);
        }

        const items = await page.evaluate((opt) => {
            const results = [];
            // Target specific music links if it's music
            const links = Array.from(document.querySelectorAll('a'));
            
            for (const a of links) {
                const text = a.innerText.trim().replace(/\n/g, ' ');
                if (!text || text.length < 2) continue;
                if (text.toLowerCase().includes('home') || text.toLowerCase().includes('library')) continue;

                const href = a.href;
                if (!href.includes('/study/') && !href.includes('/media/music/')) continue;

                let item = { title: text, url: href };

                if (opt.isNumbered) {
                    // Refined numbered matching for Hymns and CS
                    const match = text.match(/^(\d+)\s*[\.\-]?\s*(.+)$/);
                    if (match) {
                        item.number = match[1];
                        item.title = match[2].trim();
                    }
                }
                results.push(item);
            }
            return results;
        }, options);

        // Filter out duplicates and invalid entries
        const uniqueItems = Array.from(new Map(items.map(item => [item.url, item])).values())
            .filter(i => !i.url.endsWith('/music/collections/') && !i.url.endsWith('/study/manual/'));

        console.log(`✅ Found ${uniqueItems.length} items for ${type}`);
        
        for (const item of uniqueItems) {
            let cleanTitle = item.title;
            if (cleanTitle.length > 250) cleanTitle = cleanTitle.substring(0, 250) + '...';

            const doc = {
                title: cleanTitle,
                url: item.url,
                conference: options.conference || null
            };
            if (item.number) doc.number = item.number;
            libraryData[type].push(doc);
        }
    } catch (e) {
        console.error(`❌ Failed to scrape ${type}: ${e.message}`);
    } finally {
        await page.close();
    }
}

async function syncToAppwrite() {
    console.log("📤 Syncing local data to Appwrite Cloud...");
    
    // Purge logic - Include ALL collections for absolute clean state
    const collectionsToPurge = [
        'come_follow_me', 
        'hymns', 
        'childrens_songbook', 
        'new_hymns', 
        'youth_music',
        'general_conference_talks',
        'gospel_principles'
    ];
    for (const id of collectionsToPurge) {
        await purgeCollection(id);
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const order = ['general_conference_talks', 'come_follow_me', 'gospel_principles', 'childrens_songbook', 'new_hymns', 'youth_music', 'hymns'];

    for (const type of order) {
        console.log(`\n📦 Processing ${type} (${data[type].length} items)...`);
        for (const item of data[type]) {
            try {
                // Build payload SURGICALLY based on collection schema
                const payload = {
                    title: item.title,
                    url: item.url,
                    syncedAt: Date.now()
                };

                // Add optional fields only if supported by specific collection
                if (type === 'general_conference_talks') {
                    if (item.conference) payload.conference = item.conference;
                }
                
                if (['hymns', 'childrens_songbook', 'new_hymns'].includes(type)) {
                    if (item.number) payload.number = item.number;
                }

                await databases.createDocument(DATABASE_ID, type, ID.unique(), payload);
                console.log(`✅ [${type}] Synced: ${item.title}`);
                await delay(350); 
            } catch (e) {
                if (e.code === 409) continue;
                if (e.code === 429) {
                    console.log("⏳ Rate limit hit, sleeping 15s...");
                    await delay(15000);
                } else {
                    console.error(`❌ Error syncing ${item.title} to ${type}: ${e.message}`);
                }
            }
        }
    }
}

async function main() {
    const browser = await chromium.launch();
    
    // 1. General Conference
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/study/general-conference/2026/04?lang=eng', 'general_conference_talks', { conference: 'April 2026' });
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/study/general-conference/2025/04?lang=eng', 'general_conference_talks', { conference: 'April 2025' });

    // 2. Come Follow Me (2026 only)
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=eng', 'come_follow_me');

    // 3. Gospel Principles
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/study/manual/gospel-principles?lang=eng', 'gospel_principles');

    // 4. Split Music Collections
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/media/music/collections/hymns?lang=eng', 'hymns', { isNumbered: true, shouldScroll: true });
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/media/music/collections/childrens-songbook?lang=eng', 'childrens_songbook', { isNumbered: true, shouldScroll: true });
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/media/music/collections/hymns-for-home-and-church?lang=eng', 'new_hymns', { isNumbered: true, shouldScroll: true });
    await scrapeCollection(browser, 'https://www.churchofjesuschrist.org/media/music/collections/youth-music?lang=eng', 'youth_music', { shouldScroll: true });

    await browser.close();

    if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(libraryData, null, 2));
    await syncToAppwrite();
}

main().catch(console.error);
