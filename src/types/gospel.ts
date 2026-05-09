export interface IGospelBase {
  id: string;
  $id?: string;
  syncedAt?: number;
}

export interface IConferenceTalk extends IGospelBase {
  title: string;
  speaker: string;
  conference: string;
  session?: string;
  url: string;
  description?: string;
}

export interface IMusic extends IGospelBase {
  title: string;
  number?: string;
  url: string;
}

export interface IGospelPrinciple extends IGospelBase {
  title: string;
  url: string;
  description?: string;
}

export interface IComeFollowMe extends IGospelBase {
  title: string;
  url: string;
  description?: string;
}

export interface ISundayAgenda extends IGospelBase {
  date: string;
  weekOfMonth: number;
  eventType: string; // 'Standard', 'GeneralConference', etc.
  title?: string;
  sacrament?: {
    conducting?: string;
    organist?: string;
    chorister?: string;
    hymns?: {
      opening?: string;
      sacrament?: string;
      intermediate?: string;
      closing?: string;
    };
    prayers?: {
      opening?: string;
      closing?: string;
    };
    business?: string;
    talks?: Array<{
      speaker: string;
      type: 'Youth' | 'Adult' | 'Concluding';
      topicReference?: string;
      talkReference?: string;
      customTopic?: string;
    }>;
  };
  secondHour?: {
    meetingType?: string;
    teacher?: string;
    topicReference?: string;
    hymns?: {
      opening?: string;
    };
    prayers?: {
      opening?: string;
      closing?: string;
    };
    announcements?: string;
  };
}

export type LibTab = "General Conference" | "Hymns" | "Children's Songbook" | "New Hymns" | "Youth Music" | "Gospel Principles" | "Come Follow Me" | "Scriptures";

export interface IVolume {
  id: string;
  name: string;
  books: IBook[];
}

export interface IBook {
  id: string;
  name: string;
  chapters: number;
}

export interface IChapter {
  volumeId: string;
  bookId: string;
  chapter: number;
  verses: IVerse[];
}

export interface IVerse {
  verse: number;
  text: string;
}
