import { CheerioCrawler } from 'crawlee';
import { Client, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69fe3dba00048b5937c4';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const databases = new Databases(client);

// Crawler for Articles/Lessons
const articleCrawler = new CheerioCrawler({
    async requestHandler({ request, $, log }) {
        const type = request.userData.type; // 'manuals' or 'gospel_principles'
        const title = $('h1').text().trim();
        const url = request.loadedUrl;

        if (title) {
            try {
                await databases.createDocument(DATABASE_ID, type, ID.unique(), {
                    title, url, syncedAt: Date.now()
                });
                await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit buffer
                log.info(`✅ Synced ${type}: ${title}`);
            } catch (error) {
                if (error.code !== 409) log.error(`❌ Failed ${title}: ${error.message}`);
            }
        }
    }
});

// Crawler for List Pages (Index)
const listCrawler = new CheerioCrawler({
    async requestHandler({ request, $, log }) {
        const type = request.userData.type;
        const links = [];
        $('.item-list a, .manifest a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('lang=')) {
                 links.push(new URL(href, 'https://www.churchofjesuschrist.org').href + '?lang=eng');
            } else if (href) {
                 links.push(new URL(href, 'https://www.churchofjesuschrist.org').href);
            }
        });
        
        log.info(`Found ${links.length} links to scrape for ${type}`);
        await articleCrawler.addRequests(links.map(url => ({ url, userData: { type } })));
    }
});

async function main() {
    console.log("🚀 Starting Gospel Library Content Sync...");

    // 1. Gospel Principles
    console.log("✨ Syncing Gospel Principles...");
    await listCrawler.run([{ 
        url: 'https://www.churchofjesuschrist.org/study/manual/gospel-principles?lang=eng', 
        userData: { type: 'gospel_principles' } 
    }]);

    // 2. Come Follow Me 2025
    console.log("📖 Syncing Come Follow Me 2025...");
    await listCrawler.run([{ 
        url: 'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-doctrine-and-covenants-2025?lang=eng', 
        userData: { type: 'manuals' } 
    }]);

    // 3. General Conference (Recent)
    console.log("🎤 Syncing General Conference...");
    await listCrawler.run([{ 
        url: 'https://www.churchofjesuschrist.org/study/general-conference/2025/04?lang=eng', 
        userData: { type: 'talks' } 
    }]);

    console.log("✅ Sync complete!");
}

main().catch(console.error);
