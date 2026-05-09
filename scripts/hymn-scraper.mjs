import { chromium } from 'playwright';
import { Client, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const databases = new Databases(client);

async function scrapeHymns(url, bookName) {
    console.log(`🎵 Scraping ${bookName}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for the list to load
    await page.waitForTimeout(5000);

    const hymns = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(a => {
            const text = a.innerText.trim();
            // Match pattern like "1. The Morning Breaks" or "101 - Guide Us, O Thou Great Jehovah"
            const match = text.match(/^(\d+)\s*[\.\-]\s*(.+)$/);
            if (!match) return null;
            
            return {
                number: match[1],
                title: match[2],
                url: a.href
            };
        }).filter(h => h !== null);
    });

    console.log(`Found ${hymns.length} entries in ${bookName}`);

    // Limit to prevent huge database hits in dev, but user wants "everything"
    for (const h of hymns) {
        try {
            await databases.createDocument(DATABASE_ID, 'hymns', ID.unique(), {
                title: h.title,
                number: h.number,
                book: bookName,
                url: h.url,
                syncedAt: Date.now()
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit buffer
        } catch (e) {
            if (e.code !== 409) console.error(`Error syncing ${h.title}: ${e.message}`);
        }
    }

    await browser.close();
}

async function main() {
    await scrapeHymns('https://www.churchofjesuschrist.org/music/library/hymns?lang=eng', 'Hymns');
    await scrapeHymns('https://www.churchofjesuschrist.org/music/library/childrens-songbook?lang=eng', 'Childrens Songbook');
    await scrapeHymns('https://www.churchofjesuschrist.org/music/library/hymns-for-home-and-church?lang=eng', 'New Hymns');
}

main().catch(console.error);
