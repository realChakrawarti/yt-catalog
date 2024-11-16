"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

import { Input, Label } from "~/components/custom/Field";
import Spinner from "~/components/custom/spinner";
import { Button } from "~/components/shadcn/button";
import { useToast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

const YouTubeVideoLinkRegex =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

const CatalogSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long." })
    .max(16, { message: "Title must be at most 16 characters long." }),
  description: z
    .string()
    .min(8, { message: "Description must be at least 8 characters long." })
    .max(64, { message: "Description must be at most 64 characters long." }),
});

type VideoLink = {
  link: string;
  error: string;
};

type CatalogMetadata = z.infer<typeof CatalogSchema>;

type UpdateCatalogPayload = {
  channels?: string[];
  title?: string;
  description?: string;
};

export default function CatalogForm({
  savedChannels,
  localChannel,
  catalogData,
  catalogId,
  revalidateCatalog,
  setLocalChannel,
}: any) {
  const [catalogMetadata, setCatalogMetadata] = useState<CatalogMetadata>({
    title: "",
    description: "",
  });

  const [catalogMetadataError, setCatalogMetadataError] =
    useState<CatalogMetadata>({
      title: "",
      description: "",
    });

  const [videoLink, setVideoLink] = useState<VideoLink>({
    link: "",
    error: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setCatalogMetadata({
      title: catalogData?.title,
      description: catalogData?.description,
    });
  }, [catalogData]);

  const handleSubmit = async () => {
    if (catalogMetadataError.title || catalogMetadataError.description) {
      return;
    }

    const payload: UpdateCatalogPayload = {
      channels: savedChannels.map((channel: any) => channel.id),
      title: catalogMetadata.title,
      description: catalogMetadata.description,
    };

    if (localChannel.length) {
      payload.channels?.push(...localChannel.map((item: any) => item.id));
    }

    setIsSubmitting(true);
    const result = await fetchApi(`/catalogs/${catalogId}/update`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (result.success) {
      revalidateCatalog();
    }

    toast({ title: result.message });
    setIsSubmitting(false);
    setLocalChannel([]);
  };

  const validateVideoLink = async () => {
    const found = videoLink.link.match(YouTubeVideoLinkRegex);
    let videoId = "";
    if (found?.length) {
      videoId = found[1];
    }

    if (videoId) {
      const result = await fetchApi(`/youtube/videoId?videoId=${videoId}`);

      if (!result.success) {
        toast({ title: result.message });
        return;
      }
      const videoData = result.data.items[0].snippet;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      const alreadyExists = localChannel.find(
        (item: any) => item.id === channelId
      );

      const alreadySaved = savedChannels?.find(
        (channel: any) => channel.id === channelId
      );

      if (!alreadyExists && !alreadySaved) {
        setLocalChannel((prev: any) => [
          ...prev,
          { id: channelId, title: channelTitle },
        ]);
        toast({ title: `${channelTitle}'s channel added to the list.` });
      } else if (alreadyExists) {
        toast({
          title: `${channelTitle}'s channel already added to the list.`,
        });
      } else if (alreadySaved) {
        toast({ title: `${channelTitle}'s channel already saved.` });
      }

      setVideoLink({
        link: "",
        error: "",
      });
    }
  };

  const handleVideoLink = (e: any) => {
    setVideoLink((prev) => ({
      ...prev,
      link: e.target.value,
    }));

    if (!YouTubeVideoLinkRegex.test(e.target.value)) {
      setVideoLink((prev) => ({
        ...prev,
        error: "Invalid YouTube video link.",
      }));

      return;
    } else {
      setVideoLink((prev) => ({
        ...prev,
        error: "",
      }));
    }
  };

  const handleMetaUpdate = (e: any) => {
    setCatalogMetadata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseCatalogMetadata = {
      ...catalogMetadata,
      [e.target.name]: e.target.value,
    };

    const result = CatalogSchema.safeParse(parseCatalogMetadata);

    if (!result.success) {
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        result.error.format();
      setCatalogMetadataError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setCatalogMetadataError({
        title: "",
        description: "",
      });
    }
  };

  return (
    <>
      <div className="space-y-4 mt-5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Title</Label>
          <Input
            value={catalogMetadata.title}
            onChange={handleMetaUpdate}
            name="title"
            id="title"
          />
          {catalogMetadataError.title ? (
            <p className="text-sm text-red-800">{catalogMetadataError.title}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="description">Description</Label>
          <Input
            value={catalogMetadata.description}
            onChange={handleMetaUpdate}
            name="description"
            id="description"
          />
          {catalogMetadataError.description ? (
            <p className="text-sm text-red-800">
              {catalogMetadataError.description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="add-video">Add channel from video</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="add-video"
              value={videoLink.link}
              onChange={handleVideoLink}
            />
            <Button
              disabled={Boolean(videoLink.error || !videoLink.link)}
              onClick={validateVideoLink}
            >
              Validate
            </Button>{" "}
          </div>
          {videoLink.error ? (
            <p className="text-sm text-red-800">{videoLink.error}</p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        {/* TODO: Maybe update "Not Saved" channels and title/description separately */}
        <Button
          disabled={Boolean(
            (!localChannel.length &&
              (catalogMetadataError.title ||
                catalogMetadataError.description)) ||
              isSubmitting
          )}
          onClick={handleSubmit}
        >
          {isSubmitting ? <Spinner className="size-4" /> : null}
          Submit
        </Button>
      </div>
    </>
  );
}
