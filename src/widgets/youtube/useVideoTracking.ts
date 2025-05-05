import { useRef } from "react";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History, VideoData } from "~/shared/types-schema/types";

interface UseVideoTrackingProps {
  playerRef: React.MutableRefObject<YT.Player | null>;
  video: VideoData;
}

export function useVideoTracking({ video, playerRef }: UseVideoTrackingProps) {
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const isPlaying = useRef<boolean>(false);

  function getPercentCompleted(node: YT.Player) {
    const duration = node.getDuration() || 0;
    const currentTime = node.getCurrentTime() || 0;
    const percentCompleted = parseInt(
      ((currentTime / duration) * 100).toFixed(0)
    );

    const payload: History = {
      completed: percentCompleted,
      duration: currentTime,
      updatedAt: Date.now(),
      ...video,
    };

    return payload;
  }

  const startTracking = () => {
    if (trackingRef.current) return;

    trackingRef.current = setInterval(async () => {
      if (!playerRef.current) return;

      await indexedDB["history"].put(getPercentCompleted(playerRef.current));
    }, 2_000);
  };

  const stopTracking = () => {
    isPlaying.current = false;

    if (trackingRef.current) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
    }
  };

  return { isPlaying, startTracking, stopTracking };
}
