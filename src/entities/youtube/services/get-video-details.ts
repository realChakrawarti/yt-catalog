import { YOUTUBE_VIDEO_DATA } from "~/utils/server-helper";

// TODO: Parse only the data required and sent it down
export async function getVideoDetails(videoIdParam: string) {
  const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
  const result = await response.json();

  const videoData = result.items[0].snippet;

  const data = {
    title: videoData.title,
    description: videoData.description,
    channelTitle: videoData.channelTitle,
    channelId: videoData.channelId,
    thumbnail: videoData.thumbnails.medium.url,
    publishedAt: videoData.publishedAt,
  };
  return data;
}
