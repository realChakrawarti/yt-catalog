"use client";

import { useReadLocalStorage } from "usehooks-ts";

import GridContainer from "~/components/custom/grid-container";
import YouTubeCard from "~/components/custom/youtube-card";

export default function WatchLaterPage() {
  const watchLater = useReadLocalStorage<any[]>("watch-later") ?? [];

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">Watch later</h1>
      <div className="w-full pt-7">
        <GridContainer>
          {watchLater.length ? (
            watchLater.map((item) => (
              <YouTubeCard
                hideAvatar
                removeWatchLater
                key={item.videoId}
                {...item}
              />
            ))
          ) : (
            <div>No videos found.</div>
          )}
        </GridContainer>
      </div>
    </div>
  );
}
