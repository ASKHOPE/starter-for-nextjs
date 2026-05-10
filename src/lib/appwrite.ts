import { Client, Account, Databases, Storage } from "node-appwrite";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT || import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.APPWRITE_PROJECT_ID || import.meta.env.PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(import.meta.env.APPWRITE_API_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export async function createSessionClient(sessionValue?: string) {
  const client = new Client()
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT || import.meta.env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.APPWRITE_PROJECT_ID || import.meta.env.PUBLIC_APPWRITE_PROJECT_ID!);

  if (sessionValue) {
    client.setSession(sessionValue);
  }

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
