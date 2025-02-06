import { customAlphabet } from "nanoid";
import { cookies } from "next/headers";

export const YOUTUBE_CHANNEL_PLAYLIST_VIDEOS = (
  playlistId: string,
  limit: number
) =>
  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistId}&maxResults=${limit}&key=${process.env.YOUTUBE_API_KEY}`;

export const YOUTUBE_CHANNELS_INFORMATION = (
  channelIds: string[],
  limit: number = 25
) => {
  const ids = channelIds.join(",");
  return `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,contentDetails,id,snippet,topicDetails&maxResults=${limit}&id=${ids}&key=${process.env.YOUTUBE_API_KEY}`;
};

export const YOUTUBE_VIDEO_DATA = (videoId: string) =>
  `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;

export const YOUTUBE_CHANNEL_PLAYLISTS = (
  channelId: string,
  nextPageToken?: string,
  limit: number = 50
) => {
  if (nextPageToken) {
    return `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=${limit}&pageToken=${nextPageToken}&key=${process.env.YOUTUBE_API_KEY}`;
  }
  return `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=${limit}&key=${process.env.YOUTUBE_API_KEY}`;
};
const tokenCharacters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generates a unique token using a custom nanoid alphabet.
 *
 * @param length - The desired length of the generated token
 * @returns A unique random string token of specified length
 */
export function createNanoidToken(length: number): string {
  const nanoid = customAlphabet(tokenCharacters, length);
  return nanoid();
}

export function getUserIdCookie(): string {
  const cookieStore = cookies();
  const userIdToken = cookieStore.get("userId")?.value || "";

  return userIdToken;
}

export const COLLECTION = {
  archives: "archives",
  catalogs: "catalogs",
  users: "users",
} as const;
