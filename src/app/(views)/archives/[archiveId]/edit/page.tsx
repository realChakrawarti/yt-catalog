"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import withAuth from "~/app/auth/with-auth-hoc";
import { Button } from "~/components/shadcn/button";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import { Separator } from "~/components/shadcn/separator";
import GridContainer from "~/components/shared/grid-container";
import Spinner from "~/components/shared/spinner";
import { toast } from "~/hooks/use-toast";
import { TitleDescriptionSchema as ArchiveSchema } from "~/types-schema/schemas";
import type { TitleDescriptionType as ArchiveMeta } from "~/types-schema/types";
import fetchApi from "~/utils/fetch";

import AddVideoDialog from "./add-video-dialog";
import VideoCard from "./video-card";

type ArchivePageParams = {
  archiveId: string;
};

const initialState = {
  title: "",
  description: "",
};

function EditArchive({ params }: { params: ArchivePageParams }) {
  const { archiveId } = params;

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
      return revalidateArchive();
    }
    toast({ title: result.message });
  }

  console.log(">>>images", archiveData?.data);

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

export default withAuth(EditArchive);
