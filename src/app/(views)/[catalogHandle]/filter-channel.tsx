"use client";

import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "~/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";

export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const [selectedKey, setSelectedKey] = useState<string>("");

  const handleSelectionChange = (key: string) => {
    if (!key) {
      setSelectedKey(key);
      return;
    }

    setSelectedKey(key);

    if (key) {
      params.set("channelId", key);
    } else {
      params.delete("channelId");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleOnClear = () => {
    params.delete("channelId");

    replace(`${pathname}?${params.toString()}`);

    setSelectedKey("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-9 px-4 lg:px-6">
          <Filter className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:inline">Filter Channel</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[280px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Filter Channels</SheetTitle>
          <SheetDescription>
            Select a channel to filter the content
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {selectedKey && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOnClear}
              className="w-full justify-start"
            >
              Clear filter
            </Button>
          )}
          <div className="flex flex-col space-y-2">
            {activeChannels.map((channel: any) => (
              <Button
                key={channel.id}
                variant={channel.id === selectedKey ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectionChange(channel.id)}
                className="justify-start"
              >
                {channel.title}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
