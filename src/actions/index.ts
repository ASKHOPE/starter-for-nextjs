import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendMagicLink, verifyOTP, AUTH_COOKIE_NAME } from '../lib/auth';

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
};
