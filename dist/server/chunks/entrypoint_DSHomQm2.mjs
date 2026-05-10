import './server_UlLFQcGP.mjs';
import * as z from 'zod/v4';
import { Client, Storage, Databases, Account, ID } from 'node-appwrite';
import { d as defineAction } from './server_CnwHzkPb.mjs';

async function createAdminClient() {
  const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT || process.env.PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1").setProject(process.env.APPWRITE_PROJECT_ID || process.env.PUBLIC_APPWRITE_PROJECT_ID).setKey(process.env.APPWRITE_API_KEY);
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
  })
};

export { server };
