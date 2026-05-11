import { Client, Databases, ID } from 'node-appwrite';
import { chromium } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = '69fe3dba00048b5937c4';
const COLLECTION_ID = 'scriptures';

const SCRIPTURES_ROOT = 'https://www.churchofjesuschrist.org/study/scriptures?lang=eng';

const volumes = [
    { name: 'Old Testament', slug: 'ot' },
    { name: 'New Testament', slug: 'nt' },
    { name: 'Book of Mormon', slug: 'bofm' },
    { name: 'Doctrine and Covenants', slug: 'dc-testament' },
    { name: 'Pearl of Great Price', slug: 'pgp' }
];

async function scrape() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Starting scripture ingestion...');

    for (const volume of volumes) {
        console.log(`\n--- Processing Volume: ${volume.name} ---`);
        const volumeUrl = `https://www.churchofjesuschrist.org/study/scriptures/${volume.slug}?lang=eng`;
        await page.goto(volumeUrl);
        await page.waitForSelector('nav.manifest');

        // Get all book links
        const bookLinks = await page.$$eval('nav.manifest a', (links) => 
            links.map(a => ({
                title: a.innerText.trim(),
                href: (a as HTMLAnchorElement).href
            }))
        );

        for (const book of bookLinks) {
            // Some links might be direct to chapters (like D&C) or sections
            if (book.href.includes('/study/scriptures/') && !book.href.includes('?')) {
                console.log(`  Processing Book: ${book.title}`);
                
                const chapterPage = await context.newPage();
                await chapterPage.goto(book.href);
                
                // Check if it's a list of chapters or a single chapter
                const hasChapters = await chapterPage.$('nav.manifest');
                
                if (hasChapters) {
                    const chapters = await chapterPage.$$eval('nav.manifest a', (links) => 
                        links.map(a => ({
                            title: a.innerText.trim(),
                            href: (a as HTMLAnchorElement).href
                        }))
                    );

                    for (const chapter of chapters) {
                        if (chapter.href.includes('/study/scriptures/')) {
                            await saveToDb({
                                title: `${book.title} ${chapter.title}`,
                                book: book.title,
                                volume: volume.name,
                                url: chapter.href
                            });
                        }
                    }
                } else {
                    // Single chapter book or direct link
                    await saveToDb({
                        title: book.title,
                        book: book.title,
                        volume: volume.name,
                        url: book.href
                    });
                }
                await chapterPage.close();
            }
        }
    }

    await browser.close();
    console.log('\nScripture ingestion complete!');
}

async function saveToDb(data: any) {
    try {
        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                title: data.title,
                book: data.book,
                volume: data.volume,
                url: data.url
            }
        );
        process.stdout.write('.');
    } catch (error) {
        console.error(`\nError saving ${data.title}:`, error);
    }
}

scrape().catch(console.error);
