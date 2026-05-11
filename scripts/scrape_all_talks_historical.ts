
import { Client, Databases, ID } from 'node-appwrite';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

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

async function scrapeConference(year: number, month: number) {
  const monthStr = month.toString().padStart(2, '0');
  const url = `https://www.churchofjesuschrist.org/study/general-conference/${year}/${monthStr}?lang=eng`;
  
  console.log(`🔍 Launching browser for ${year}/${monthStr}...`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log(`🌐 Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log(`⌛ Waiting for content on ${year}/${monthStr}...`);
    await page.waitForSelector('a.list-tile', { timeout: 20000 }).catch(() => {
        console.log(`⚠️ No list-tile found for ${year}/${monthStr}, skipping...`);
    });

    const talks = await page.evaluate((confInfo) => {
      const results: any[] = [];
      const tiles = document.querySelectorAll('a.list-tile');
      
      let currentSession = 'General Session';

      tiles.forEach((tile) => {
        // Try to find the session heading before this tile
        // This is a bit tricky, but we can look for h2/h3 elements
        let prev = tile.previousElementSibling;
        while (prev) {
          if (prev.tagName === 'H2' || prev.tagName === 'H3') {
            const text = prev.textContent?.trim();
            if (text && text.toLowerCase().includes('session')) {
              currentSession = text;
              break;
            }
          }
          prev = prev.previousElementSibling;
        }

        const title = tile.querySelector('h4')?.textContent?.trim();
        const speaker = tile.querySelector('h6')?.textContent?.trim();
        const href = (tile as HTMLAnchorElement).href;

        if (title && speaker) {
          results.push({
            title,
            speaker,
            url: href,
            conference: confInfo.name,
            session: currentSession,
            syncedAt: Date.now()
          });
        }
      });
      return results;
    }, { name: `${month === 4 ? 'April' : 'October'} ${year}` });

    await browser.close();
    return talks;
  } catch (err) {
    console.error(`❌ Error scraping ${year}/${monthStr}:`, err);
    await browser.close();
    return [];
  }
}

async function main() {
  const startYear = 1971;
  const endYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const conferences = [];
  for (let year = startYear; year <= endYear; year++) {
    for (const month of [4, 10]) {
      if (year === endYear && month > currentMonth) continue;
      conferences.push({ year, month });
    }
  }

  console.log(`📑 Total conferences to scrape: ${conferences.length}`);

  // Process conferences with concurrency limit
  const concurrencyLimit = 2;
  for (let i = 0; i < conferences.length; i += concurrencyLimit) {
    const batch = conferences.slice(i, i + concurrencyLimit);
    await Promise.all(batch.map(async (conf) => {
      const talks = await scrapeConference(conf.year, conf.month);
      console.log(`📊 Found ${talks.length} talks for ${conf.year}/${conf.month}`);

      if (talks.length > 0) {
        // Batch upload (limited concurrency for DB writes)
        const dbBatchSize = 5;
        for (let j = 0; j < talks.length; j += dbBatchSize) {
          const dbBatch = talks.slice(j, j + dbBatchSize);
          await Promise.all(dbBatch.map(talk => 
            databases.createDocument(DATABASE_ID!, COLLECTION_ID, ID.unique(), talk)
              .catch(e => console.error(`❌ DB Error: ${talk.title}`, e.message))
          ));
        }
        console.log(`✅ Stored ${talks.length} talks for ${conf.year}/${conf.month}.`);
      }
    }));
  }
}

main();
