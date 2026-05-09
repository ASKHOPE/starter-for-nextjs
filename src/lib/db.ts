import { databases } from "./appwrite";
import { ID, Query, Models } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TALKS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_TALKS_COLLECTION_ID!;
const AGENDA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_AGENDA_COLLECTION_ID!;
const HYMNS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_HYMNS_COLLECTION_ID!;
const TOPICS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_TOPICS_COLLECTION_ID!;
const MANUALS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_MANUALS_COLLECTION_ID!;

export interface Talk extends Models.Document {
  title: string;
  speaker: string | null;
  summary: string | null;
  conference: string; // e.g. "April 2026"
  session: string;    // e.g. "Saturday Morning"
  url: string | null;
  createdBy: string;
}

export interface Hymn extends Models.Document {
  number: string;
  title: string;
  category: string;
  url: string;
}

export interface Topic extends Models.Document {
  title: string;
  description: string | null;
  url: string;
}

export interface Manual extends Models.Document {
  title: string;
  url: string;
  category: string;
}

export interface AgendaItem extends Models.Document {
  title: string;
  description: string | null;
  scheduledDate: string;
  timeframe: '1month' | '6months' | '1year';
  createdBy: string;
}

export type EventType = 'Standard' | 'GeneralConference' | 'StakeConference' | 'WardConference' | 'SpecialDevotional' | 'AsiaAreaDevotional';
export type WeekOfMonth = 1 | 2 | 3 | 4 | 5;

export interface SundayAgenda extends Models.Document {
  createdBy: string;
  date: string;
  weekOfMonth: WeekOfMonth;
  eventType: EventType;
  title?: string;
  sacrament?: {
    conducting: string;
    organist: string;
    chorister: string;
    hymns: { opening: string; sacrament: string; intermediate?: string; closing: string };
    prayers: { opening: string; closing: string };
    business: string;
    talks: [
      { speaker: string; type: 'GospelTopic'; topicReference?: string },
      { speaker: string; type: 'ConferenceTalk'; talkReference?: string },
      { speaker: string; type: 'Custom'; customTopic?: string }
    ];
  };
  secondHour?: {
    meetingType: 'SundaySchool' | 'PriesthoodRS' | 'Combined';
    teacher: string;
    topicReference?: string; // CFMLesson, ConferenceTalk, or Custom String
    hymns?: { opening: string };
    prayers?: { opening: string; closing: string };
    announcements?: string;
  };
}

/**
 * Database Wrapper following AGENTS.md principles.
 */
export const db = {
  // ... existing services ...
  
  // --- Sunday Agenda ---
  sundayAgenda: {
    async create(data: Partial<SundayAgenda>, userId: string): Promise<SundayAgenda> {
      return await databases.createDocument(DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_SUNDAY_AGENDA_COLLECTION_ID!, ID.unique(), {
        ...data,
        createdBy: userId,
      }) as SundayAgenda;
    },
    async list(userId: string): Promise<SundayAgenda[]> {
      const response = await databases.listDocuments(DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_SUNDAY_AGENDA_COLLECTION_ID!, [
        Query.equal("createdBy", userId),
        Query.orderAsc("date"),
      ]);
      return response.documents as SundayAgenda[];
    },
    async delete(documentId: string): Promise<void> {
      await databases.deleteDocument(DATABASE_ID, process.env.NEXT_PUBLIC_APPWRITE_SUNDAY_AGENDA_COLLECTION_ID!, documentId);
    }
  },
  // --- Gospel Talks ---
  talks: {
    async create(data: Partial<Talk>, userId: string): Promise<Talk> {
      return await databases.createDocument(DATABASE_ID, TALKS_COLLECTION, ID.unique(), {
        ...data,
        createdBy: userId,
      }) as Talk;
    },

    async list(userId: string, queries: string[] = []): Promise<Talk[]> {
      const response = await databases.listDocuments(DATABASE_ID, TALKS_COLLECTION, [
        Query.equal("createdBy", userId),
        ...queries,
      ]);
      return response.documents as Talk[];
    },

    async delete(documentId: string): Promise<void> {
      await databases.deleteDocument(DATABASE_ID, TALKS_COLLECTION, documentId);
    }
  },

  // --- Hymns ---
  hymns: {
    async create(data: Partial<Hymn>): Promise<Hymn> {
      return await databases.createDocument(DATABASE_ID, HYMNS_COLLECTION, ID.unique(), data) as Hymn;
    },
    async list(): Promise<Hymn[]> {
      const response = await databases.listDocuments(DATABASE_ID, HYMNS_COLLECTION);
      return response.documents as Hymn[];
    }
  },

  // --- Gospel Topics ---
  topics: {
    async create(data: Partial<Topic>): Promise<Topic> {
      return await databases.createDocument(DATABASE_ID, TOPICS_COLLECTION, ID.unique(), data) as Topic;
    },
    async list(): Promise<Topic[]> {
      const response = await databases.listDocuments(DATABASE_ID, TOPICS_COLLECTION);
      return response.documents as Topic[];
    }
  },

  // --- Manuals ---
  manuals: {
    async create(data: Partial<Manual>): Promise<Manual> {
      return await databases.createDocument(DATABASE_ID, MANUALS_COLLECTION, ID.unique(), data) as Manual;
    },
    async list(): Promise<Manual[]> {
      const response = await databases.listDocuments(DATABASE_ID, MANUALS_COLLECTION);
      return response.documents as Manual[];
    }
  },

  // --- Agenda Scheduler ---
  agenda: {
    async create(data: Partial<AgendaItem>, userId: string): Promise<AgendaItem> {
      if (!data.title || !data.scheduledDate || !userId) {
        throw new Error("Title, Date, and User ID are required");
      }
      return await databases.createDocument(DATABASE_ID, AGENDA_COLLECTION, ID.unique(), {
        ...data,
        createdBy: userId,
      }) as AgendaItem;
    },

    async listByTimeframe(userId: string, timeframe: string): Promise<AgendaItem[]> {
      const queries = [Query.equal("createdBy", userId)];
      if (timeframe) queries.push(Query.equal("timeframe", timeframe));
      queries.push(Query.orderAsc("scheduledDate"));
      const response = await databases.listDocuments(DATABASE_ID, AGENDA_COLLECTION, queries);
      return response.documents as AgendaItem[];
    },

    async update(documentId: string, data: Partial<AgendaItem>): Promise<AgendaItem> {
      const { $id, $createdAt, $updatedAt, createdBy, ...updateData } = data as any;
      return await databases.updateDocument(DATABASE_ID, AGENDA_COLLECTION, documentId, updateData) as AgendaItem;
    },

    async delete(documentId: string): Promise<void> {
      await databases.deleteDocument(DATABASE_ID, AGENDA_COLLECTION, documentId);
    }
  }
};

