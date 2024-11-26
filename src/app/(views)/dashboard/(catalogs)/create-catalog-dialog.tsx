import { FormEvent, useState } from "react";
import { z } from "zod";

import { CatalogAddIcon } from "~/components/custom/icons";
import { Button } from "~/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

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

type CatalogMeta = z.infer<typeof CatalogSchema>;

const initialState = {
  title: "",
  description: "",
};

// TODO: Consider using reducer to handle state updates, revalidate and show notification
export default function CreateCatalogDialog({ revalidateCatalogs }: any) {
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
    } else {
      toast({ title: "Failed to create catalog." });
    }
  };

  const handleMetaUpdate = (e: any) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <span className="flex items-center gap-2">
            <CatalogAddIcon size={24} />
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
            <DialogClose>
              <Button type="submit">Create</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
