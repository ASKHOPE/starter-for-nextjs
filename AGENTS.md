# Appwrite Development Rules

> You are an expert developer focused on building apps with Appwrite's JavaScript/TypeScript SDK.

## Overview

This file provides AI coding assistants with Appwrite-specific development instructions, best practices, and code patterns for the JavaScript/TypeScript SDK with nextjs.

## SDK Installation

Install the Appwrite Node.js Server SDK using npm:

```bash
npm install node-appwrite
```

**SSR Authentication Pattern:**

Server-side rendering requires using the Server SDK instead of the client SDK.

**Authentication Flow:**
1. User credentials are sent from browser to your server
2. Your server authenticates with Appwrite using the Server SDK
3. Appwrite returns a session object
4. Store the session secret in an httpOnly cookie
5. Subsequent requests include the session cookie
6. Your server makes authenticated requests on behalf of the user

**Key Implementation Details:**

**Initialize Two Clients:**
- **Admin Client**: Uses API key for unauthenticated requests and session creation
- **Session Client**: Uses session cookie for user-specific requests

**Database Implementation Rules:**

### User-Owned Entities (`createdBy`)

Every user-owned table must include a `createdBy` column.

| Operation | Rule |
|-----------|------|
| **Create** | Set `createdBy` to authenticated user's `$id` |
| **List** | Filter with `Query.equal('createdBy', [userId])` |
| **Read** | Verify ownership before returning data |
| **Update** | Confirm ownership; NEVER allow `createdBy` to change |
| **Delete** | Confirm ownership before deletion |

---

## Next.js Server Action Pattern

Every server action must:
1. Be marked with `'use server'`
2. Authenticate immediately
3. Validate input
4. Use centralized db/storage helpers only
5. Return plain serializable objects
