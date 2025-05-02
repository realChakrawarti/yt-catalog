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

    console.log("playerS", playingState);

    switch (playingState) {
      case playerState.CUED:
      case playerState.PAUSED:
      case playerState.ENDED:
        stopTracking();
        break;

      case playerState.PLAYING:
        filterPlayers.forEach((item) => playerControl(item, "stopVideo"));
        const playedVideo = await indexedDB["history"].get(video.videoId);
        if (playedVideo) {
          target.seekTo(playedVideo.duration, false);
          target.playVideo();
        }
        startTracking();
        break;
      case playerState.BUFFERING:
        await indexedDB["history"].put(percentCompleted(event.target));
        console.log("Seeking");
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

  async function loadIFrameElement() {
    // Check if something is already playing, if so pause it and play the loaded one
    // const allPlayers = getActivePlayers();

    // allPlayers?.forEach((node) => {
    //   playerControl(node, "pauseVideo");
    // });

    if (!enableJsApi) {
      return;
    }

    if (!playerRef.current) {
      playerRef.current = await (
        containerRef.current?.querySelector("lite-youtube") as any
      )?.getYTPlayer();

      // const playing = await indexedDB["history"].get(video.videoId);

      // if (playing?.videoId === video.videoId) {
      //   playerRef.current?.seekTo(playing.duration, true);
      // }

      // Set up player event listeners
      playerRef.current?.addEventListener("onStateChange", _onStateChange);
    }
  }

  useEffect(() => {
    return () => stopTracking();
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
