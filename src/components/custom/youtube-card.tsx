"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import Linkify from "linkify-react";
import { Info, LinkIcon, MoreVertical, DeleteIcon } from "~/components/custom/icons";
import { Inter } from "next/font/google";

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

const YoutubePlayer = (props: any) => {
  const { videoId, title } = props;

  return (
    <YouTubeEmbed
      params="rel=0&playsinline=1&cc_load_policy=0"
      videoid={videoId}
      playlabel={title}
    />
  );
};

const inter = Inter({ subsets: ["latin"] });

export default function YouTubeCard(props: any) {
  const {
    videoId,
    title,
    channelTitle,
    publishedAt,
    channelId,
    channelLogo,
    description,
    removeVideo,
  } = props;
  const [_, timeElapsed] = getTimeDifference(publishedAt, true);

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${id}`);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    });
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
                <Info className="h-4 w-4 text-white" />
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
        <div className="p-3 px-0 md:px-3">
          <div className="flex items-start gap-3">
            {channelLogo ? (
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={channelLogo} alt={channelTitle} />
                <AvatarFallback>{channelTitle}</AvatarFallback>
              </Avatar>
            ) : null}
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold leading-tight text-sm">{title}</h3>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 justify-self-end"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                className="w-[200px] border-none rounded-lg p-1"
              >
                {typeof removeVideo === "function" ? (
                  <Button
                    variant="ghost"
                    className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
                    onClick={() => removeVideo(videoId)}
                  >
                    <DeleteIcon className="h-4 w-4 mr-2" />
                    Remove video
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
                  onClick={() => copyLink(videoId)}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy link
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
