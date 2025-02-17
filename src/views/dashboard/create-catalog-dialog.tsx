import { ChangeEvent, FormEvent, useState } from "react";
import { KeyedMutator } from "swr";

import { useConfetti } from "~/shared/hooks/use-confetti";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { ApiResponse } from "~/shared/lib/next/nx-response";
import { TitleDescriptionSchema as CatalogSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType as CatalogMeta } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { PlusIcon } from "~/shared/ui/icons";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";

const initialState = {
  title: "",
  description: "",
};

interface CreateCatalogDialogProps {
  disabled: boolean;
  revalidateCatalogs: KeyedMutator<ApiResponse<any>>;
}

// TODO: Consider using reducer to handle state updates, revalidate and show notification
export default function CreateCatalogDialog({
  revalidateCatalogs,
  disabled,
}: CreateCatalogDialogProps) {
  const triggerConfetti = useConfetti();

  const [catalogMeta, setCatalogMeta] = useState<CatalogMeta>({
    title: "",
    description: "",
  });

  const [catalogMetaError, setCatalogMetaError] = useState<CatalogMeta>({
    title: "",
    description: "",
  });

  const createNewCatalog = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetchApi("/catalogs", {
      method: "POST",
      body: JSON.stringify({
        title: catalogMeta.title,
        description: catalogMeta.description,
      }),
    });

    if (result.success) {
      revalidateCatalogs();
      toast({ title: result.message });
      setCatalogMeta(initialState);
      setCatalogMetaError(initialState);
      triggerConfetti();
    } else {
      toast({ title: "Failed to create catalog." });
    }
  };

  const handleMetaUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setCatalogMeta((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseCatalogMetadata = {
      ...catalogMeta,
      [e.target.name]: e.target.value,
    };

    const result = CatalogSchema.safeParse(parseCatalogMetadata);

    if (!result.success) {
      const { title = { _errors: [""] }, description = { _errors: [""] } } =
        result.error.format();
      setCatalogMetaError({
        title: title._errors[0],
        description: description._errors[0],
      });
    } else {
      setCatalogMetaError({
        title: "",
        description: "",
      });
    }
  };

  const submitDisabled =
    catalogMetaError.title ||
    catalogMetaError.description ||
    !catalogMeta.title ||
    !catalogMeta.description;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <span className="flex items-center gap-2">
            <PlusIcon size={24} />
            Create Catalog
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add catalog</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => createNewCatalog(e)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={catalogMeta.title}
              name="title"
              onChange={handleMetaUpdate}
            />
            {catalogMetaError.title ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetaError.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={catalogMeta.description}
              name="description"
              onChange={handleMetaUpdate}
            />
            {catalogMetaError.description ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {catalogMetaError.description}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={Boolean(submitDisabled)} type="submit">
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
