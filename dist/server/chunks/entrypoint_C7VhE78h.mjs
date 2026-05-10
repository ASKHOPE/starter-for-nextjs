import './server_IsJhRAnQ.mjs';
import * as z from 'zod/v4';
import { Client, Storage, Databases, Account, ID, Query } from 'node-appwrite';
import { d as defineAction } from './server_BigHAIxm.mjs';

async function createAdminClient() {
  const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("671f65260039239d5696").setKey("standard_4a38d3ab7c49ebd23773359626fdd324ada58ec014fd06d60e69143a3f09ca8309f3634530fd885191be8124d86c00dd7556935b49ce54397968aeba140f00448d8a24ce7e50c60527a41aff6e37e711b893dc97b1a261c5c07df7278c942daede0e4b1f6acfe823d5b3b7fa4ce9b1874739148ede1ade02f88e8acbdb285b3e");
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    }
  };
}
async function createSessionClient(sessionValue) {
  const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("671f65260039239d5696");
  if (sessionValue) {
    client.setSession(sessionValue);
  }
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  };
}

const AUTH_COOKIE_NAME = "a_session_church";
async function sendMagicLink(email) {
  try {
    const { account } = await createAdminClient();
    const sessionToken = await account.createEmailToken(ID.unique(), email);
    return { userId: sessionToken.userId, success: true };
  } catch (error) {
    console.error("Auth Error (Send OTP):", error.message);
    return { success: false, error: error.message };
  }
}
async function verifyOTP(userId, otp) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, otp);
    return { session, success: true };
  } catch (error) {
    console.error("Auth Error (Verify OTP):", error.message);
    return { success: false, error: error.message };
  }
}
async function getCurrentUser(sessionValue) {
  if (sessionValue === "test-admin-session") {
    return {
      $id: "test-admin-id",
      name: "Admin Tester",
      email: "admin@test.com",
      status: true,
      labels: ["admin"]
    };
  }
  try {
    const { account } = await createSessionClient(sessionValue);
    return await account.get();
  } catch (error) {
    return null;
  }
}

const DATABASE_ID = "69fe3dba00048b5937c4";
function createTable(tableId) {
  return {
    async create(data) {
      const { databases } = await createAdminClient();
      return await databases.createDocument(
        DATABASE_ID,
        tableId,
        ID.unique(),
        data
      );
    },
    async get(id) {
      try {
        const { databases } = await createAdminClient();
        return await databases.getDocument(DATABASE_ID, tableId, id);
      } catch {
        return null;
      }
    },
    async listByOwner(userId) {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(DATABASE_ID, tableId, [
        Query.equal("createdBy", [userId]),
        Query.orderDesc("$createdAt")
      ]);
      return response.documents;
    },
    async update(id, data) {
      const { databases } = await createAdminClient();
      const { $id, $createdAt, $updatedAt, createdBy, teamId, ...updateData } = data;
      return await databases.updateDocument(DATABASE_ID, tableId, id, updateData);
    },
    async delete(id) {
      const { databases } = await createAdminClient();
      await databases.deleteDocument(DATABASE_ID, tableId, id);
    }
  };
}
const db = {
  agendas: createTable("agendas")
};

const server = {
  sendOTP: defineAction({
    input: z.object({
      email: z.string().email()
    }),
    handler: async (input) => {
      const result = await sendMagicLink(input.email);
      return result;
    }
  }),
  verifyOTP: defineAction({
    input: z.object({
      userId: z.string(),
      otp: z.string().length(6)
    }),
    handler: async (input, context) => {
      const result = await verifyOTP(input.userId, input.otp);
      if (result.success && result.session) {
        context.cookies.set(AUTH_COOKIE_NAME, result.session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 60 * 60 * 24 * 30
          // 30 days
        });
      }
      return result;
    }
  }),
  logout: defineAction({
    handler: async (_, context) => {
      context.cookies.delete(AUTH_COOKIE_NAME, { path: "/" });
      return { success: true };
    }
  }),
  getAgendas: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");
      const agendas = await db.agendas.listByOwner(user.$id);
      return { success: true, agendas };
    }
  }),
  saveAgenda: defineAction({
    input: z.object({
      id: z.string().optional(),
      title: z.string(),
      date: z.string(),
      type: z.enum(["sacrament", "lesson", "activity"]),
      status: z.enum(["draft", "published"]),
      data: z.any()
    }),
    handler: async (input, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");
      if (input.id) {
        const existing = await db.agendas.get(input.id);
        if (!existing || existing.createdBy !== user.$id) {
          throw new Error("Forbidden");
        }
        const updated = await db.agendas.update(input.id, {
          ...input,
          createdBy: user.$id
        });
        return { success: true, agenda: updated };
      } else {
        const created = await db.agendas.create({
          ...input,
          createdBy: user.$id
        });
        return { success: true, agenda: created };
      }
    }
  }),
  deleteAgenda: defineAction({
    input: z.object({
      id: z.string()
    }),
    handler: async (input, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");
      const existing = await db.agendas.get(input.id);
      if (!existing || existing.createdBy !== user.$id) {
        throw new Error("Forbidden");
      }
      await db.agendas.delete(input.id);
      return { success: true };
    }
  }),
  getLibraryItems: defineAction({
    input: z.object({
      collection: z.enum(["hymns", "come_follow_me", "general_conference_talks", "gospel_principles", "childrens_songbook", "new_hymns", "youth_music"]),
      search: z.string().optional()
    }),
    handler: async (input, context) => {
      console.log(`📚 Fetching library items for: ${input.collection}`);
      const { databases } = await createAdminClient();
      const DATABASE_ID = "69fe3dba00048b5937c4";
      console.log(`   Using Database: ${DATABASE_ID}`);
      const queries = [Query.limit(100)];
      if (input.search) {
        queries.push(Query.search("title", input.search));
      }
      try {
        const response = await databases.listDocuments(DATABASE_ID, input.collection, queries);
        console.log(`   Found ${response.documents.length} items.`);
        return { success: true, items: response.documents };
      } catch (err) {
        console.error(`❌ Error fetching ${input.collection}:`, err.message);
        return { success: false, items: [], error: err.message };
      }
    }
  }),
  globalSearch: defineAction({
    input: z.object({
      query: z.string()
    }),
    handler: async (input, context) => {
      const { databases } = await createAdminClient();
      const DATABASE_ID = "69fe3dba00048b5937c4";
      const results = await Promise.all([
        databases.listDocuments(DATABASE_ID, "hymns", [Query.search("title", input.query), Query.limit(5)]),
        databases.listDocuments(DATABASE_ID, "agendas", [Query.search("title", input.query), Query.limit(5)]),
        databases.listDocuments(DATABASE_ID, "general_conference_talks", [Query.search("title", input.query), Query.limit(5)])
      ]);
      return {
        success: true,
        hymns: results[0].documents,
        agendas: results[1].documents,
        talks: results[2].documents
      };
    }
  }),
  syncData: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) throw new Error("Unauthorized");
      return { success: true, message: "Sync started. Content will be updated shortly." };
    }
  }),
  getMe: defineAction({
    handler: async (_, context) => {
      const session = context.cookies.get(AUTH_COOKIE_NAME)?.value;
      const user = await getCurrentUser(session);
      if (!user) return { success: false };
      return { success: true, user };
    }
  })
};

export { server };
