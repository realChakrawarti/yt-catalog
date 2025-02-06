import { YOUTUBE_VIDEO_DATA } from "~/utils/server-helper";

// TODO: Parse only the data required and sent it down
export async function getVideoDetails(videoIdParam: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
  const result = await response.json();

  const videoData = result.items[0].snippet;

  const data = {
    channelId: videoData.channelId,
    channelTitle: videoData.channelTitle,
    description: videoData.description,
    publishedAt: videoData.publishedAt,
    thumbnail: videoData.thumbnails.medium.url,
    title: videoData.title,
  };
  return data;
}
