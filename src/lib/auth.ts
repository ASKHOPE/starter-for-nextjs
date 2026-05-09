import { account } from "./appwrite";
import { ID } from "appwrite";
import type { Models } from "appwrite";

/**
 * Auth Wrapper following AGENTS.md principles.
 * Handles Phone Authentication flow.
 */
export const auth = {
  /**
   * Sends an OTP to the provided phone number.
   * @param phoneNumber - Full phone number with country code (e.g., +1234567890)
   */
  async sendOtp(phoneNumber: string): Promise<{ userId: string }> {
    if (!phoneNumber) throw new Error("Phone number is required");
    
    // Create a phone token (OTP)
    const token = await account.createPhoneToken(ID.unique(), phoneNumber);
    return { userId: token.userId };
  },

  /**
   * Verifies the OTP and creates a session.
   * @param userId - The userId returned from sendOtp
   * @param secret - The OTP code received via SMS
   */
  async verifyOtp(userId: string, secret: string): Promise<Models.Session> {
    if (!userId || !secret) throw new Error("User ID and OTP are required");
    
    // Complete the session
    const session = await account.createSession(userId, secret);
    return session;
  },

  /**
   * Gets the current user session.
   */
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  /**
   * Logs out the user.
   */
  async logout(): Promise<void> {
    await account.deleteSession("current");
  }
};
