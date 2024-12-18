"use client";

import { useReadLocalStorage } from "usehooks-ts";

import GridContainer from "~/components/custom/grid-container";
import YouTubeCard from "~/components/custom/youtube-card";

export default function WatchLaterPage() {
  const watchLater = useReadLocalStorage<any[]>("watch-later") ?? [];

  return (
    <GridContainer>
      {watchLater.map((item) => (
        <YouTubeCard hideAvatar removeWatchLater key={item.videoId} {...item} />
      ))}
    </GridContainer>
  );
}
