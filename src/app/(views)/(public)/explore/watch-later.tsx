"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import GridContainer from "~/components/custom/grid-container";
import YouTubeCard from "~/components/custom/youtube-card";

export default function WatchLater() {
  const [watchLater, setWatchLater] = useState<any[]>([]);

  useLayoutEffect(() => {
    const videos = JSON.parse(
      window?.localStorage?.getItem("watch-later") || "[]"
    );
    setWatchLater(videos);
  }, []);

  return (
    <GridContainer>
      {watchLater.map((item) => (
        <YouTubeCard hideAvatar removeWatchLater key={item.videoId} {...item} />
      ))}
    </GridContainer>
  );
}
// }
