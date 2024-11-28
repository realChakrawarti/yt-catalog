"use client";
import { Clock, RotateCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import { getTimeDifference } from "~/utils/client-helper";

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
          <span>A new version of catalog is available</span>
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

export default function NextUpdate({ dateTime }: any) {
  const [time, setTime] = useState<string>("");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const [when, timeDiff] = getTimeDifference(dateTime);
    if ((when as number) < 0) {
      setTime("Updating the catalog...");
      setTimeout(() => {
        setShowBanner(true);
      }, 7000);
    } else {
      setTime(timeDiff as string);
    }
  }, [dateTime]);

  return (
    <>
      <ShowBanner showBanner={showBanner} setShowBanner={setShowBanner} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Clock className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto text-sm p-2">
          <p>
            <b>Next update:</b> {time}
          </p>
        </PopoverContent>
      </Popover>
    </>
  );
}
