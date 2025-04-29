"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Check } from "lucide-react";

import { indexedDB } from "~/shared/lib/api/dexie";

import OverlayTip from "../overlay-tip";

export function WatchedStatus({ videoId }: { videoId: string }) {
  const videoProgress = useLiveQuery(() => indexedDB["history"].get(videoId));

  if (videoProgress && videoProgress.completed > 90) {
    return (
      <div className="absolute bottom-1 left-0 group/status cursor-default">
        <OverlayTip
          className="p-[5px] flex gap-1 place-items-center rounded-r-md"
          id="status"
          aria-label="Show video completion status"
        >
          <div className="hidden group-hover/status:block text-xs">
            Completed
          </div>
          <Check className="size-4 flex-grow" />
        </OverlayTip>
      </div>
    );
  }

  return null;
}
