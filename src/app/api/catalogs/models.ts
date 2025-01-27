import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { revalidatePath, unstable_noStore } from "next/cache";

import type {
  CatalogByIdResponse,
  CatalogChannel,
  CatalogPlaylist,
  PlaylistItem,
  ValidMetadata,
} from "~/types-schema/types";
import { FOUR_HOURS, ONE_DAY, ONE_MONTH, ONE_WEEK } from "~/utils/constant";
import { db } from "~/utils/firebase";
import {
  COLLECTION,
  createNanoidToken,
  toUTCString,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_CHANNELS_INFORMATION,
} from "~/utils/server-helper";

import topicData from "./youtube-topics.json";

type VideoMetadata = {
  description: string;
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

type TopicId = keyof typeof topicData;

const LIMIT = 10;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // TODO: Consider storing private key as encoded base64, then decode and use
    private_key: process.env
      .GOOGLE_ANALYTICS_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
  },
});

function extractTopics(topicIds: TopicId[]): string[] {
  let topicNames: string[] = [];
  topicIds.forEach((topicId) => topicNames.push(topicData[topicId]));
  return topicNames;
}

/**
 * Retrieves detailed information for a list of YouTube channels.
 *
 * @param channels - An array of YouTube channel IDs to fetch information for
 * @returns An array of channel metadata objects containing details like ID, handle, title, description, logo, and topics
 *
 * @remarks
 * Fetches channel information from the YouTube API and transforms the response into a structured format.
 * Extracts key details such as channel title, description, custom URL, thumbnail, and associated topics.
 *
 * @throws {Error} If there's an issue fetching channel information from the YouTube API
 */
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
      // TODO: Remove Topics, feels a bit redundant
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

/**
 * Generates a unique playlist ID based on a channel ID.
 *
 * @param channel - The original YouTube channel ID
 * @returns A modified playlist ID derived from the input channel ID
 *
 * @remarks
 * This function transforms a channel ID by replacing the second character with 'U',
 * which is a convention used by YouTube to generate playlist IDs from channel IDs.
 */
function createPlaylistId(channel: string) {
  return channel.substring(0, 1) + "U" + channel.substring(2);
}

/**
 * Retrieves videos from a specified YouTube playlist, filtering out private and older videos.
 *
 * @param playlist - The playlist object containing playlist details
 * @returns An array of video metadata for public videos published within the last 30 days
 *
 * @remarks
 * This function fetches playlist items from the YouTube API and applies the following filters:
 * - Excludes private videos
 * - Excludes videos older than 30 days
 *
 * @throws {Error} Logs any errors encountered during the API fetch process
 */
async function getPlaylistVideos(playlist: any) {
  const playlistItemData: VideoMetadata[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlist.id, LIMIT),
      { cache: "no-store" }
    ).then((data) => data.json());

    const currentTime = Date.now();
    const playlistVideoItems = result.items;

    for (const item of playlistVideoItems) {
      // Don't return video which are private, deleted (privacyStatusUnspecified) or are older than 30 days (ONE MONTH)
      const videoPublished = item.contentDetails.videoPublishedAt;
      if (
        item.status.privacyStatus === "private" ||
        item.status.privacyStatus === "privacyStatusUnspecified" ||
        currentTime - new Date(videoPublished).getTime() > ONE_MONTH
      ) {
        continue;
      }

      playlistItemData.push({
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        thumbnail: item.snippet.thumbnails.medium,
        channelLogo: playlist.channelLogo,
        channelTitle: item.snippet.channelTitle,
        videoId: item.contentDetails.videoId,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt,
      });
    }
  } catch (err) {
    console.error(err);
  }

  return playlistItemData;
}

