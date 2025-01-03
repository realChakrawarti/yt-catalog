"use client";

import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { VideoData, YouTubeCardOptions } from "~/types-schema/types";

import { ThreeDotIcon } from "../icons";
import {
  CopyLink,
  RemoveVideo,
  RemoveWatchLater,
  WatchLater,
} from "./components";

export default function ShowCardOption({
  addWatchLater,
  removeWatchLater,
  removeVideo,
  video,
}: Pick<
  YouTubeCardOptions,
  "addWatchLater" | "removeWatchLater" | "removeVideo"
> & { video: VideoData }) {
  return (
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
        <RemoveVideo videoId={video.videoId} removeVideo={removeVideo} />
        <CopyLink videoId={video.videoId} />
        <WatchLater addWatchLater={addWatchLater} videoData={video} />
        <RemoveWatchLater
          videoId={video.videoId}
          removeWatchLater={removeWatchLater}
        />
      </PopoverContent>
    </Popover>
  );
}