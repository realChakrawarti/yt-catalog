"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useEffect, useRef } from "react";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History, VideoData } from "~/shared/types-schema/types";

const IframeParams = "rel=0&playsinline=1&origin=https://ytcatalog.707x.in";

export default function YoutubePlayer(
  props: VideoData & { enableJsApi: boolean }
) {
  const { enableJsApi, ...video } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackingRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const firstLoad = useRef<boolean>(false);
  const isPlaying = useRef<boolean>(false);

  function percentCompleted(node: YT.Player) {
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

      await indexedDB["history"].put(percentCompleted(playerRef.current));
    }, 2_000);
  };

  const stopTracking = () => {
    isPlaying.current = false;

    if (trackingRef.current) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
    }
  };

  function getActivePlayers() {
    return document.querySelectorAll("iframe");
  }

  async function _onStateChange(event: YT.OnStateChangeEvent) {
    const { target, data: playingState } = event;
    const playerState = window.YT.PlayerState;

    const allPlayers = getActivePlayers();

    const filterPlayers = Array.from(allPlayers).filter(
      (item) => item != target.getIframe()
    );

    switch (playingState) {
      case playerState.CUED:
        stopTracking();
        firstLoad.current = false;
        break;
      case playerState.PAUSED:
        stopTracking();
        break;
      case playerState.ENDED:
        stopTracking();
        break;

      case playerState.PLAYING:
        // Stop other players
        filterPlayers.forEach((item) => {
          playerControl(item, "stopVideo");
        });

        if (!firstLoad.current && !isPlaying.current) {
          const playedVideo = await indexedDB["history"].get(video.videoId);
          if (playedVideo) {
            target.seekTo(playedVideo.duration, true);
            isPlaying.current = true;
          }
        }
        isPlaying.current = true;
        startTracking();
        break;
    }
  }

  async function playerControl(
    iframe: HTMLIFrameElement,
    action: "playVideo" | "stopVideo" | "pauseVideo" | "destroy"
  ) {
    const payload = JSON.stringify({
      args: [],
      event: "command",
      func: action,
    });

    iframe.contentWindow?.postMessage(payload, "*");
  }

  // first load
  async function loadIFrameElement() {
    if (!enableJsApi) {
      return;
    }

    playerRef.current = await (
      containerRef.current?.querySelector("lite-youtube") as any
    )?.getYTPlayer();

    const playing = await indexedDB["history"].get(video.videoId);

    firstLoad.current = true;

    if (playing?.videoId === video.videoId) {
      // Set up player event listeners
      playerRef.current?.seekTo(playing.duration, true);
    }
    playerRef.current?.addEventListener("onStateChange", _onStateChange);
  }

  useEffect(() => {
    return () => {
      stopTracking();
      playerRef.current?.removeEventListener("onStateChange", _onStateChange);
    };
  }, []);

  return (
    <div ref={containerRef} onMouseDown={loadIFrameElement}>
      <YouTubeEmbed
        params={enableJsApi ? IframeParams + "&enablejsapi=1" : IframeParams}
        videoid={video.videoId}
        playlabel={video.title}
        js-api={enableJsApi}
      />
    </div>
  );
}
