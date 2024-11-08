"use client";

import { Button } from "@/app/components/Button";
import { Input, Label } from "@/app/components/Field";
import Spinner from "@/app/components/Spinner";
import { toast } from "@/app/components/Toast";
import withAuth from "@/app/context/withAuth";
import fetchApi from "@/lib/fetch";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ChannelTable from "./channel-table";
import Link from "next/link";
import { channel } from "diagnostics_channel";

type CatalogPageParams = {
  catalogId: string;
};

type UpdateCatalogPayload = {
  channels?: string[];
  title?: string;
  description?: string;
};

type LocalChannel = {
  title: string;
  id: string;
};

function EditCatalog({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  const {
    data: catalogData,
    isLoading,
    error,
    mutate,
  } = useSWR(catalogId ? `/catalogs/${catalogId}` : null, (url) =>
    fetchApi(url)
  );

  const [localChannel, setLocalChannel] = useState<LocalChannel[]>([]);

  const [inputCatalogMetadata, setInputCatalogMetadata] = useState({
    title: "",
    description: "",
  });

  const [savedChannels, setSavedChannels] = useState<any[]>([]);

  const [videoLink, setVideoLink] = useState<string>("");

  useEffect(() => {
    setInputCatalogMetadata({
      title: catalogData?.data?.title,
      description: catalogData?.data?.description,
    });

    if (catalogData?.data) {
      setSavedChannels(catalogData?.data?.channelList);
    }
  }, [catalogData?.data]);

  const handleSubmit = async () => {
    const payload: UpdateCatalogPayload = {
      channels: savedChannels.map((channel) => channel.id),
      title: inputCatalogMetadata.title,
      description: inputCatalogMetadata.description,
    };

    if (localChannel.length) {
      payload.channels?.push(...localChannel.map((item) => item.id));
    }

    const result = await fetchApi(`/catalogs/${params.catalogId}/update`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (result.success) {
      mutate();
    }

    toast(result.message);
    setLocalChannel([]);
  };

  const validateVideoLink = async () => {
    const regex =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const found = videoLink.match(regex);
    let videoId = "";
    if (found?.length) {
      videoId = found[1];
    }

    if (videoId) {
      const result = await fetchApi(`/youtube/videoId?videoId=${videoId}`);

      if (!result.success) {
        toast(result.message);
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      const alreadyExists = localChannel.find((item) => item.id === channelId);

      const alreadySaved = savedChannels?.find(
        (channel: any) => channel.id === channelId
      );

      if (!alreadyExists && !alreadySaved) {
        setLocalChannel((prev) => [
          ...prev,
          { id: channelId, title: channelTitle },
        ]);
        toast(`${channelTitle}'s channel added to the list.`);
      } else if (alreadyExists) {
        toast(`${channelTitle}'s channel already added to the list.`);
      } else if (alreadySaved) {
        toast(`${channelTitle}'s channel already saved.`);
      }

      setVideoLink("");
    }
  };

  const handleVideoLink = (e: any) => {
    setVideoLink(e.target.value);
  };

  const handleMetaUpdate = (e: any) => {
    setInputCatalogMetadata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find((channel) => channel.id === id);
    if (deleteChannel) {
      alert(
        `Are you sure you want to remove ${deleteChannel.title}'s channel from the catalog?`
      );

      const payload = savedChannels.filter(
        (channel) => channel.id != deleteChannel.id
      );

      const result = await fetchApi(`/catalogs/${params.catalogId}/update`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast(`${deleteChannel.title}'s channel deleted from the catalog.`);
        mutate();
      } else {
        toast("Something went wrong.");
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
    <div>
      <h1 className="text-lg md:text-xl">Edit Catalog</h1>
      {error && <p>Something went wrong!</p>}
      {isLoading && <Spinner className="size-8" />}
      {!isLoading && !error && (
        <div>
          <div className="flex gap-2 items-center">
            {savedChannels?.length ? (
              <Link href={`/@${catalogId}`} target="_blank">
                Visit Catalog
              </Link>
            ) : null}
          </div>
          <div className="space-y-4 mt-5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                value={inputCatalogMetadata.title}
                onChange={handleMetaUpdate}
                name="title"
                id="title"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="description">Description</Label>
              <Input
                value={inputCatalogMetadata.description}
                onChange={handleMetaUpdate}
                name="description"
                id="description"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="add-video">Add channel from video</Label>
              <Input
                id="add-video"
                value={videoLink}
                onChange={handleVideoLink}
              />
            </div>
            {videoLink ? (
              <Button onPress={validateVideoLink}>Validate</Button>
            ) : null}
          </div>

          {localChannel.length ? (
            <div className="flex gap-2 mt-5">
              <Button onPress={handleSubmit}>Submit</Button>
            </div>
          ) : null}

          <div className="pt-5">
            {savedChannels?.length ? (
              <>
                <h2>Saved</h2>
                <ChannelTable
                  channels={savedChannels}
                  handleDelete={handleDeleteSaved}
                />
              </>
            ) : (
              <p>No channels added yet</p>
            )}
          </div>
          <div className="pt-5">
            {localChannel?.length ? (
              <>
                <h2>Not saved</h2>
                <ChannelTable
                  channels={localChannel}
                  handleDelete={handleDeleteLocal}
                />
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(EditCatalog);
