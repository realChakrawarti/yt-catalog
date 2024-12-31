import { getTimeDifference } from "~/utils/client-helper";
import { db } from "~/utils/db";

const inter = Inter({ subsets: ["latin"] });

import { YouTubeEmbed } from "@next/third-parties/google";
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
import { VideoData, YouTubeCardProps } from "~/types-schema/types";

interface WatchLaterProps extends Pick<YouTubeCardProps, "addWatchLater"> {
  videoData: VideoData;
}

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
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold leading-tight text-sm line-clamp-2 pr-6">
          <abbr className="no-underline cursor-pointer" title={title}>
            {title}
          </abbr>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <a
            className="hover:underline text-nowrap"
            href={`https://youtube.com/channel/${channelId}`}
            target="_blank"
          >
            {channelTitle}
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

const YoutubePlayer = (props: Pick<YouTubeCardProps, "videoId" | "title">) => {
  const { videoId, title } = props;

  return (
    <YouTubeEmbed
      params="rel=0&playsinline=1&cc_load_policy=0"
      videoid={videoId}
      playlabel={title}
      js-api
    />
  );
};

function RemoveVideo({
  removeVideo,
  videoId,
}: Pick<YouTubeCardProps, "removeVideo" | "videoId">) {
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

function CopyLink({ videoId }: Pick<YouTubeCardProps, "videoId">) {
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
  const existingVideos = useLiveQuery(() => db["watch-later"].toArray()) ?? [];

  async function addToWatchLater() {
    function checkIfExists(existingVideos: VideoData[], videoId: string) {
      for (let i = 0; i < existingVideos?.length; i++) {
        console.log(existingVideos[i].videoId, videoId);
        if (existingVideos[i].videoId === videoId) {
          return true;
        }
      }
      return false;
    }

    if (checkIfExists(existingVideos, videoData.videoId)) {
      toast({ title: "Video already added." });
    } else {
      await db["watch-later"].add(videoData);
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
}: Pick<YouTubeCardProps, "removeWatchLater" | "videoId">) {
  async function removeFromWatchLater(videoId: string) {
    await db["watch-later"].delete(videoId);
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
  YoutubePlayer,
};
