import { Client, Databases, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = '69fe3dba00048b5937c4';
const COLLECTION_ID = 'scriptures';

async function run() {
    try {
        const volumes = [
            { name: "Old Testament", file: "old-testament.json", slug: "ot" },
            { name: "New Testament", file: "new-testament.json", slug: "nt" },
            { name: "Book of Mormon", file: "book-of-mormon.json", slug: "bofm" },
            { name: "Doctrine and Covenants", file: "doctrine-and-covenants.json", slug: "dc" },
            { name: "Pearl of Great Price", file: "pearl-of-great-price.json", slug: "pgp" }
        ];

        for (const vol of volumes) {
            console.log(`\nIngesting ${vol.name}...`);
            const filePath = path.join(process.cwd(), 'scriptures', vol.file);
            if (!fs.existsSync(filePath)) {
                console.error(`File ${filePath} not found!`);
                continue;
            }
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            const isDC = vol.slug === 'dc';
            const booksToProcess = isDC 
                ? [{ book: 'Doctrine and Covenants', chapters: data.sections.map((s: any) => ({ chapter: s.section, verses: s.verses })) }] 
                : data.books;

            for (const book of booksToProcess) {
                const bookSlug = book.book.toLowerCase().replace(/\s+/g, '-');
                console.log(`\n  Book: ${book.book}`);
                
                for (const chapter of book.chapters) {
                    const chapterNum = chapter.chapter;
                    const verses = chapter.verses || [];
                    
                    const versePromises = verses.map((v: any) => {
                        const reference = `${book.book} ${chapterNum}:${v.verse}`;
                        const docId = `${vol.slug}_${bookSlug}_${chapterNum}_${v.verse}`
                            .toLowerCase()
                            .replace(/[^a-z0-9_]/g, '_')
                            .substring(0, 36);

                        const churchUrl = `https://www.churchofjesuschrist.org/study/scriptures/${vol.slug}/${bookSlug}/${chapterNum}?lang=eng&id=p${v.verse}#p${v.verse}`;
                        
                        return databases.createDocument(
                            DATABASE_ID,
                            COLLECTION_ID,
                            docId,
                            {
                                title: reference,
                                book: book.book,
                                volume: vol.name,
                                chapter: chapterNum,
                                verse: v.verse,
                                content: v.text,
                                reference: reference,
                                url: churchUrl
                            }
                        ).then(() => {
                            process.stdout.write('.');
                        }).catch((e: any) => {
                            if (e.code === 409) {
                                process.stdout.write('s');
                            } else {
                                console.error(`\nError saving ${reference}:`, e.message);
                            }
                        });
                    });

                    await Promise.allSettled(versePromises);
                }
            }
        }
        console.log('\nIngestion complete!');
    } catch (error) {
        console.error('Ingestion failed:', error);
    }
}

run();
