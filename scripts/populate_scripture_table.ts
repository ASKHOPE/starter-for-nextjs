import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = '69fe3dba00048b5937c4';
const COLLECTION_ID = 'scriptures';

const API_BASE = 'https://openscriptureapi.org/api/scriptures/v1/lds/en';

const volumeMap: any = {
    'old-testament': { name: 'Old Testament', slug: 'ot' },
    'new-testament': { name: 'New Testament', slug: 'nt' },
    'book-of-mormon': { name: 'Book of Mormon', slug: 'bofm' },
    'doctrine-and-covenants': { name: 'Doctrine and Covenants', slug: 'dc-testament' },
    'pearl-of-great-price': { name: 'Pearl of Great Price', slug: 'pgp' }
};

async function populate() {
    console.log('🚀 Starting Scripture Ingestion using API...');

    try {
        const vRes = await fetch(`${API_BASE}/volumes`);
        const vData = await vRes.json();

        for (const v of vData.volumes) {
            const apiVolumeId = v._id;
            const volumeInfo = volumeMap[apiVolumeId];
            
            if (!volumeInfo) continue;

            console.log(`\nProcessing ${volumeInfo.name}...`);

            const bRes = await fetch(`${API_BASE}/${apiVolumeId}`);
            if (!bRes.ok) continue;
            const bData = await bRes.json();
            
            const books = bData.books || bData.volumes || [];

            for (const b of books) {
                const bookTitle = b.title || b.name;
                const bookId = b._id;
                
                // Construct URL for the Church website
                // Note: slugs differ slightly (e.g. 1-ne vs 1-nephi)
                // But the API _id often matches or is close.
                // We'll use a best-effort approach or just link to the book page.
                const churchUrl = `https://www.churchofjesuschrist.org/study/scriptures/${volumeInfo.slug}/${bookId}?lang=eng`;

                await saveToDb({
                    title: bookTitle,
                    book: bookTitle,
                    volume: volumeInfo.name,
                    url: churchUrl
                });
            }
        }

        console.log('\n✅ Scripture table populated!');
    } catch (error) {
        console.error('❌ Ingestion failed:', error);
    }
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
        // If 409, ignore
        console.error(`\nError saving ${data.title}:`, error.message);
    }
}

populate();
