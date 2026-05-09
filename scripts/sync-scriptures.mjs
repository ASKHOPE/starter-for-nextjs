import { Client, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

const VOLUMES_TABLE = 'scripture_volumes';
const BOOKS_TABLE = 'scripture_books';
const BASE_URL = 'https://openscriptureapi.org/api/scriptures/v1/lds/en';

if (!APPWRITE_PROJECT_ID || !DATABASE_ID) {
    console.error("Missing Appwrite configuration in .env");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

async function sync() {
    console.log("🚀 Starting Scripture Sync...");
    
    try {
        // 1. Fetch Volumes
        const vRes = await fetch(`${BASE_URL}/volumes`);
        const vData = await vRes.json();
        
        for (const v of vData.volumes) {
            const volumeId = v._id; // The API uses _id
            const volumeName = v.title; // The API uses title
            console.log(`Syncing Volume: ${volumeName} (${volumeId})...`);
            
            try {
                await databases.createDocument(DATABASE_ID, VOLUMES_TABLE, volumeId, {
                    name: volumeName,
                    volumeId: volumeId
                });
            } catch (e) {
                // Ignore if already exists
                if (e.code !== 409) console.error(`Error syncing volume ${volumeId}: ${e.message}`);
            }

            // 2. Fetch Books for Volume
            // The endpoint /books seems to be failing. Let's try /v1/lds/en/{volumeId}
            try {
                const bRes = await fetch(`${BASE_URL}/${volumeId}`);
                if (!bRes.ok) {
                    console.error(`  Failed to fetch books for ${volumeId} (Status: ${bRes.status})`);
                    continue;
                }
                const bData = await bRes.json();
                
                // Inspect bData structure
                const books = bData.books || bData.volumes || [];
                
                for (const b of books) {
                    const bookId = b._id || b.url?.split('/').pop();
                    const bookName = b.title || b.name;
                    const compositeId = `${volumeId}_${bookId}`;
                    console.log(`  Syncing Book: ${bookName}...`);
                    
                    try {
                        await databases.createDocument(DATABASE_ID, BOOKS_TABLE, compositeId, {
                            name: bookName,
                            bookId: bookId,
                            volumeId: volumeId,
                            chapters: b.chapters || 0
                        });
                    } catch (e) {
                        if (e.code !== 409) console.error(`    Error syncing book ${bookId}: ${e.message}`);
                    }
                }
            } catch (e) {
                console.error(`  Error fetching books for ${volumeId}: ${e.message}`);
            }
        }
        
        console.log("✅ Scripture Sync Processed!");
    } catch (error) {
        console.error("❌ Sync failed:", error.message);
    }
}

sync();
