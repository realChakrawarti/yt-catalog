import { cookies } from "next/headers";

import { customAlphabet } from "nanoid";

export const YOUTUBE_CHANNEL_PLAYLIST_VIDEOS = (
  playlistId: string,
  limit: number
) =>
  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${limit}&key=${process.env.YOUTUBE_API_KEY}`;

export const YOUTUBE_CHANNELS_INFORMATION = (
  channelIds: string[],
  limit: number = 25
) => {
  const ids = channelIds.join(",");
  return `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,contentDetails,id,snippet,topicDetails&maxResults=${limit}&id=${ids}&key=${process.env.YOUTUBE_API_KEY}`;
};

export const YOUTUBE_VIDEO_DATA = (videoId: string) => `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`

const tokenCharacters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function createNanoidToken(): string {
  const nanoid = customAlphabet(tokenCharacters, 6);
  return nanoid();
}

export function getUserIdCookie(): string {
  const cookieStore = cookies();
  const userIdToken = cookieStore.get("userId")?.value || "";

  return userIdToken;
}

export const COLLECTION = {
  users: "users",
  catalogs: "catalogs",
} as const;
