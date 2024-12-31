"use client";

import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { ThreeDotIcon } from "~/components/shared/icons";
import { YouTubeCardProps } from "~/types-schema/types";

import {
  ChannelMeta,
  CopyLink,
  DescriptionSheet,
  RemoveVideo,
  RemoveWatchLater,
  WatchLater,
  YoutubePlayer,
} from "./components";

export default function YouTubeCard(props: YouTubeCardProps) {
  const {
    videoId,
    title,
    channelTitle,
    publishedAt,
    channelId,
    channelLogo,
    description,
    removeVideo,
    hideAvatar = false,
    addWatchLater = false,
    removeWatchLater = false,
  } = props;

  const videoData = {
    videoId,
    title,
    channelTitle,
    publishedAt,
    channelId,
    channelLogo,
    description,
  };

  return (
    <div className="flex flex-col gap-3">
      <div key={videoId} className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video overflow-hidden">
          <YoutubePlayer videoId={videoId} title={title} />
          <DescriptionSheet title={title} description={description} />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-0 h-6 w-6"
              >
                <ThreeDotIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="w-[200px] border-none rounded-lg p-1"
          >
            <RemoveVideo videoId={videoId} removeVideo={removeVideo} />
            <CopyLink videoId={videoId} />
            <WatchLater addWatchLater={addWatchLater} videoData={videoData} />
            <RemoveWatchLater
              videoId={videoId}
              removeWatchLater={removeWatchLater}
            />
          </PopoverContent>
        </Popover>
        <div className="p-3">
          <ChannelMeta hideAvatar={hideAvatar} {...videoData} />
        </div>
      </div>
    </div>
  );
}
