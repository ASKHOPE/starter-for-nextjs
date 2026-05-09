import { NextResponse } from 'next/server';
import { Client, Databases, Query } from 'node-appwrite';

export async function GET() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const databases = new Databases(client);
  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

  try {
    // Fetch all collections in parallel for performance
    const [hymns, children, newHymns, youth, talks, manuals, principles] = await Promise.all([
      databases.listDocuments(DATABASE_ID, 'hymns', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'childrens_songbook', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'new_hymns', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'youth_music', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'general_conference_talks', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'come_follow_me', [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, 'gospel_principles', [Query.limit(1000)])
    ]);

    return NextResponse.json({
      type: 'success',
      data: {
        hymns: hymns.documents,
        childrens_songbook: children.documents,
        new_hymns: newHymns.documents,
        youth_music: youth.documents,
        general_conference_talks: talks.documents,
        come_follow_me: manuals.documents,
        gospel_principles: principles.documents
      }
    });
  } catch (error: any) {
    console.error('Library Sync Error:', error);
    return NextResponse.json({ 
      type: 'error', 
      error: error.message || 'Failed to sync library data' 
    }, { status: 500 });
  }
}
