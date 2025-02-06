"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { useToast } from "~/shared/hooks/use-toast";
import type { TitleDescriptionType } from "~/shared/types-schema/types";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { LinkIcon } from "~/shared/ui/icons";
import { Separator } from "~/shared/ui/separator";
import fetchApi from "~/utils/fetch";
import JustTip from "~/widgets/just-the-tip";
import Spinner from "~/widgets/spinner";

import AddChannelPlaylist from "./add-channel-playlist";
import CatalogForm from "./catalog-form";
import useCatalogStore from "./catalog-store";
import ChannelTable from "./channel-table";
import PlaylistTable from "./playlist-table";

type UpdateCatalogPayload = {
  channels?: string[];
  title?: string;
  description?: string;
};

// TODO: Instead of table for rendering saved and unsaved channels/playlist, consider using cards
// This will simplify the UI/UX. Against each unsaved, add a button to saved.
// Make a separate endpoint for updating catalog's title and description

export default function EditCatalog({ catalogId }: { catalogId: string }) {
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
    if (!deleteChannel) {
      return;
    }

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
  };

  const handleDeleteSavedPlaylist = async (id: string) => {
    const deletePlaylist = savedPlaylists.find((channel) => channel.id === id);
    if (!deletePlaylist) {
      return;
    }

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
    // Check if channelId already exists in savedChannels
    const alreadyExists = savedChannels?.some((channel) => {
      if (channel.id === localPlaylists[0].channelId) {
        toast({
          title: `${channel.title}'s channel is already added to the catalog.`,
          description:
            "Please remove the channel before proceeding to add specific playlist from the same channel.",
        });
        return true;
      }
      return false;
    });

    if (alreadyExists) return;

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

  const [catalogMetadata, setCatalogMetadata] = useState<TitleDescriptionType>({
    title: "",
    description: "",
  });

  const [catalogMetadataError, setCatalogMetadataError] =
    useState<TitleDescriptionType>({
      title: "",
      description: "",
    });

  useEffect(() => {
    setCatalogMetadata({
      title: catalogData?.data.title,
      description: catalogData?.data.description,
    });
  }, [catalogId, catalogData?.data]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (catalogMetadataError.title || catalogMetadataError.description) {
      return;
    }

    const payload: UpdateCatalogPayload = {
      channels: savedChannels.map((channel) => channel.id),
      description: catalogMetadata.description,
      title: catalogMetadata.title,
    };

    if (localChannels.length) {
      payload.channels?.push(...localChannels.map((item) => item.id));
    }

    // Check if any playlist is already added of the channel, if so ask to remove the playlists
    const playlistExists = localChannels?.some((channel) => {
      return savedPlaylists?.some((playlist) => {
        if (playlist.channelId === channel.id) {
          toast({
            title: `${channel.title} has already added specific playlists.`,
            description: `Remove ${channel.title} playlists to add this channel.`,
          });
          return true;
        }
      });
    });

    if (playlistExists) return;

    try {
      setIsSubmitting(true);
      const result = await fetchApi(`/catalogs/${catalogId}/update`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        mutate();
        setLocalChannels([]);
      }

      toast({ title: result.message });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3">
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
              catalogMetadataError={catalogMetadataError}
              catalogMetadata={catalogMetadata}
              setCatalogMetadata={setCatalogMetadata}
              setCatalogMetadataError={setCatalogMetadataError}
            />

            {localChannels?.length ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Unsaved Channels</h2>
                  <div className="flex gap-2 mt-5 justify-end">
                    <Button
                      disabled={Boolean(
                        (!localChannels.length &&
                          (catalogMetadataError.title ||
                            catalogMetadataError.description)) ||
                          isSubmitting
                      )}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? <Spinner className="size-4" /> : null}
                      Apply
                    </Button>
                  </div>
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
                </div>
                <PlaylistTable
                  playlists={localPlaylists}
                  handleDelete={handleDeleteLocalPlaylist}
                />
              </div>
            ) : null}

            {savedChannels?.length ? (
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
            ) : null}

            {savedPlaylists?.length ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Saved Playlists</h2>
                  <Badge variant="secondary">
                    {savedPlaylists?.length} of 15 channels added
                  </Badge>
                </div>
                <PlaylistTable
                  playlists={savedPlaylists}
                  handleDelete={handleDeleteSavedPlaylist}
                />
              </div>
            ) : null}
          </div>
        )}
      </>
    </div>
  );
}
