import { FormEvent, useState } from "react";

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
import { TitleDescriptionSchema as ArchiveSchema } from "~/types-schema/schemas";
import type { TitleDescriptionType as ArchiveMeta } from "~/types-schema/types";
import fetchApi from "~/utils/fetch";

const initialState = {
  title: "",
  description: "",
};

// TODO: Consider using reducer to handle state updates, revalidate and show notification
export default function CreateArchiveDialog({
  revalidateCatalogs,
  disabled,
}: any) {
  const [archiveMeta, setArchiveMeta] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const [archiveMetaError, setArchiveMetaError] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const createNewArchive = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetchApi("/archives", {
      method: "POST",
      body: JSON.stringify({
        title: archiveMeta.title,
        description: archiveMeta.description,
      }),
    });

    if (result.success) {
      revalidateCatalogs();
      toast({ title: result.message });
      setArchiveMeta(initialState);
      setArchiveMetaError(initialState);
    } else {
      toast({ title: "Failed to create archive." });
    }
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

  const submitDisabled =
    archiveMetaError.title ||
    archiveMetaError.description ||
    !archiveMeta.title ||
    !archiveMeta.description;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <span className="flex items-center gap-2">
            <CatalogAddIcon size={24} />
            Create Archive
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add archive</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => createNewArchive(e)}
        >
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

