import Dexie, { type EntityTable } from 'dexie';

type WatchLaterData = {
    id: string;
    videoId: string;
    title: string;
    channelTitle: string;
    publishedAt: string;
    channelId: string;
    channelLogo: string;
    description: string;
};

const db = new Dexie('YTCatalogDatabase') as Dexie & {
  "watch-later": EntityTable<
    WatchLaterData,
    'id' // primary key "id" (for the typings only)
  >;
};

db.version(1).stores({
  "watch-later": '++id, videoId, title, channelTitle, publishedAt, channelId, channelLogo, description' // primary key "id" (for the runtime!)
});

export type { WatchLaterData };
export { db };