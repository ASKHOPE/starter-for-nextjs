
import fs from 'fs';
import path from 'path';
import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PROJECT_ID = process.env.PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const DATABASE_ID = process.env.PUBLIC_APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const COLLECTION_ID = 'general_conference_talks';

if (!API_KEY) {
  console.error('❌ APPWRITE_API_KEY is missing');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY);

const databases = new Databases(client);

const filePath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\de0a3fc7-15d0-4450-a979-98c860f772e0\\.system_generated\\steps\\610\\content.md';

async function scrapeAndStore() {
  console.log('🚀 Starting scrape and store process...');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Markdown file not found at ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const talks = [];
  let currentSession = '';
  let currentSpeaker = '';
  let currentTitle = '';
  let currentUrl = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect Session
    if (line.startsWith('#### ') && line.toLowerCase().includes('session')) {
      currentSession = line.replace('#### ', '').trim();
      console.log(`📂 Found Session: ${currentSession}`);
      continue;
    }

    // Detect Speaker
    if (line.startsWith('###### ')) {
      currentSpeaker = line.replace('###### ', '').trim();
      continue;
    }

    // Detect Title and Link (they usually follow each other)
    if (line.startsWith('#### ') && !line.toLowerCase().includes('session')) {
      currentTitle = line.replace('#### ', '').trim();
      
      // Look for the next line that contains a link
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const linkMatch = lines[j].match(/\[.*\]\((https:\/\/www\.churchofjesuschrist\.org\/study\/general-conference\/2026\/04\/.*)\)/);
        if (linkMatch) {
          currentUrl = linkMatch[1];
          break;
        }
      }

      if (currentTitle && currentSpeaker && currentUrl) {
        talks.push({
          title: currentTitle,
          speaker: currentSpeaker,
          url: currentUrl,
          conference: 'April 2026',
          session: currentSession,
          syncedAt: Date.now()
        });
        
        console.log(`✅ Extracted: ${currentTitle} by ${currentSpeaker}`);
        
        // Reset for next talk
        currentTitle = '';
        currentSpeaker = '';
        currentUrl = '';
      }
    }
  }

  console.log(`📊 Total talks extracted: ${talks.length}`);

  if (talks.length === 0) {
    console.warn('⚠️ No talks extracted. Check the parsing logic.');
    return;
  }

  // Store in Appwrite
  for (const talk of talks) {
    try {
      // Basic duplicate check (by title and speaker)
      // For simplicity, we'll just create new ones or you could query first
      await databases.createDocument(
        DATABASE_ID!,
        COLLECTION_ID,
        ID.unique(),
        talk
      );
      console.log(`💾 Stored in DB: ${talk.title}`);
    } catch (err: any) {
      console.error(`❌ Failed to store ${talk.title}:`, err.message);
    }
  }

  console.log('✨ Scrape and store process completed.');
}

scrapeAndStore();
