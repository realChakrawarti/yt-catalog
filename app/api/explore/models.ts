import { db } from "@/app/lib/firebase";
import {
  COLLECTION,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
} from "@/app/lib/server-helper";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

type CatalogData = {
  thumbnails: string[];
  id: string;
  title: string;
  description: string;
  updatedAt: string;
};

const getCatalogMetadata = async (catalogId: string) => {
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const catalogSnap = await getDoc(catalogRef);
  const catalogData = catalogSnap.data();
  return catalogData;
};

const getVideoThumbnails = (catalogData: DocumentData) => {
  const videos = catalogData.data.videos;
  const dayThumbnails = videos.day.map((video: any) => video.thumbnail.url);
  const weekThumbnails = videos.week.map((video: any) => video.thumbnail.url);
  const monthThumbnails = videos.month.map((video: any) => video.thumbnail.url);
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};

type VideoMetadata = {
  title: string;
  channelId: string;
  thumbnail: any;
  channelTitle: string;
  videoId: string;
  publishedAt: string;
  channelLogo: string;
};

type videoListData = {
  day: VideoMetadata[];
  week: VideoMetadata[];
  month: VideoMetadata[];
};

const SIX_HOURS = 21_600_000; // 6 hours in ms
const ONE_DAY = SIX_HOURS * 4;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_DAY * 30;

const LIMIT = 10;

function createPlaylistId(channel: string) {
  return channel.substring(0, 1) + "U" + channel.substring(2);
}

async function getPlaylistItems(channel: any) {
  const playlistId = createPlaylistId(channel.id);
  let playlistItemData: VideoMetadata[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlistId, LIMIT),
      { cache: "no-store" }
    ).then((data) => data.json());

    const playlistVideoItems = result.items;

    for (const item of playlistVideoItems) {
      playlistItemData.push({
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        thumbnail: item.snippet.thumbnails.standard,
        channelLogo: channel.logo,
        channelTitle: item.snippet.channelTitle,
        videoId: item.contentDetails.videoId,
        publishedAt: item.contentDetails.videoPublishedAt,
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    return playlistItemData;
  }
}

export async function getVideosByCatalogId(catalogId: string) {
  let videoList: VideoMetadata[] = [];

  let videoFilterData: videoListData = {
    day: [],
    week: [],
    month: [],
  };

  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);

  const catalogSnap = await getDoc(catalogRef);

  if (!catalogSnap.exists()) {
    return "Document doesn't exists";
  }

  const catalogSnapData = catalogSnap.data();

  const userRef = catalogSnapData?.videoRef;

  const userCatalogSnap = await getDoc(userRef);
  const userSnapData: any = userCatalogSnap.data();
  const channelList = userSnapData?.channels;

  if (!channelList.length) {
    return "No channel is yet added!";
  }

  // Get last updated, check if time has been 6 hours or not, if so make call to YouTube API, if not fetch from firestore
  const currentTime = Date.now();
  const deltaTime = SIX_HOURS;

  const lastUpdated = catalogSnapData.data.updatedAt.toDate();
  const lastUpdatedTime = new Date(lastUpdated).getTime();

  let recentUpdate = new Date(currentTime);

  if (currentTime - lastUpdatedTime > deltaTime) {
    for (const channel of channelList) {
      const data = await getPlaylistItems(channel);
      videoList = [...videoList, ...data];
    }

    // Sort the videoList by time
    videoList.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Filter by day (24 hour), week (7 days) and month (30 days)
    for (const video of videoList) {
      const videoPublishedAt = new Date(video.publishedAt).getTime();

      if (currentTime - videoPublishedAt < ONE_DAY) {
        videoFilterData.day.push(video);
      } else if (currentTime - videoPublishedAt < ONE_WEEK) {
        videoFilterData.week.push(video);
      } else if (currentTime - videoPublishedAt < ONE_MONTH) {
        videoFilterData.month.push(video);
      } else {
        continue;
      }
    }

    await setDoc(
      catalogRef,
      {
        data: {
          videos: videoFilterData,
          updatedAt: recentUpdate,
        },
      },
      { merge: true }
    );

    revalidatePath(`/@${catalogId}`);
    console.log(`Cached invalidated /@${catalogId}`);
  } else {
    videoFilterData = catalogSnapData.data.videos;
    recentUpdate = lastUpdated;
    console.log(
      `Returning cached data, next update on ${new Date(
        lastUpdatedTime + SIX_HOURS
      )}`
    );
  }

  return {
    title: catalogSnapData.title,
    description: catalogSnapData.description,
    videos: videoFilterData,
    nextUpdate: new Date(recentUpdate.getTime() + SIX_HOURS).toUTCString(),
  };
}

export async function getValidCatalogIds() {
  let catalogListData: CatalogData[] = [];
  const catalogsCollectionRef = collection(db, COLLECTION.catalogs);

  const validCatalogQuery = query(
    catalogsCollectionRef,
    where("data.videos", "!=", false),
    limit(25)
  );

  const catalogsDoc = await getDocs(validCatalogQuery);
  const catalogIds = catalogsDoc.docs.map((catalog) => catalog.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    catalogIds.map(async (catalogId) => {
      const catalogData = await getCatalogMetadata(catalogId);
      if (catalogData) {
        const metaData: CatalogData = {
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          description: catalogData?.description,
          id: "@" + catalogId,
          updatedAt: catalogData?.data.updatedAt.toDate(),
        };

        catalogListData.push(metaData);
      }
    })
  );

  return catalogListData;
}
