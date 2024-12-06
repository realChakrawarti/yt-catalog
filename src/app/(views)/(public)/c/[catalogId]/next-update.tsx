"use client";
import { Clock, RotateCw, X } from "~/components/custom/icons";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";

import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { Skeleton } from "~/components/shadcn/skeleton";
import { getTimeDifference } from "~/utils/client-helper";
import fetchApi from "~/utils/fetch";

function ShowBanner({ showBanner, setShowBanner }: any) {
  const [bodyElement, setBodyElement] = useState<
    Element | DocumentFragment | null
  >(null);

  useEffect(() => {
    if (typeof document !== undefined) {
      setBodyElement(document.body);
    }
  }, []);

  if (!showBanner || !bodyElement) return null;

  return createPortal(
    <div className="absolute inset-0 top-2 z-50 max-h-[75px]">
      <div className="bg-primary px-3 py-2 flex items-center justify-between rounded-lg">
        <div className="flex items-center space-x-2 text-white justify-between">
          <span>A new version of catalog is available.</span>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent text-white"
            onClick={() => window?.location?.reload()}
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Reload</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent text-white"
            onClick={() => setShowBanner(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>,
    bodyElement
  );
}

export default function NextUpdate({ catalogId }: any) {
  const [time, setTime] = useState<string>("");
  const [showBanner, setShowBanner] = useState(false);

  const {
    data: nextUpdate,
    error,
    isLoading,
  } = useSWR(
    catalogId ? `/catalogs/${catalogId}/next-update` : null,
    (url) => fetchApi<string>(url),
    {
      refreshInterval: 5 * 60_000,
    }
  );

  useEffect(() => {
    const updateTime = () => {
      let timeoutId = null;
      const [when, _] = getTimeDifference(nextUpdate?.data as string);
      if ((when as number) < 0) {
        timeoutId = setTimeout(() => {
          setShowBanner(true);
        }, 30_000);
      }

      return timeoutId;
    };

    let clearTimeoutId = null;
    if (nextUpdate?.data) {
      clearTimeoutId = updateTime();
    }

    return () => {
      clearTimeoutId && clearTimeout(clearTimeoutId);
    };
  }, [nextUpdate?.data]);

  const [when, timeDiff] = getTimeDifference(nextUpdate?.data as string);
  const showTimeUpdate = () => {
    if (error) {
      return "Please reload the page.";
    }

    if ((when as number) < 0) {
      return "Updating the catalog...";
    } else {
      return timeDiff;
    }
  };
  return (
    <>
      <ShowBanner showBanner={showBanner} setShowBanner={setShowBanner} />
      {isLoading ? (
        <Skeleton className="size-9" />
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Clock className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto text-sm p-2">
            <p>
              <b>Next update:</b> {showTimeUpdate()}
            </p>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
