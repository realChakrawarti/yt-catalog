import { z } from "zod";

import { TitleDescriptionSchema } from "./schemas";

type VideoData = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  channelId: string;
  channelLogo: string;
  description: string;
};

export interface YouTubeCardProps extends VideoData {
  removeVideo: (_videoId: string) => void;
  hideAvatar: boolean;
  addWatchLater: boolean;
  removeWatchLater: boolean;
}

type FavoriteData = {
  id: string;
  title: string;
  description: string;
};

export type { FavoriteData, VideoData };
export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;
