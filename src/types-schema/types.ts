import { z } from "zod";

import { TitleDescriptionSchema } from "./schemas";

/**
 * Represents the metadata for catalogs and archives.
 * @property totalVideos - The total number of videos in the collection
 * @property thumbnails - Array of thumbnail URLs for the videos
 * @property id - Unique identifier for the collection
 * @property title - Title of the collection
 * @property description - Description of the collection
 * @property updatedAt - Last update timestamp
 * @property pageviews - Number of page views
 */
export type ValidMetadata = {
  totalVideos: number;
  thumbnails: string[];
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  pageviews?: number;
};

type VideoData = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  channelId: string;
  channelLogo: string;
  description: string;
};

export type YouTubeCardOptions = {
  removeVideo: (_videoId: string) => void;
  hideAvatar: boolean;
  addWatchLater: boolean;
  removeWatchLater: boolean;
  enableJsApi: boolean;
};

export interface History extends VideoData {
  updatedAt: number;
  duration: number;
  completed: number;
}

export interface YouTubeCardProps {
  video: VideoData;
  options?: Partial<YouTubeCardOptions> | any;
}

type FavoriteData = {
  id: string;
  title: string;
  description: string;
};

export type { FavoriteData, VideoData };
export type TitleDescriptionType = z.infer<typeof TitleDescriptionSchema>;
