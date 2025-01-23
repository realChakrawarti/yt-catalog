"use client";

import { useEffect, useState } from "react";
import type { KeyedMutator } from "swr";

import { Button } from "~/components/shadcn/button";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import Spinner from "~/components/shared/spinner";
import { useToast } from "~/hooks/use-toast";
import { TitleDescriptionSchema as CatalogSchema } from "~/types-schema/schemas";
import type { TitleDescriptionType as CatalogMetadata } from "~/types-schema/types";
import fetchApi from "~/utils/fetch";
import type { ApiResponse } from "~/utils/nx-response";

import useCatalogStore from "./catalogStore";

type UpdateCatalogPayload = {
  channels?: string[];
  title?: string;
  description?: string;
};

interface CatalogFormProps {
  title: string;
  description: string;
  catalogId: string;
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
}

export default function CatalogForm({
  title,
  description,
  catalogId,
  revalidateCatalog,
}: CatalogFormProps) {
  const [catalogMetadata, setCatalogMetadata] = useState<CatalogMetadata>({
    title: "",
    description: "",
  });

  const [catalogMetadataError, setCatalogMetadataError] =
    useState<CatalogMetadata>({
      title: "",
      description: "",
    });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { toast } = useToast();

  const { setLocalChannels, localChannels, savedChannels } = useCatalogStore();

  useEffect(() => {
    setCatalogMetadata({
      title: title,
      description: description,
    });
  }, [catalogId, description, title]);

  const handleSubmit = async () => {
    if (catalogMetadataError.title || catalogMetadataError.description) {
      return;
    }

    const payload: UpdateCatalogPayload = {
      channels: savedChannels.map((channel) => channel.id),
      title: catalogMetadata.title,
      description: catalogMetadata.description,
    };

    if (localChannels.length) {
      payload.channels?.push(...localChannels.map((item: any) => item.id));
    }

    setIsSubmitting(true);
    const result = await fetchApi(`/catalogs/${catalogId}/update`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (result.success) {
      revalidateCatalog();
      setLocalChannels([]);
    }

    toast({ title: result.message });
    setIsSubmitting(false);
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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={catalogMetadata.title}
              name="title"
              onChange={handleMetaUpdate}
            />
            {catalogMetadataError.title ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetadataError.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={catalogMetadata.description}
              name="description"
              onChange={handleMetaUpdate}
            />
            {catalogMetadataError.description ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetadataError.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

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
    </>
  );
}
