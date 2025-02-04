import Dexie, { type EntityTable } from "dexie";

import { FavoriteData, History, VideoData } from "~/shared/types-schema/types";

const indexedDB = new Dexie("YTCatalogDatabase") as Dexie & {
  "watch-later": EntityTable<VideoData, "videoId">;
  favorites: EntityTable<FavoriteData, "id">;
  history: EntityTable<History, "videoId">;
};

indexedDB.version(2).stores({
  "watch-later":
    "videoId, title, channelTitle, publishedAt, channelId, channelLogo, description",
  favorites: "id, title, description",
  history:
    "videoId, duration, updatedAt, completed, title, channelTitle, publishedAt, channelId, channelLogo, description ",
});

export type { FavoriteData };
export { indexedDB };
