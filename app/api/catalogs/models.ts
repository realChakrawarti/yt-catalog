import { db } from "@/lib/firebase";
import {
  COLLECTION,
  createNanoidToken,
  toUTCString,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_CHANNELS_INFORMATION,
} from "@/lib/server-helper";
import {
  arrayRemove,
  collection,
  doc,
  DocumentData,
  FieldValue,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import topicData from "./youtube-topics.json";
import { revalidatePath } from "next/cache";

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

type CatalogData = {
  thumbnails: string[];
  id: string;
  title: string;
  description: string;
  updatedAt: string;
};

const SIX_HOURS = 21_600_000; // 6 hours in ms
const ONE_DAY = SIX_HOURS * 4;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_DAY * 30;

const LIMIT = 10;

type TopicId = keyof typeof topicData;

function extractTopics(topicIds: TopicId[]): string[] {
  let topicNames: string[] = [];
  topicIds.forEach((topicId) => topicNames.push(topicData[topicId]));
  return topicNames;
}

async function getChannelsInfo(channels: string[]) {
  let channelsInfo: any[] = [];
  // Create a separate doc with channels information, fetch from youtube API
  const response = await fetch(YOUTUBE_CHANNELS_INFORMATION(channels));
  const result = await response.json();

  const channelListItems = result?.items;

  for (let i = 0; i < channelListItems?.length; i++) {
    const channelInfo = channelListItems[i];

    const channelMeta = {
      id: channelInfo.id,
      handle: channelInfo.snippet.customUrl,
      title: channelInfo.snippet.title,
      description: channelInfo.snippet.description,
      logo: channelInfo.snippet.thumbnails.medium.url,
      topics: extractTopics(channelInfo.topicDetails.topicIds),
    };

    channelsInfo.push(channelMeta);
  }

  return channelsInfo;
}

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
        thumbnail: item.snippet.thumbnails.medium,
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

export async function updateCatalogVideos(catalogId: string) {
  const data = await getVideosByCatalogId(catalogId);
  return data;
}

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param catalogId
 * @param userId
 * @returns
 */
export async function getCatalogById(catalogId: string, userId: string) {
  // Get channel list
  const userRef = doc(db, COLLECTION.users, userId);

  let catalogResponseData = {};

  try {
    const userPageRef = doc(userRef, COLLECTION.catalogs, catalogId);

    const channelList = await getDoc(userPageRef);
    const channelListData = channelList.data()?.channels;

    // Get title and description

    const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
    const catalogSnap = await getDoc(catalogRef);
    const catalogData = catalogSnap.data();

    catalogResponseData = {
      title: catalogData?.title,
      description: catalogData?.description,
      channelList: channelListData,
    };
  } catch (err) {
    console.error(err);
  }

  return catalogResponseData;
}

/**
 * This function returns all catalogs of a user
 * @param userId
 * @returns
 */
export async function getCatalogByUser(userId: string) {
  let userCatalogsData: any[] = [];

  const userRef = doc(db, COLLECTION.users, userId);
  try {
    const userCatalogsCollectionRef = collection(userRef, COLLECTION.catalogs);
    const userCatalogsDoc = await getDocs(userCatalogsCollectionRef);
    const catalogIds = userCatalogsDoc.docs.map((doc) => doc.id);

    if (!catalogIds.length) {
      return userCatalogsData;
    }

    for (let i = 0; i < catalogIds.length; i++) {
      const catalogId = catalogIds[i];
      const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
      const catalogSnap = await getDoc(catalogRef);
      const catalogData = catalogSnap.data();

      userCatalogsData.push({
        id: catalogId,
        title: catalogData?.title,
        description: catalogData?.description,
        videoData: {
          updatedAt: toUTCString(catalogData?.data?.updatedAt),
          videos: catalogData?.data?.videos,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  return userCatalogsData;
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

export async function deleteChannel(
  userId: string,
  catalogId: string,
  channels: any[]
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  await setDoc(userCatalogRef, {
    channels: channels,
    updatedAt: new Date(),
  });
}

/**
 * This function updates the channels of a specific catalogId
 * @param userId
 * @param catalogId
 * @param channels
 */
export async function updateChannels(
  userId: string,
  catalogId: string,
  catalogPayload: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);

  const { channels, title, description } = catalogPayload;

  try {
    const channelsInfo = await getChannelsInfo(channels);

    await updateDoc(userCatalogRef, {
      channels: channelsInfo,
      updatedAt: new Date(),
    },);

    if (title || description) {
      await updateDoc(catalogRef, {
        title: title,
        description: description,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * This function creates a catalog page for a user
 * @param userId
 */
export async function createCatalog(userId: string) {
  const userRef = doc(db, COLLECTION.users, userId);
  const nanoidToken = createNanoidToken();
  const catalogRef = doc(db, COLLECTION.catalogs, nanoidToken);

  // Add a doc to user -> page collection
  const userPageRef = doc(userRef, COLLECTION.catalogs, nanoidToken);

  // Create pages sub-collection
  await setDoc(userPageRef, {
    channels: [],
    updatedAt: new Date(),
  });

  // Add a doc to pages collection
  await setDoc(catalogRef, {
    data: {
      updatedAt: new Date(0),
    },
    videoRef: userPageRef,
    title: `Title - ${nanoidToken}`,
    description: `Description - ${nanoidToken}`,
  });

  return nanoidToken;
}
