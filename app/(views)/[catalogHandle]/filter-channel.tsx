"use client";

import { Tag, TagGroup } from "@/app/components/TagGroup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Selection } from "react-aria-components";

export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: any;
}) {
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedKey, setSelectedKey] = useState<Selection>(new Set([]));

  const handleSelectionChange = (key: Selection) => {
    const params = new URLSearchParams(searchParams);

    if (!key) {
      setSelectedKey(key);
      return;
    }

    setSelectedKey(key);
    const selectedKeyStringify = Array.from(key)[0].toString() || "";

    if (selectedKeyStringify) {
      params.set("channelId", selectedKeyStringify);
    } else {
      params.delete("channelId");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleOnClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("channelId");

    replace(`${pathname}?${params.toString()}`);

    setSelectedKey(new Set([]));
  };

  return (
    <div>
      <TagGroup
        label="Filter Channel"
        selectionMode="single"
        selectedKeys={selectedKey}
        selectionBehavior="replace"
        onSelectionChange={handleSelectionChange}
      >
        {activeChannels.map((channel: any) => {
          return (
            <Tag id={channel.id} key={channel.id}>
              {channel.title}
            </Tag>
          );
        })}
      </TagGroup>
      <button onClick={handleOnClear}>Clear all</button>
    </div>
  );
}
