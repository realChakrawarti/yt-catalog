/* eslint-disable @next/next/no-img-element */
import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { DeleteIcon, ThreeDotIcon } from "~/components/shared/icons";
import { ChannelMeta } from "~/components/shared/youtube/components";
import { VideoData, YouTubeCardOptions } from "~/types-schema/types";

function RemoveVideo({
  removeVideo,
  videoId,
}: Pick<VideoData, "videoId"> & Pick<YouTubeCardOptions, "removeVideo">) {
  if (typeof removeVideo === "function")
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={() => removeVideo(videoId)}
      >
        <DeleteIcon className="h-4 w-4 mr-2" />
        Remove video
      </Button>
    );
  return null;
}

export default function VideoCard({ video, removeVideo }: any) {
  const { videoId, title, thumbnail } = video;

  return (
    <div className="flex flex-col gap-3">
      <div key={videoId} className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video overflow-hidden">
          <img src={thumbnail} alt={title} />
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
            <RemoveVideo videoId={video.videoId} removeVideo={removeVideo} />
          </PopoverContent>
        </Popover>
        <div className="p-3">
          <ChannelMeta hideAvatar {...video} />
        </div>
      </div>
    </div>
  );
}
