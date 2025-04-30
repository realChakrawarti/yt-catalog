"use client";

import { useLiveQuery } from "dexie-react-hooks";
import MobileFooter from "~/widgets/mobile-footer";
import { indexedDB } from "~/shared/lib/api/dexie";
import GridContainer from "~/widgets/grid-container";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default function WatchLater() {
  const watchLater =
    useLiveQuery<any[]>(() => indexedDB["watch-later"].toArray()) ?? [];

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">Watch later</h1>
      <div className="w-full pt-7">
        <GridContainer>
          {watchLater.length ? (
            watchLater.map((item) => (
              <YouTubeCard
                key={item.videoId}
                options={{
                  enableJsApi: true,
                  hideAvatar: true,
                  removeWatchLater: true,
                }}
                video={item}
              />
            ))
          ) : (
            <div>No videos found.</div>
          )}
        </GridContainer>
      </div>
      <MobileFooter />
    </div>
  );
}
