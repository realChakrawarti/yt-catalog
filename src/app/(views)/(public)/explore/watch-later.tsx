"use client";

import { useLiveQuery } from "dexie-react-hooks";

import GridContainer from "~/components/shared/grid-container";
import YouTubeCard from "~/components/shared/youtube/card";
import { db } from "~/utils/db";

export default function WatchLaterPage() {
  const watchLater =
    useLiveQuery<any[]>(() => db["watch-later"].toArray(), []) ?? [];

  return (
    <GridContainer>
      {watchLater.map((item) => (
        <YouTubeCard
          options={{ hideAvatar: true, removeWatchLater: true }}
          key={item.videoId}
          video={item}
        />
      ))}
    </GridContainer>
  );
}
