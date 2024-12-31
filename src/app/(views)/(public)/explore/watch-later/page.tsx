"use client";

import { useLiveQuery } from "dexie-react-hooks";

import GridContainer from "~/components/shared/grid-container";
import YouTubeCard from "~/components/shared/youtube/card";
import { db } from "~/utils/db";

export default function WatchLaterPage() {
  const watchLater = useLiveQuery<any[]>(() => db["watch-later"].toArray()) ?? [];

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