/**
 * Retrieves videos from a YouTube channel's uploads playlist.
 *
 * @param channel - The channel object containing channel details
 * @returns An array of video metadata for public videos published within the last 30 days
 *
 * @remarks
 * This function filters out private videos and videos older than 30 days from the channel's uploads playlist.
 * It uses the YouTube API to fetch playlist items and transforms them into a standardized video metadata format.
 *
 * @throws {Error} Logs any errors encountered during the API request
 */
async function getChannelVideos(channel: any) {
  const playlistId = createPlaylistId(channel.id);
  const playlistItemData: VideoMetadata[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlistId, LIMIT),
      { cache: "no-store" }
    ).then((data) => data.json());

    const currentTime = Date.now();
    const playlistVideoItems = result.items;

    for (const item of playlistVideoItems) {
      // Don't return video which are private and or older than 30 days (ONE MONTH)
      const videoPublished = item.contentDetails.videoPublishedAt;
      if (
        item.status.privacyStatus === "private" ||
        currentTime - new Date(videoPublished).getTime() > ONE_MONTH
      ) {
        continue;
      }

      playlistItemData.push({
        title: item.snippet.title,
        channelId: item.snippet.channelId,
        thumbnail: item.snippet.thumbnails.medium,
        channelLogo: channel.logo,
        channelTitle: item.snippet.channelTitle,
        videoId: item.contentDetails.videoId,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt,
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    return playlistItemData;
  }
}

function transformAnalyticsData(
  response: protos.google.analytics.data.v1beta.IRunReportResponse
) {
  // Check if response exists and has rows
  if (!response?.rows) {
    return [];
  }

  // Map through the rows and create an object with id and value of the catalog
  return response.rows.map((row) => {
    if (row.dimensionValues && row.metricValues) {
      return {
        id: row?.dimensionValues[0]?.value,
        pageviews: parseInt(row?.metricValues[0]?.value ?? "0", 10),
      };
    }
  });
}

export async function getPageviewByCatalogId(
  catalogId: string
): Promise<number> {
  // TODO: Make a function to check if the code is running on development or on production server
  if (process.env.NODE_ENV === "development") {
    return 69;
  }

  const request = {
    property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: "90daysAgo",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          matchType: "EXACT",
          value: `/c/${catalogId}`,
        },
      },
    },
  } as protos.google.analytics.data.v1beta.IRunReportRequest;

  console.log(`Querying pageview of catalog: ${catalogId}`);

  // Refer: https://github.com/googleanalytics/nodejs-docs-samples/blob/e21670ab2c79a12c45bffa10ac26e0324279a718/google-analytics-data/run_report.js#L33-L93
  const [response] = await analyticsDataClient.runReport(request);

  const data = transformAnalyticsData(response);
  return data?.at(0)?.pageviews ?? 0;
}

/**
 * Retrieves and manages video metadata for a specific catalog.
 *
 * @param catalogId - Unique identifier for the catalog
 * @returns Catalog video metadata, including filtered videos, pageviews, and update information
 *
 * @remarks
 * This function performs the following key operations:
 * - Checks if catalog exists
 * - Retrieves videos from associated channels and playlists
 * - Caches video data in Firestore
 * - Filters videos by publication time (day, week, month)
 * - Manages cache invalidation and update intervals
 *
 * @throws Will return error messages if catalog is empty or doesn't exist
 *
 * @beta
 */
