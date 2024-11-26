"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { z } from "zod";

import withAuth from "~/app/auth/with-auth-hoc";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

type ArchivePageParams = {
  archiveId: string;
};

const ArchiveSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be at least 4 characters long." })
    .max(16, { message: "Title must be at most 16 characters long." }),
  description: z
    .string()
    .min(8, { message: "Description must be at least 8 characters long." })
    .max(64, { message: "Description must be at most 64 characters long." }),
});

type ArchiveMeta = z.infer<typeof ArchiveSchema>;

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

  const [archiveMeta, setArchiveMeta] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const [archiveMetaError, setArchiveMetaError] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (archiveMetaError.title || archiveMetaError.description) {
      return;
    }

    const payload = {
      title: archiveMeta.title,
      description: archiveMeta.description,
    };

    setIsSubmitting(true);
    const result = await fetchApi(`/archives/${archiveId}/update`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (result.success) {
      revalidateArchive();
    }

    toast({ title: result.message });
    setIsSubmitting(false);
  };

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
      setArchiveMetaError({
        title: "",
        description: "",
      });
    }
  };

  useEffect(() => {
    setArchiveMeta({
      title: archiveData?.data?.title,
      description: archiveData?.data?.description,
    });
  }, [archiveData?.data]);

  return (
    <div className="p-3">
      <h1>Edit Archive</h1>
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
      </div>
    </div>
  );
}

export default withAuth(EditArchive);
