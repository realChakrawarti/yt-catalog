"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import Linkify from "linkify-react";
import { Clock8 } from "lucide-react";
import { Inter } from "next/font/google";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

import {
  DeleteIcon,
  InfoIcon,
  LinkIcon,
  ThreeDotIcon,
} from "~/components/custom/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/avatar";
import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { toast } from "~/hooks/use-toast";
import { getTimeDifference } from "~/utils/client-helper";

const inter = Inter({ subsets: ["latin"] });

type VideoData = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  channelId: string;
  channelLogo: string;
  description: string;
};

interface YouTubeCardProps extends VideoData {
  removeVideo: (videoId: string) => void;
  hideAvatar: boolean;
  addWatchLater: boolean;
  removeWatchLater: boolean;
}

interface WatchLaterProps extends Pick<YouTubeCardProps, "addWatchLater"> {
  videoData: VideoData;
}

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
  const [_, timeElapsed] = getTimeDifference(publishedAt, true, false);

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
        </div>
      </div>
    </div>
  );
}

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
  const [exisitingVideos, setWatchLater] = useLocalStorage<VideoData[]>(
    "watch-later",
    []
  );

  function addToWatchLater() {
    function checkIfExists(exisitingVideos: VideoData[], videoId: string) {
      for (let i = 0; i < exisitingVideos?.length; i++) {
        if (exisitingVideos[i].videoId === videoId) {
          return true;
        }
      }
      return false;
    }

    if (checkIfExists(exisitingVideos, videoData.videoId)) {
      toast({ title: "Video already added." });
    } else {
      setWatchLater([...exisitingVideos, videoData]);
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
  const exisitingVideos = useReadLocalStorage<VideoData[]>("watch-later") ?? [];
  const [_, setWatchLater] = useLocalStorage<VideoData[]>(
    "watch-later",
    exisitingVideos
  );

  function removeFromWatchLater(videoId: string) {
    const filteredVideos = exisitingVideos.filter(
      (item: VideoData) => item.videoId !== videoId
    );

    setWatchLater(filteredVideos);
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

const YoutubePlayer = (props: Pick<YouTubeCardProps, "videoId" | "title">) => {
  const { videoId, title } = props;

  return (
    <YouTubeEmbed
      params="rel=0&playsinline=1&cc_load_policy=0"
      videoid={videoId}
      playlabel={title}
    />
  );
};
