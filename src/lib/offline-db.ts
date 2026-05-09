import { 
  createRxDatabase, 
  RxDatabase,
  RxCollection
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

// Define the schemas
const generalConferenceTalkSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    speaker: { type: 'string' },
    conference: { type: 'string' },
    session: { type: 'string' },
    url: { type: 'string' },
    syncedAt: { type: 'number' }
  },
  required: ['id', 'title']
};

const sundayAgendaSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    date: { type: 'string' },
    weekOfMonth: { type: 'number' },
    eventType: { type: 'string' },
    title: { type: 'string' },
    sacrament: {
      type: 'object',
      properties: {
        conducting: { type: 'string' },
        organist: { type: 'string' },
        chorister: { type: 'string' },
        hymns: {
          type: 'object',
          properties: {
            opening: { type: 'string' },
            sacrament: { type: 'string' },
            intermediate: { type: 'string' },
            closing: { type: 'string' }
          }
        },
        prayers: {
          type: 'object',
          properties: {
            opening: { type: 'string' },
            closing: { type: 'string' }
          }
        },
        business: { type: 'string' },
        talks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              speaker: { type: 'string' },
              type: { type: 'string' },
              topicReference: { type: 'string' },
              talkReference: { type: 'string' },
              customTopic: { type: 'string' }
            }
          }
        }
      }
    },
    secondHour: {
      type: 'object',
      properties: {
        meetingType: { type: 'string' },
        teacher: { type: 'string' },
        topicReference: { type: 'string' },
        hymns: {
          type: 'object',
          properties: {
            opening: { type: 'string' }
          }
        },
        prayers: {
          type: 'object',
          properties: {
            opening: { type: 'string' },
            closing: { type: 'string' }
          }
        },
        announcements: { type: 'string' }
      }
    },
    syncedAt: { type: 'number' }
  },
  required: ['id', 'date', 'weekOfMonth', 'eventType']
};

const musicSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    number: { type: 'string' },
    url: { type: 'string' },
    syncedAt: { type: 'number' },
  },
  required: ['id', 'title'],
};

const gospelPrincipleSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    url: { type: 'string' },
    syncedAt: { type: 'number' },
  },
  required: ['id', 'title'],
};

const comeFollowMeSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    title: { type: 'string' },
    url: { type: 'string' },
    syncedAt: { type: 'number' },
  },
  required: ['id', 'title'],
};

import { 
  IConferenceTalk, 
  ISundayAgenda, 
  IMusic, 
  IGospelPrinciple, 
  IComeFollowMe 
} from '@/types/gospel';

export type GospelDatabase = RxDatabase<{
  general_conference_talks: RxCollection<IConferenceTalk>;
  sundayAgendas: RxCollection<ISundayAgenda>;
  hymns: RxCollection<IMusic>;
  childrens_songbook: RxCollection<IMusic>;
  new_hymns: RxCollection<IMusic>;
  youth_music: RxCollection<IMusic>;
  gospel_principles: RxCollection<IGospelPrinciple>;
  come_follow_me: RxCollection<IComeFollowMe>;
}>;

let dbPromise: Promise<GospelDatabase> | null = null;

export const getDatabase = async () => {
  if (typeof window === 'undefined') return null as any;
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await createRxDatabase<any>({
        name: 'gospeldb',
        storage: getRxStorageDexie()
      });

      await db.addCollections({
        general_conference_talks: { schema: generalConferenceTalkSchema },
        sundayAgendas: { schema: sundayAgendaSchema },
        hymns: { schema: musicSchema },
        childrens_songbook: { schema: musicSchema },
        new_hymns: { schema: musicSchema },
        youth_music: { schema: musicSchema },
        gospel_principles: { schema: gospelPrincipleSchema },
        come_follow_me: { schema: comeFollowMeSchema },
      });

      return db;
    })();
  }
  return dbPromise;
};

export const syncToRxDB = async (data: any) => {
  const db = await getDatabase();
  if (!db) return;
  
  const collections = ['general_conference_talks', 'hymns', 'childrens_songbook', 'new_hymns', 'youth_music', 'gospel_principles', 'come_follow_me', 'sundayAgendas'];
  
  for (const col of collections) {
    if (data[col] && Array.isArray(data[col])) {
      const collection = (db as any)[col];
      if (!collection) continue;
      
      await Promise.all(data[col].map((item: any) => {
        const doc = { ...item, id: item.$id || item.id };
        // Clean payload for RxDB
        delete doc.$id;
        delete doc.$createdAt;
        delete doc.$updatedAt;
        delete doc.$permissions;
        delete doc.$databaseId;
        delete doc.$collectionId;
        
        return collection.upsert(doc);
      }));
    }
  }
};
