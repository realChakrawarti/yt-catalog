"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { TitleDescriptionSchema as ArchiveSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType as ArchiveMeta } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Separator } from "~/shared/ui/separator";
import GridContainer from "~/widgets/grid-container";
import Spinner from "~/widgets/spinner";

import AddVideoDialog from "./add-video-dialog";
import VideoCard from "./video-card";

const initialState = {
  title: "",
  description: "",
};

export default function EditArchive({ archiveId }: { archiveId: string }) {
  const {
    data: archiveData,
    isLoading,
    error,
    mutate: revalidateArchive,
  } = useSWR(
    archiveId ? `/archives/${archiveId}` : null,
    (url) => fetchApi(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const [archiveMeta, setArchiveMeta] = useState<ArchiveMeta>(initialState);

  const [archiveMetaError, setArchiveMetaError] =
    useState<ArchiveMeta>(initialState);

  const handleMetaUpdate = (e: any) => {
    setArchiveMeta((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseCatalogMetadata = {
      ...archiveMeta,
      [e.target.name]: e.target.value,
    };

    const result = ArchiveSchema.safeParse(parseCatalogMetadata);

    if (!result.success) {
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        result.error.format();
      setArchiveMetaError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setArchiveMetaError(initialState);
    }
  };

  useEffect(() => {
    if (archiveData?.data?.title || archiveData?.data?.description) {
      setArchiveMeta({
        title: archiveData?.data?.title,
        description: archiveData?.data?.description,
      });
    }
  }, [archiveData?.data]);

  async function handleArchiveMeta() {
    const result = await fetchApi(`/archives/${archiveId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: archiveMeta.title,
        description: archiveMeta.description,
      }),
    });

    if (!result.success) {
      toast({ title: result.message });
    } else {
      revalidateArchive();
    }
  }

  async function removeVideo(videoId: string) {
    const video = archiveData?.data?.videos.find(
      (item: any) => item.videoId === videoId
    );
    const result = await fetchApi(`/archives/${archiveId}/remove-video`, {
      method: "PATCH",
      body: JSON.stringify(video),
    });

    if (result.success) {
      revalidateArchive();
    }
    toast({ title: result.message });
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg lg:text-xl">Edit Archive</h1>
        <Button
          disabled={Boolean(
            archiveMetaError.title || archiveMetaError.description
          )}
          onClick={handleArchiveMeta}
        >
          Apply
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-1">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={archiveMeta.title}
            name="title"
            onChange={handleMetaUpdate}
          />
          {archiveMetaError.title ? (
            <p className="text-sm text-[hsl(var(--primary))]">
              {archiveMetaError.title}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={archiveMeta.description}
            name="description"
            onChange={handleMetaUpdate}
          />
          {archiveMetaError.description ? (
            <p className="text-sm text-[hsl(var(--primary))]">
              {archiveMetaError.description}
            </p>
          ) : null}
        </div>
        <Separator className="my-4" />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base lg:text-lg">Videos</h2>
            <AddVideoDialog
              archiveId={archiveId}
              revalidateArchive={revalidateArchive}
            />
          </div>
          <Separator className="my-4" />
          {error ? <div>Something went wrong!</div> : null}
          {isLoading ? (
            <Spinner className="size-8" />
          ) : archiveData?.data?.videos ? (
            <GridContainer>
              {archiveData?.data?.videos.map((item: any) => {
                return (
                  <VideoCard
                    key={item.videoId}
                    video={item}
                    removeVideo={removeVideo}
                  />
                );
              })}
            </GridContainer>
          ) : (
            <p>No videos added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
