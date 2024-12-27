import Dexie, { type EntityTable } from 'dexie';

import { FavoriteData, VideoData } from '~/types-schema/types';

const db = new Dexie('YTCatalogDatabase') as Dexie & {
  "watch-later": EntityTable<
    VideoData,
    'videoId'
  >,
  favorites: EntityTable<
    FavoriteData,
    'id'
>
};

db.version(1).stores({
  "watch-later": 'videoId, title, channelTitle, publishedAt, channelId, channelLogo, description',
  favorites: 'id, title, description'
});

export type { FavoriteData }
export { db };