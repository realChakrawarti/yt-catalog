"use client";

import {
  BreadcrumbLayer,
  BreadcrumbLayerProps,
} from "@/app/components/Breadcrumbs";
import { Button } from "@/app/components/Button";
import { Dialog } from "@/app/components/Dialog";
import { Input, Label } from "@/app/components/Field";
import { Popover } from "@/app/components/Popover";
import { toast } from "@/app/components/Toast";
import withAuth from "@/app/context/withAuth";
import fetchApi from "@/lib/fetch";
import { useEffect, useState } from "react";
import { DialogTrigger, TextArea } from "react-aria-components";

type CatalogPageParams = {
  catalogId: string;
};

function EditCatalog({ params }: { params: CatalogPageParams }) {
  const [inputChannelValue, setInputChannelValue] = useState<string>("");
  const [inputCatalogMetadata, setInputCatalogMetadata] = useState({
    title: "",
    description: "",
  });

  const [videoLink, setVideoLink] = useState<string>("");

  const getChannels = async (currentPage: string) => {
    const result = await fetchApi(`/catalogs/${currentPage}`);
    const catalogData = result?.data;
    const channelList = catalogData?.channelList;
    setInputCatalogMetadata({
      title: catalogData.title,
      description: catalogData.description,
    });
    if (channelList?.length) {
      const channelIdList = channelList.map((channel: any) => channel.id);
      const data = channelIdList.join(",");
      setInputChannelValue(data);
    }
  };

  useEffect(() => {
    if (params.catalogId) {
      getChannels(params.catalogId);
    }
  }, [params.catalogId]);

  const handleChange = (e: any) => {
    setInputChannelValue(e.target.value);
  };

  type UpdateCatalogPayload = {
    channels?: string[];
    title?: string;
    description?: string;
  };

  const handleSubmit = async () => {
    const channels = inputChannelValue.split(",");
    const trimmedChannels = channels.map((channel) => channel.trim());

    const payload: UpdateCatalogPayload = {
      channels: undefined,
      title: inputCatalogMetadata.title,
      description: inputCatalogMetadata.description,
    };

    if (channels.length) {
      payload.channels = trimmedChannels;
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
      const result = await fetchApi(`/youtube/videoId?videoId=${videoId}`);

      if (!result.success) {
        toast(result.message);
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;

      toast(`${videoData.channelTitle}'s channel ID has been added!`);
      setVideoLink("");

      if (!inputChannelValue) {
        setInputChannelValue(channelId);
      } else {
        setInputChannelValue((value) => value + `, ${channelId}`);
      }
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
    <div className="py-10">
      <BreadcrumbLayer layers={bcLayers} />
      <h1 className="text-lg md:text-xl">Edit Catalog</h1>
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
          <Input id="add-video" value={videoLink} onChange={handleVideoLink} />
        </div>
        {videoLink ? (
          <Button onPress={validateVideoLink}>Validate</Button>
        ) : null}
        <div className="flex flex-col gap-2">
          <Label>Channel IDs (CSV)</Label>
          <TextArea
            placeholder="UCKy1dAqELo0zrOtPkf0eTMw, UCBR8-60-B28hp2BmDPdntcQ"
            className="text-red-600 w-full p-2 focus-visible:outline-none"
            rows={5}
            value={inputChannelValue}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <Button onPress={handleSubmit}>Submit</Button>

        <DialogTrigger>
          <Button>Find Channel ID</Button>
          <Popover className="size-auto" showArrow>
            <Dialog>
              <video autoPlay width={480} height={320} controls>
                <source src="/channel-id.mp4" type="video/mp4" />
              </video>
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
    </div>
  );
}

export default withAuth(EditCatalog);
