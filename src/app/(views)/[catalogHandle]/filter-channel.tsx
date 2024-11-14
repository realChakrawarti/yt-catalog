"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Selection } from "react-aria-components";

import { Tag, TagGroup } from "~/components/custom/TagGroup";

export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: any;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const params = new URLSearchParams(searchParams);
  
  const [selectedKey, setSelectedKey] = useState<Selection>(
    new Set([`${params.get("channelId")}`])
  );

  const handleSelectionChange = (key: Selection) => {
    if (!key) {
      setSelectedKey(key);
      return;
    }

    setSelectedKey(key);
    const selectedKeyStringify = Array.from(key)[0]?.toString() || "";

    if (selectedKeyStringify) {
      params.set("channelId", selectedKeyStringify);
    } else {
      params.delete("channelId");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleOnClear = () => {
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
