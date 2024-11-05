"use client";

import {
  BreadcrumbLayer,
  BreadcrumbLayerProps,
} from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/Button";
import { Input, Label } from "@/app/components/Field";
import Spinner from "@/app/components/Spinner";
import { toast } from "@/app/components/Toast";
import withAuth from "@/app/context/withAuth";
import fetchApi from "@/lib/fetch";
import { useState } from "react";
import useSWR from "swr";
import ChannelTable from "../channel-table";
import Link from "next/link";

type CatalogPageParams = {
  catalogId: string;
};

type UpdateCatalogPayload = {
  channels?: string[];
  title?: string;
  description?: string;
};

type ChannelVideoMeta = {
  channelTitle: string;
  channelId: string;
};

// TODO: Load the table along-side form, committed and to be commmited?

function EditCatalog({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  const {
    data: catalogData,
    isLoading,
    error,
  } = useSWR(catalogId ? `/catalogs/${catalogId}` : null, (url) =>
    fetchApi<any>(url)
  );

  const [channelVideoMeta, setChannelVideoMeta] = useState<ChannelVideoMeta[]>(
    []
  );

  // TODO: Changing from uncontrolled to controlled. Initial data undefined.
  const [inputCatalogMetadata, setInputCatalogMetadata] = useState({
    title: catalogData?.data?.title,
    description: catalogData?.data?.description,
  });

  const [videoLink, setVideoLink] = useState<string>("");

  const handleSubmit = async () => {
    const payload: UpdateCatalogPayload = {
      channels: undefined,
      title: inputCatalogMetadata.title,
      description: inputCatalogMetadata.description,
    };

    if (channelVideoMeta.length) {
      payload.channels = channelVideoMeta.map((item) => item.channelId);
    }

    const result = await fetchApi(`/catalogs/${params.catalogId}/update`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    toast(result.message);
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
      const result = await fetchApi<any>(`/youtube/videoId?videoId=${videoId}`);

      if (!result.success) {
        toast(result.message);
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      const alreadyExists = channelVideoMeta.find(
        (item) => item.channelId === channelId
      );

      if (!alreadyExists) {
        setChannelVideoMeta((prev) => [...prev, { channelId, channelTitle }]);
      }

      toast(`${channelTitle}'s channel ID has been added!`);
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

  const bcLayers: BreadcrumbLayerProps[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: `Catalogs/${params.catalogId}`,
      href: `/catalogs/${params.catalogId}`,
    },
    {
      label: "Edit Catalog",
      disabled: true,
    },
  ];

  return (
    <div>
      <BreadcrumbLayer layers={bcLayers} />
      <h1 className="text-lg md:text-xl">Edit Catalog</h1>
      {error && <p>Something went wrong!</p>}
      {isLoading && <Spinner className="size-8" />}
      {!isLoading && !error && (
        <div>
          <div className="flex gap-2 items-center">
            {catalogData?.data?.channelList?.length ? (
              <Link href={`/@${catalogId}`} target="_blank">
                Visit Catalog
              </Link>
            ) : null}
          </div>
          <div className="pt-5">
            {catalogData?.data?.channelList?.length ? (
              <ChannelTable channels={catalogData?.data?.channelList} />
            ) : (
              <p>No channels added yet</p>
            )}
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

          {channelVideoMeta.length ? (
            <div className="flex gap-2 mt-5">
              <Button onPress={handleSubmit}>Submit</Button>
            </div>
          ) : null}

          <div>{JSON.stringify(channelVideoMeta, null, 2)}</div>
        </div>
      )}
    </div>
  );
}

export default withAuth(EditCatalog);
