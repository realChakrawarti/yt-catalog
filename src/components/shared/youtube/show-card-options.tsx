"use client";

import { useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { VideoData, YouTubeCardOptions } from "~/types-schema/types";

import { ThreeDotIcon } from "../icons";
import { CopyLink, RemoveWatchLater, WatchLater } from "./components";

export default function ShowCardOption({
  addWatchLater,
  removeWatchLater,
  video,
}: Pick<YouTubeCardOptions, "addWatchLater" | "removeWatchLater"> & {
  video: VideoData;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        onClick={() => setIsOpen(false)}
        side="top"
        align="end"
        className="w-[200px] border-none rounded-lg p-1"
      >
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
