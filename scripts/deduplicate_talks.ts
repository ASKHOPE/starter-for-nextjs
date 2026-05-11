
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const PROJECT_ID = process.env.PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const DATABASE_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const COLLECTION_ID = 'general_conference_talks';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

const databases = new Databases(client);

async function main() {
  console.log('🔍 Starting deduplication of General Conference talks...');
  
  let allDocs: any[] = [];
  let offset = 0;
  const limit = 1000;

  // Fetch all documents
  while (true) {
    console.log(`📥 Fetching documents (offset: ${offset})...`);
    const response = await databases.listDocuments(
      DATABASE_ID!,
      COLLECTION_ID,
      [Query.limit(limit), Query.offset(offset)]
    );
    
    allDocs = [...allDocs, ...response.documents];
    if (response.documents.length < limit) break;
    offset += limit;
  }

  console.log(`📊 Total documents fetched: ${allDocs.length}`);

  // Identify duplicates by URL
  const seenUrls = new Map<string, string>(); // url -> id (the one to keep)
  const duplicates: string[] = [];

  for (const doc of allDocs) {
    const key = doc.url; // URL is the best unique identifier for a talk
    if (seenUrls.has(key)) {
      duplicates.push(doc.$id);
    } else {
      seenUrls.set(key, doc.$id);
    }
  }

  console.log(`⚠️ Found ${duplicates.length} duplicate documents.`);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found. System is clean.');
    return;
  }

  // Delete duplicates in batches
  console.log(`🗑️ Deleting ${duplicates.length} duplicates...`);
  const batchSize = 10;
  for (let i = 0; i < duplicates.length; i += batchSize) {
    const batch = duplicates.slice(i, i + batchSize);
    await Promise.all(batch.map(id => 
      databases.deleteDocument(DATABASE_ID!, COLLECTION_ID, id)
        .then(() => console.log(`   Deleted ${id}`))
        .catch(err => console.error(`   Failed to delete ${id}:`, err.message))
    ));
  }

  console.log(`✅ Deduplication complete. Removed ${duplicates.length} documents.`);
}

main();
