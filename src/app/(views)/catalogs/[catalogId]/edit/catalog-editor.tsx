"use client";

import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";

import { Badge } from "~/components/shadcn/badge";
import { Button } from "~/components/shadcn/button";
import { Separator } from "~/components/shadcn/separator";
import { LinkIcon } from "~/components/shared/icons";
import JustTip from "~/components/shared/just-the-tip";
import Spinner from "~/components/shared/spinner";
import { useToast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import AddChannelPlaylist from "./add-channel-playlist";
import CatalogForm from "./catalog-form";
import useCatalogStore from "./catalogStore";
import ChannelTable from "./channel-table";

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

  const {
    localChannels,
    setLocalChannels,
    savedChannels,
    setSavedChannels,
    localPlaylists,
    setLocalPlaylists,
    resetLocalPlaylist,
    setSavedPlaylists,
    savedPlaylists,
  } = useCatalogStore();

  useEffect(() => {
    if (catalogData?.data) {
      setSavedChannels(catalogData?.data?.channelList);
      setSavedPlaylists(catalogData?.data?.playlist);
    }
  }, [catalogData?.data, setSavedChannels, setSavedPlaylists]);

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

  const handleDeleteSavedPlaylist = async (id: string) => {
    const deletePlaylist = savedPlaylists.find((channel) => channel.id === id);
    if (deletePlaylist) {
      alert(
        `Are you sure you want to remove ${deletePlaylist.title}'s playlist from the catalog?`
      );

      const payload = savedPlaylists.filter(
        (playlist) => playlist.id != deletePlaylist.id
      );

      const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast({
          title: `${deletePlaylist.title}'s playlist deleted from the catalog.`,
        });
        mutate();
      } else {
        toast({ title: "Something went wrong." });
      }
    }
  };

  const handleDeleteLocal = (id: string) => {
    const filteredChannels = localChannels.filter(
      (channel) => channel.id !== id
    );
    setLocalChannels(filteredChannels || []);
  };

  const handleDeleteLocalPlaylist = (id: string) => {
    const filteredPlaylists = localPlaylists.filter(
      (playlist) => playlist.id !== id
    );
    setLocalPlaylists(filteredPlaylists);
  };

  const handleAddPlaylistsToCatalog = async () => {
    const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
      method: "PATCH",
      body: JSON.stringify(localPlaylists),
    });

    if (result.success) {
      toast({ title: "Catalog has been updated with new playlists." });
      resetLocalPlaylist();
      mutate();
    } else {
      toast({ title: "Something went wrong!" });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl">Edit Catalog</h1>
        <div className="flex items-center gap-3">
          {savedChannels?.length ? (
            <Link href={`/c/${catalogId}`} target="_blank">
              <JustTip label="Visit Catalog">
                <Button variant="outline">
                  <LinkIcon className="size-8" />
                </Button>
              </JustTip>
            </Link>
          ) : null}
          <AddChannelPlaylist />
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
            revalidateCatalog={mutate}
            catalogId={catalogId}
            title={catalogData?.data.title}
            description={catalogData?.data.description}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Channels</h2>
              <Badge variant="secondary">
                {savedChannels?.length} of 15 channels added
              </Badge>
            </div>
            <ChannelTable
              channels={savedChannels}
              handleDelete={handleDeleteSaved}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Playlists</h2>
              <Badge variant="secondary">
                {savedPlaylists?.length} of 15 channels added
              </Badge>
            </div>
            <ChannelTable
              channels={savedPlaylists}
              handleDelete={handleDeleteSavedPlaylist}
            />
          </div>

          {localChannels?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Unsaved Channels</h2>
                <Badge variant="secondary">
                  Can add {15 - (savedChannels.length + localChannels.length)}{" "}
                  more channels
                </Badge>
              </div>
              <ChannelTable
                channels={localChannels}
                handleDelete={handleDeleteLocal}
              />
            </div>
          ) : null}
          {localPlaylists?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Unsaved Playlists</h2>
                <Button onClick={handleAddPlaylistsToCatalog}>
                  Add to catalog
                </Button>
                {/* <Badge variant="secondary">
                            Can add {15 - (savedChannels.length + localChannels.length)}{" "}
                            more channels
                          </Badge> */}
              </div>
              <ChannelTable
                channels={localPlaylists}
                handleDelete={handleDeleteLocalPlaylist}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
