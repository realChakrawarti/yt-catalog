"use client";

/* eslint-disable @next/next/no-img-element */
import { Info, Link, Maximize2, MoreVertical, X } from "lucide-react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shadcn/avatar";
import { Button } from "~/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { getTimeDifference } from "~/utils/client-helper";

import { YoutubePlayer } from "./component";

export default function YouTubeCard(props: any) {
  const {
    videoId,
    title,
    channelTitle,
    publishedAt,
    channelId,
    channelLogo,
    description,
  } = props;
  const [_, timeElapsed] = getTimeDifference(publishedAt, true);
  const [openDescriptions, setOpenDescriptions] = useState<number[]>([]);

  const toggleDescription = (id: number) => {
    setOpenDescriptions((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        key={videoId}
        className="group relative overflow-hidden rounded-xl border bg-card transition-colors hover:bg-accent"
      >
        <div className="relative aspect-video overflow-hidden">
          <YoutubePlayer videoId={videoId} title={title} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 bg-black/50 hover:bg-black/70"
            onClick={() => toggleDescription(videoId)}
          >
            <Info className="h-4 w-4 text-white" />
          </Button>
          {openDescriptions.includes(videoId) && (
            <div className="absolute inset-0 bg-black/80 p-4 text-white overflow-y-auto transition-transform duration-300 ease-in-out translate-x-0">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-white/20"
                onClick={() => toggleDescription(videoId)}
              >
                <X className="h-4 w-4" />
              </Button>
              <h4 className="font-semibold mb-2">{title}</h4>
              <p className="text-sm">{description}</p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 hover:bg-white/20"
                    // onClick={() => setFullDescriptionId(videoId)}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <p>{description}</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={channelLogo} alt={channelTitle} />
              <AvatarFallback>{channelTitle}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold leading-tight">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <a
                  className="hover:underline"
                  href={`https://youtube.com/channel/${channelId}`}
                  target="_blank"
                >
                  {channelTitle}
                </a>
                <b>•</b>
                <span>{timeElapsed}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log("Copied")}>
                  <Link className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-full space-y-1">
        <YoutubePlayer videoId={videoId} title={title} />
        <div className="flex gap-2 items-start py-2">
          <img src={channelLogo} className="size-8" alt={channelTitle} />
          <span className="flex flex-col gap-1">
            <p className="text-sm md:text-base text-gray-50">{title}</p>
            <p className="text-xs md:text-sm text-gray-300 flex gap-2 items-center">
              <a
                className="hover:underline"
                href={`https://youtube.com/channel/${channelId}`}
                target="_blank"
              >
                {channelTitle}
              </a>
              <b>•</b>
              <span>{timeElapsed}</span>
            </p>
          </span>
        </div>
      </div> */}
    </div>
  );
}
