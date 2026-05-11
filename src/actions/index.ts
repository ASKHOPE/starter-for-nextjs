import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMagicLink, verifyOTP, AUTH_COOKIE_NAME, getCurrentUser } from '../lib/auth';
import { createAdminClient } from '../lib/appwrite';
import { db } from '../lib/db';
import { Query } from 'node-appwrite';

export const server = {
  sendOTP: defineAction({
    input: z.object({
      email: z.string().email(),
    }),
    handler: async (input) => {
      const result = await sendMagicLink(input.email);
      return result;
    },
  }),
  verifyOTP: defineAction({
    input: z.object({
      userId: z.string(),
      otp: z.string().length(6),
    }),
    handler: async (input, context) => {
      const result = await verifyOTP(input.userId, input.otp);
      
      if (result.success && result.session) {
        // Set the session cookie
        context.cookies.set(AUTH_COOKIE_NAME, result.session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      
      return result;
    },
  }),
  logout: defineAction({
    handler: async (_, context) => {
      context.cookies.delete(AUTH_COOKIE_NAME, { path: "/" });
      return { success: true };
    },
  }),
  getAgendas: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");

      const agendas = await db.agendas.listByOwner(user.$id);
      return { success: true, agendas };
    },
  }),
  saveAgenda: defineAction({
    input: z.object({
      id: z.string().optional(),
      title: z.string(),
      date: z.string(),
      type: z.enum(['sacrament', 'lesson', 'activity']),
      status: z.enum(['draft', 'published']),
      data: z.any(),
    }),
    handler: async (input, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");

      if (input.id) {
        // Verify ownership before update
        const existing = await db.agendas.get(input.id);
        if (!existing || (existing as any).createdBy !== user.$id) {
          throw new Error("Forbidden");
        }
        const updated = await db.agendas.update(input.id, {
          ...input,
          createdBy: user.$id,
        });
        return { success: true, agenda: updated };
      } else {
        const created = await db.agendas.create({
          ...input,
          createdBy: user.$id,
        });
        return { success: true, agenda: created };
      }
    },
  }),
  deleteAgenda: defineAction({
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");

      const existing = await db.agendas.get(input.id);
      if (!existing || (existing as any).createdBy !== user.$id) {
        throw new Error("Forbidden");
      }

      await db.agendas.delete(input.id);
      return { success: true };
    },
  }),
  getLibraryItems: defineAction({
    input: z.object({
      collection: z.enum(['hymns', 'come_follow_me', 'general_conference_talks', 'gospel_principles', 'childrens_songbook', 'new_hymns', 'youth_music', 'scriptures']),
      search: z.string().optional(),
      volume: z.string().optional(),
    }),
    handler: async (input, context) => {
      console.log(`📚 Fetching library items for: ${input.collection}`);
      const { databases } = await createAdminClient();
      const DATABASE_ID = import.meta.env.APPWRITE_DATABASE_ID || import.meta.env.PUBLIC_APPWRITE_DATABASE_ID;
      console.log(`   Using Database: ${DATABASE_ID}`);

      const queries = [Query.limit(100)];
      if (input.search) {
        if (input.collection === 'scriptures') {
          queries.push(Query.search('content', input.search));
        } else {
          queries.push(Query.search('title', input.search));
        }
      }
      if (input.volume) {
        queries.push(Query.equal('volume', input.volume));
      }

      try {
        const response = await databases.listDocuments(DATABASE_ID, input.collection, queries);
        console.log(`   Found ${response.documents.length} items.`);
        return { success: true, items: response.documents };
      } catch (err: any) {
        console.error(`❌ Error fetching ${input.collection}:`, err.message);
        return { success: false, items: [], error: err.message };
      }
    },
  }),
  globalSearch: defineAction({
    input: z.object({
      query: z.string(),
    }),
    handler: async (input, context) => {
      const { databases } = await createAdminClient();
      const DATABASE_ID = import.meta.env.APPWRITE_DATABASE_ID || import.meta.env.PUBLIC_APPWRITE_DATABASE_ID;
      
      // Search across multiple collections
      const results = await Promise.all([
        databases.listDocuments(DATABASE_ID, 'hymns', [Query.search('title', input.query), Query.limit(5)]),
        databases.listDocuments(DATABASE_ID, 'agendas', [Query.search('title', input.query), Query.limit(5)]),
        databases.listDocuments(DATABASE_ID, 'general_conference_talks', [Query.search('title', input.query), Query.limit(5)]),
      ]);

      return {
        success: true,
        hymns: results[0].documents,
        agendas: results[1].documents,
        talks: results[2].documents,
      };
    },
  }),
  syncData: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");

      // In a real app, this might trigger a background task
      // For now, we'll return a success message
      return { success: true, message: "Sync started. Content will be updated shortly." };
    },
  }),
  getMe: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) return { success: false };
      return { success: true, user };
    },
  }),
};
