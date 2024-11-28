"use client";

import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import JustTip from "~/components/custom/just-the-tip";
import Spinner from "~/components/custom/spinner";
import { Badge } from "~/components/shadcn/badge";
import { Button } from "~/components/shadcn/button";
import { Separator } from "~/components/shadcn/separator";
import { useToast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import CatalogForm from "./catalog-form";
import ChannelTable from "./channel-table";
import ValidateVideoDialog from "./validate-video-dialog";

type LocalChannel = {
  title: string;
  id: string;
};

export default function CatalogEditor({ catalogId }: any) {
  const { toast } = useToast();

  const {
    data: catalogData,
    isLoading,
    error,
    mutate,
  } = useSWR(
    catalogId ? `/catalogs/${catalogId}` : null,
    (url) => fetchApi(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const [localChannel, setLocalChannel] = useState<LocalChannel[]>([]);
  const [savedChannels, setSavedChannels] = useState<any[]>([]);

  useEffect(() => {
    if (catalogData?.data) {
      setSavedChannels(catalogData?.data?.channelList);
    }
  }, [catalogData?.data]);

  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find((channel) => channel.id === id);
    if (deleteChannel) {
      alert(
        `Are you sure you want to remove ${deleteChannel.title}'s channel from the catalog?`
      );

      const payload = savedChannels.filter(
        (channel) => channel.id != deleteChannel.id
      );

      const result = await fetchApi(`/catalogs/${catalogId}/update`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast({
          title: `${deleteChannel.title}'s channel deleted from the catalog.`,
        });
        mutate();
      } else {
        toast({ title: "Something went wrong." });
      }
    }
  };

  const handleDeleteLocal = (id: string) => {
    const filteredChannels = localChannel.filter(
      (channel) => channel.id !== id
    );
    setLocalChannel(filteredChannels || []);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl">Edit Catalog</h1>
        <div className="flex items-center gap-3">
          {savedChannels?.length ? (
            <Link href={`/@${catalogId}`} target="_blank">
              <JustTip label="Visit Catalog">
                <Button variant="outline">
                  <LinkIcon className="size-8" />
                </Button>
              </JustTip>
            </Link>
          ) : null}
          <ValidateVideoDialog
            localChannel={localChannel}
            savedChannels={savedChannels}
            setLocalChannel={setLocalChannel}
          />
        </div>
      </div>
      <Separator className="my-3" />
      {error && <p>Something went wrong!</p>}
      {isLoading && (
        <div className="size-full grid items-center">
          <Spinner className="size-8" />
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-7">
          <CatalogForm
            setLocalChannel={setLocalChannel}
            revalidateCatalog={mutate}
            catalogId={catalogId}
            savedChannels={savedChannels}
            localChannel={localChannel}
            catalogData={catalogData?.data}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Channels</h2>
              <Badge variant="secondary">
                {savedChannels.length} of 15 channels added
              </Badge>
            </div>
            <ChannelTable
              channels={savedChannels}
              handleDelete={handleDeleteSaved}
            />
          </div>

          {localChannel?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Unsaved Channels</h2>
                <Badge variant="secondary">
                  Can add {15 - (savedChannels.length + localChannel.length)}{" "}
                  more channels
                </Badge>
              </div>
              <ChannelTable
                channels={localChannel}
                handleDelete={handleDeleteLocal}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
