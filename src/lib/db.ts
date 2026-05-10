import { Client, Databases, ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite";

const DATABASE_ID = import.meta.env.APPWRITE_DATABASE_ID || import.meta.env.PUBLIC_APPWRITE_DATABASE_ID;

function createTable<T>(tableId: string) {
  return {
    async create(data: Omit<T, '$id' | '$createdAt' | '$updatedAt'>) {
      const { databases } = await createAdminClient();
      return await databases.createDocument(
        DATABASE_ID,
        tableId,
        ID.unique(),
        data as any
      );
    },

    async get(id: string) {
      try {
        const { databases } = await createAdminClient();
        return await databases.getDocument(DATABASE_ID, tableId, id);
      } catch {
        return null;
      }
    },

    async listByOwner(userId: string) {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(DATABASE_ID, tableId, [
        Query.equal('createdBy', [userId]),
        Query.orderDesc('$createdAt'),
      ]);
      return response.documents;
    },

    async update(id: string, data: Partial<T>) {
      const { databases } = await createAdminClient();
      // Remove immutable columns
      const { $id, $createdAt, $updatedAt, createdBy, teamId, ...updateData } = data as any;
      return await databases.updateDocument(DATABASE_ID, tableId, id, updateData);
    },

    async delete(id: string) {
      const { databases } = await createAdminClient();
      await databases.deleteDocument(DATABASE_ID, tableId, id);
    },
  };
}

export interface Agenda {
  $id: string;
  title: string;
  date: string;
  type: 'sacrament' | 'lesson' | 'activity';
  status: 'draft' | 'published';
  createdBy: string;
  data: any;
}

export const db = {
  agendas: createTable<Agenda>('agendas'),
};
