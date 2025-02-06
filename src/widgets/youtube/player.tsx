"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useEffect, useRef } from "react";

import type { History, VideoData } from "~/shared/types-schema/types";
import { indexedDB } from "~/utils/dexie";

const IframeParams = "rel=0&playsinline=1&origin=https://ytcatalog.707x.in";

export default function YoutubePlayer(
  props: VideoData & { enableJsApi: boolean }
) {
  const { enableJsApi, ...video } = props;
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackingRef = useRef<NodeJS.Timeout | null>(null);

  async function loadIFrameElement() {
    if (!enableJsApi) {
      return;
    }

    if (!playerRef.current) {
      playerRef.current = await (
        containerRef.current?.querySelector("lite-youtube") as any
      )?.getYTPlayer();

      const playing = await indexedDB["history"].get(video.videoId);

      if (playing?.videoId === video.videoId) {
        playerRef.current?.seekTo(playing.duration, true);
      }

      // Set up player event listeners
      playerRef.current?.addEventListener("onStateChange", (event) => {
        const playerState = window.YT.PlayerState;

        switch (event.data) {
          case playerState.PLAYING:
            startTracking();
            break;
          case playerState.PAUSED:
          case playerState.ENDED:
            stopTracking();
            break;
        }
      });
    }
  }

  const startTracking = () => {
    if (trackingRef.current) return;

    trackingRef.current = setInterval(async () => {
      if (!playerRef.current) return;

      const duration = playerRef.current.getDuration() || 0;
      const currentTime = playerRef.current.getCurrentTime() || 0;
      const percentCompleted = parseInt(
        ((currentTime / duration) * 100).toFixed(0)
      );

      const payload: History = {
        completed: percentCompleted,
        duration: currentTime,
        updatedAt: Date.now(),
        ...video,
      };

      await indexedDB["history"].put(payload);
    }, 3_000);
  };

  const stopTracking = () => {
    if (trackingRef.current) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return (
    <div ref={containerRef} onMouseDown={() => loadIFrameElement()}>
      <YouTubeEmbed
        params={enableJsApi ? IframeParams + "&enablejsapi=1" : IframeParams}
        videoid={video.videoId}
        playlabel={video.title}
        js-api={enableJsApi}
      />
    </div>
  );
}