export async function getVideosByCatalogId(catalogId: string) {
  let videoList: VideoMetadata[] = [];
  let totalVideos: number = 0;

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
  const channelListData = userSnapData?.channels;

  const playlistData = userSnapData?.playlists;

  if (!channelListData?.length && !playlistData?.length) {
    return "Catalog is empty. Channel or playlist is yet to be added!";
  }

  // Get last updated, check if time has been 6 hours or not, if so make call to YouTube API, if not fetch from firestore
  const currentTime = Date.now();
  const deltaTime = FOUR_HOURS;

  const lastUpdated = catalogSnapData.data.updatedAt.toDate();
  const lastUpdatedTime = new Date(lastUpdated).getTime();

  let recentUpdate = new Date(currentTime);
  let pageviews = 0;

  if (currentTime - lastUpdatedTime > deltaTime) {
    pageviews = await getPageviewByCatalogId(catalogId);

    // TODO: Parallelize the requests made
    if (channelListData?.length) {
      for (const channel of channelListData) {
        const data = await getChannelVideos(channel);
        videoList = [...videoList, ...data];
      }
    }

    if (playlistData?.length) {
      for (const playlist of playlistData) {
        const data = await getPlaylistVideos(playlist);
        videoList = [...videoList, ...data];
      }
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
      } else {
        videoFilterData.month.push(video);
        continue;
      }
    }

    const catalogVideos = {
      data: {
        videos: videoFilterData,
        updatedAt: recentUpdate,
        totalVideos: videoList.length,
      },
      pageviews: pageviews,
    };

    await setDoc(catalogRef, catalogVideos, { merge: true });

    revalidatePath(`/c/${catalogId}`);
    console.log(`Cached invalidated /c/${catalogId}`);
  } else {
    videoFilterData = catalogSnapData.data.videos;
    totalVideos = catalogSnapData.data.totalVideos;
    recentUpdate = lastUpdated;
    console.log(
      `Returning cached data, next update on ${new Date(
        lastUpdatedTime + FOUR_HOURS
      )}`
    );
  }

  return {
    title: catalogSnapData.title,
    description: catalogSnapData.description,
    videos: videoFilterData,
    nextUpdate: new Date(recentUpdate.getTime() + FOUR_HOURS).toUTCString(),
    pageviews: catalogSnapData.pageviews ?? 0,
    totalVideos: totalVideos,
  };
}

export async function updateCatalogVideos(catalogId: string) {
  const data = await getVideosByCatalogId(catalogId);
  return data;
}

/**
 * Retrieves detailed information for a specific catalog by its ID.
 *
 * @param catalogId - The unique identifier of the catalog to retrieve
 * @param userId - The ID of the user who owns the catalog
 * @returns An object containing catalog metadata including title, description, channels, and playlists
 *
 * @remarks
 * This function fetches catalog details from two Firestore collections:
 * 1. User-specific catalog document in the user's subcollection
 * 2. Global catalog document in the catalogs collection
 *
 * @throws {Error} Logs any errors encountered during Firestore document retrieval
 */
