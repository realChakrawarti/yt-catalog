import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

import { FOUR_HOURS, ONE_DAY, ONE_MONTH, ONE_WEEK } from "~/utils/constant";
import { db } from "~/utils/firebase";
import {
  COLLECTION,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
} from "~/utils/server-helper";

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
export async function getVideosByCatalog(catalogId: string) {
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

async function getPageviewByCatalogId(catalogId: string): Promise<number> {
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
