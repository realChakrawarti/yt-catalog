import { YOUTUBE_VIDEO_DATA } from "~/utils/server-helper";

export async function getVideoDetails(videoIdParam: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
  const data = await response.json();
  return data;
}