export async function getCatalogById(catalogId: string, userId: string) {
  // Get channel list
  const userRef = doc(db, COLLECTION.users, userId);

  let catalogResponseData: CatalogByIdResponse = {
    title: "",
    description: "",
    channelList: [],
    playlist: [],
  };

  try {
    const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

    const userCatalogData = await getDoc(userCatalogRef);
    const channelListData: CatalogChannel[] = userCatalogData.data()?.channels;
    const playlistData: CatalogPlaylist[] = userCatalogData.data()?.playlists;

    // Get title and description

    const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
    const catalogSnap = await getDoc(catalogRef);
    const catalogData = catalogSnap.data();

    catalogResponseData = {
      title: catalogData?.title,
      description: catalogData?.description,
      channelList: channelListData,
      playlist: playlistData,
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
  unstable_noStore();
  let catalogListData: ValidMetadata[] = [];
  const catalogsCollectionRef = collection(db, COLLECTION.catalogs);

  // Filter the catalog, where totalVideos is greater than 0 and pageviews are sorted 'desc'
  const validCatalogQuery = query(
    catalogsCollectionRef,
    where("data.totalVideos", ">", 0),
    orderBy("pageviews", "desc"),
    limit(50)
  );

  const catalogsDoc = await getDocs(validCatalogQuery);
  const catalogIds = catalogsDoc.docs.map((catalog) => catalog.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    catalogIds.map(async (catalogId) => {
      const catalogData = await getCatalogMetadata(catalogId);
      if (catalogData) {
        const metaData: ValidMetadata = {
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          description: catalogData?.description,
          id: catalogId,
          updatedAt: catalogData?.data.updatedAt.toDate(),
          pageviews: catalogData.pageviews ?? 0,
          totalVideos: catalogData?.data?.totalVideos,
        };

        catalogListData.push(metaData);
      }
    })
  );

  return catalogListData;
}

/**
 * Removes specified channels from a user's catalog.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param channels - An array of channels to replace the existing channel list
 * @returns A promise that resolves when the catalog is updated
 */
export async function deleteChannel(
  userId: string,
  catalogId: string,
  channels: any[]
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  await updateDoc(userCatalogRef, {
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
    });

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

type CatalogMeta = {
  title: string;
  description: string;
};

/**
 * This function creates a catalog for a user
 * @param userId
 */
export async function createCatalog(userId: string, catalogMeta: CatalogMeta) {
  const userRef = doc(db, COLLECTION.users, userId);
  const nanoidToken = createNanoidToken(6);
  const catalogRef = doc(db, COLLECTION.catalogs, nanoidToken);

  // Add a doc to user -> catalog collection
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, nanoidToken);

  // Create catalog sub-collection
  await setDoc(userCatalogRef, {
    channels: [],
    playlists: [],
    updatedAt: new Date(),
  });

  // Add a doc to catalog collection
  await setDoc(catalogRef, {
    data: {
      updatedAt: new Date(0),
    },
    videoRef: userCatalogRef,
    title: catalogMeta.title,
    description: catalogMeta.description,
  });

  return nanoidToken;
}

/**
 * Retrieves the next scheduled update time for a specific catalog.
 *
 * @param catalogId - The unique identifier of the catalog
 * @returns The timestamp of the catalog's last update
 */
export async function getNextUpdate(catalogId: string) {
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const catalogSnap = await getDoc(catalogRef);
  const catalogData = catalogSnap.data();

  return catalogData?.data.updatedAt.toDate();
}

/**
 * Updates the playlists for a specific user catalog by fetching additional channel information.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param playlists - An array of playlist items to be added to the catalog
 * @returns A promise that resolves when the catalog is updated with new playlist information
 *
 * @remarks
 * This function performs the following steps:
 * 1. Fetches channel details for each playlist's channel
 * 2. Enriches playlist items with channel metadata
 * 3. Updates the catalog document in Firestore with the new playlist information
 *
 * @throws {Error} If there are issues fetching channel information or updating Firestore
 */
export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: PlaylistItem[]
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  const playlistList = [];

  for (let i = 0; i < playlists.length; i++) {
    const { channelId } = playlists[i];
    const response = await fetch(YOUTUBE_CHANNELS_INFORMATION([channelId]));
    const result = await response.json();

    const channelInfo = result?.items[0];

    const playlistItem = {
      id: playlists[i].id,
      title: playlists[i].title,
      description: playlists[i].description,
      publishedAt: playlists[i].publishedAt,
      channelId: playlists[i].channelId,
      channelHandle: channelInfo.snippet.customUrl,
      channelTitle: channelInfo.snippet.title,
      channelDescription: channelInfo.snippet.description,
      channelLogo: channelInfo.snippet.thumbnails.medium.url,
    };

    playlistList.push(playlistItem);
  }

  await updateDoc(userCatalogRef, {
    playlists: arrayUnion(...playlistList),
    updatedAt: new Date(),
  });
}

/**
 * Removes specified playlists from a user's catalog.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param playlists - The updated list of playlists after deletion
 * @returns A promise that resolves when the catalog is updated
 *
 * @remarks
 * This function updates the playlists array in a user's catalog document and sets the update timestamp.
 */
export async function deletePlaylist(
  userId: string,
  catalogId: string,
  playlists: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  await updateDoc(userCatalogRef, {
    playlists: playlists,
    updatedAt: new Date(),
  });
}
