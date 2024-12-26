import Dexie, { type EntityTable } from 'dexie';

type VideoData = {
    id: string;
    videoId: string;
    title: string;
    channelTitle: string;
    publishedAt: string;
    channelId: string;
    channelLogo: string;
    description: string;
};

type FavoriteData = {
    id: string;
    title: string;
    description: string;
}

const db = new Dexie('YTCatalogDatabase') as Dexie & {
  "watch-later": EntityTable<
    VideoData,
    'id'
  >,
  favorites: EntityTable<
    FavoriteData,
    'id'
>
};

db.version(1).stores({
  "watch-later": '++id, videoId, title, channelTitle, publishedAt, channelId, channelLogo, description',
  favorites: 'id, title, description'
});

export type { FavoriteData }
export { db };