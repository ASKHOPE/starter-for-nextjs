import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

console.log("EP:", process.env.APPWRITE_ENDPOINT);
console.log("PR:", process.env.APPWRITE_PROJECT_ID);
console.log("DB:", process.env.APPWRITE_DATABASE_ID);

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function check() {
    try {
        const collections = ['hymns', 'general_conference_talks', 'come_follow_me'];
        for (const col of collections) {
            const docs = await databases.listDocuments(process.env.APPWRITE_DATABASE_ID, col);
            console.log(`Collection ${col}: ${docs.total} documents found.`);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

check();
