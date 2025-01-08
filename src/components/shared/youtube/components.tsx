import { useLiveQuery } from "dexie-react-hooks";
import Linkify from "linkify-react";
import { Clock8 } from "lucide-react";
import { Inter } from "next/font/google";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/avatar";
import { Button } from "~/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { DeleteIcon, InfoIcon, LinkIcon } from "~/components/shared/icons";
import { toast } from "~/hooks/use-toast";
import { VideoData, YouTubeCardOptions } from "~/types-schema/types";
import { getTimeDifference } from "~/utils/client-helper";
import { indexedDB } from "~/utils/dexie";

interface WatchLaterProps extends Pick<YouTubeCardOptions, "addWatchLater"> {
  videoData: VideoData;
}

const inter = Inter({ subsets: ["latin"] });

function ChannelMeta({
  channelLogo,
  channelTitle,
  channelId,
  title,
  publishedAt,
  hideAvatar,
}: Omit<VideoData, "videoId" | "description"> & { hideAvatar: boolean }) {
  const [_, timeElapsed] = getTimeDifference(publishedAt, true, false);
  return (
    <div className="flex gap-3">
      {channelLogo && !hideAvatar ? (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={channelLogo} alt={channelTitle} />
          <AvatarFallback>{channelTitle}</AvatarFallback>
        </Avatar>
      ) : null}
      <div
        className={`flex-1 space-y-1 ${
          hideAvatar ? "max-w-[100%]" : "max-w-[calc(100%-32px)]"
        }`}
      >
        <h3 className="font-semibold leading-tight text-sm line-clamp-2 pr-6 text-wrap">
          <abbr className="no-underline cursor-pointer" title={title}>
            {title}
          </abbr>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <a
            className="hover:underline text-nowrap overflow-hidden"
            href={`https://youtube.com/channel/${channelId}`}
            target="_blank"
          >
            <abbr className="no-underline cursor-pointer" title={channelTitle}>
              {channelTitle}
            </abbr>
          </a>
          <b>•</b>
          <span className="text-nowrap">{timeElapsed}</span>
        </div>
      </div>
    </div>
  );
}

function DescriptionSheet({
  title,
  description,
}: Pick<VideoData, "title" | "description">) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 h-8 w-8 bg-black/50 hover:bg-black/70"
        >
          <InfoIcon className="h-4 w-4 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full md:max-w-[450px]">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Linkify
            className={`text-xs whitespace-pre-wrap ${inter.className}`}
            as="pre"
            options={{
              target: "_blank",
              className:
                "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
            }}
          >
            {description}
          </Linkify>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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

function CopyLink({ videoId }: Pick<VideoData, "videoId">) {
  function copyLink(id: string) {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${id}`);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    });
  }
  return (
    <Button
      variant="ghost"
      className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
      onClick={() => copyLink(videoId)}
    >
      <LinkIcon className="h-4 w-4 mr-2" />
      Copy link
    </Button>
  );
}

function WatchLater({ addWatchLater, videoData }: WatchLaterProps) {
  const existingVideos =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  async function addToWatchLater() {
    function checkIfExists(existingVideos: VideoData[], videoId: string) {
      for (let i = 0; i < existingVideos?.length; i++) {
        if (existingVideos[i].videoId === videoId) {
          return true;
        }
      }
      return false;
    }

    if (checkIfExists(existingVideos, videoData.videoId)) {
      toast({ title: "Video already added." });
    } else {
      await indexedDB["watch-later"].add(videoData);
      toast({ title: `"${videoData.title}" added to watch later.` });
    }
  }

  if (addWatchLater) {
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={addToWatchLater}
      >
        <Clock8 className="h-4 w-4 mr-2" />
        Add to watch later
      </Button>
    );
  }
  return null;
}

function RemoveWatchLater({
  removeWatchLater,
  videoId,
}: Pick<YouTubeCardOptions, "removeWatchLater"> & Pick<VideoData, "videoId">) {
  async function removeFromWatchLater(videoId: string) {
    await indexedDB["watch-later"].delete(videoId);
    toast({ title: "Video has been removed from watch later." });
  }

  if (removeWatchLater) {
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={() => removeFromWatchLater(videoId)}
      >
        <DeleteIcon className="h-4 w-4 mr-2" />
        Remove from watch later
      </Button>
    );
  }

  return null;
}

export {
  ChannelMeta,
  CopyLink,
  DescriptionSheet,
  RemoveVideo,
  RemoveWatchLater,
  WatchLater,
};
