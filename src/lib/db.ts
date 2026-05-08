import { databases } from "./appwrite";
import { ID, Query, Models } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TALKS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_TALKS_COLLECTION_ID!;
const AGENDA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_AGENDA_COLLECTION_ID!;

export interface Talk extends Models.Document {
  title: string;
  speaker: string | null;
  description: string | null;
  createdBy: string;
}

export interface AgendaItem extends Models.Document {
  title: string;
  description: string | null;
  scheduledDate: string;
  timeframe: '1month' | '6months' | '1year';
  createdBy: string;
}

/**
 * Database Wrapper following AGENTS.md principles.
 * Manages Gospel Talks and Agenda items.
 */
export const db = {
  // --- Gospel Talks ---
  talks: {
    async create(data: Partial<Talk>, userId: string): Promise<Talk> {
      if (!data.title || !userId) throw new Error("Title and User ID are required");
      return await databases.createDocument(
        DATABASE_ID,
        TALKS_COLLECTION,
        ID.unique(),
        {
          ...data,
          title: data.title.trim(),
          speaker: data.speaker?.trim() || null,
          description: data.description?.trim() || null,
          createdBy: userId,
        }
      ) as Talk;
    },

    async list(userId: string): Promise<Talk[]> {
      const response = await databases.listDocuments(DATABASE_ID, TALKS_COLLECTION, [
        Query.equal("createdBy", userId),
        Query.orderDesc("$createdAt"),
      ]);
      return response.documents as Talk[];
    },

    async delete(documentId: string): Promise<void> {
      await databases.deleteDocument(DATABASE_ID, TALKS_COLLECTION, documentId);
    }
  },

  // --- Agenda Scheduler ---
  agenda: {
    async create(data: Partial<AgendaItem>, userId: string): Promise<AgendaItem> {
      if (!data.title || !data.scheduledDate || !userId) {
        throw new Error("Title, Date, and User ID are required");
      }
      return await databases.createDocument(
        DATABASE_ID,
        AGENDA_COLLECTION,
        ID.unique(),
        {
          ...data,
          title: data.title.trim(),
          description: data.description?.trim() || null,
          scheduledDate: data.scheduledDate,
          timeframe: data.timeframe || "1month",
          createdBy: userId,
        }
      ) as AgendaItem;
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
      return await databases.updateDocument(
        DATABASE_ID,
        AGENDA_COLLECTION,
        documentId,
        updateData
      ) as AgendaItem;
    },

    async delete(documentId: string): Promise<void> {
      await databases.deleteDocument(DATABASE_ID, AGENDA_COLLECTION, documentId);
    }
  }
};
