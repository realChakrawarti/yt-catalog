"use client";

import { useEffect, useState } from "react";

import GridContainer from "~/components/shared/grid-container";
import YouTubeCard from "~/components/shared/youtube/card";
import type { History } from "~/types-schema/types";
import { indexedDB } from "~/utils/dexie";
export default function HistoryPage() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const getWatchHistory = async () => {
      const indexedHistory = (await indexedDB["history"].toArray()) ?? [];
      setHistory(indexedHistory);
    };

    getWatchHistory();
  }, []);

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">History</h1>
      <div className="w-full pt-7">
        <GridContainer>
          {history.length ? (
            history.map((item) => (
              // TODO: Track video progression
              <YouTubeCard key={item.videoId} options={{}} video={item} />
            ))
          ) : (
            <div>No videos found.</div>
          )}
        </GridContainer>
      </div>
    </div>
  );
}
