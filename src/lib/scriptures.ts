/**
 * Scripture Service
 * Interfaces with https://openscriptureapi.org/
 */

const BASE_URL = 'https://openscriptureapi.org/api/scriptures/v1/lds/en';

export interface ScriptureVolume {
    id: string;
    name: string;
    url: string;
}

export interface ScriptureBook {
    id: string;
    name: string;
    url: string;
    chapters: number;
}

export interface ScriptureChapter {
    volume: string;
    book: string;
    chapter: number;
    verses: ScriptureVerse[];
}

export interface ScriptureVerse {
    verse: number;
    text: string;
}

export const scriptures = {
    /**
     * Get all volumes (Bible, Book of Mormon, etc.)
     */
    async getVolumes(): Promise<ScriptureVolume[]> {
        const res = await fetch(`${BASE_URL}/volumes`);
        const data = await res.json();
        return data.volumes.map((v: any) => ({
            id: v.url.split('/').pop(),
            name: v.name,
            url: v.url
        }));
    },

    /**
     * Get books for a volume
     */
    async getBooks(volumeId: string): Promise<ScriptureBook[]> {
        const res = await fetch(`${BASE_URL}/${volumeId}/books`);
        const data = await res.json();
        return data.books.map((b: any) => ({
            id: b.url.split('/').pop(),
            name: b.name,
            url: b.url,
            chapters: b.chapters
        }));
    },

    /**
     * Get verses for a specific chapter
     */
    async getChapter(volumeId: string, bookId: string, chapter: number): Promise<ScriptureChapter> {
        const res = await fetch(`${BASE_URL}/${volumeId}/${bookId}/${chapter}`);
        const data = await res.json();
        return {
            volume: volumeId,
            book: bookId,
            chapter: chapter,
            verses: data.chapter.verses
        };
    },

    /**
     * Search scriptures
     */
    async search(query: string): Promise<any> {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
        return await res.json();
    }
};
