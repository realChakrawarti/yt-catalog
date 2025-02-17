import { ChangeEvent, FormEvent, useState } from "react";
import { KeyedMutator } from "swr";

import { useConfetti } from "~/shared/hooks/use-confetti";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { ApiResponse } from "~/shared/lib/next/nx-response";
import { TitleDescriptionSchema as ArchiveSchema } from "~/shared/types-schema/schemas";
import type { TitleDescriptionType as ArchiveMeta } from "~/shared/types-schema/types";
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

interface CreateArchiveDialogProps {
  disabled: boolean;
  revalidateCatalogs: KeyedMutator<ApiResponse<any>>;
}

// TODO: Consider using reducer to handle state updates, revalidate and show notification
export default function CreateArchiveDialog({
  revalidateCatalogs,
  disabled,
}: CreateArchiveDialogProps) {
  const [archiveMeta, setArchiveMeta] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const [archiveMetaError, setArchiveMetaError] = useState<ArchiveMeta>({
    title: "",
    description: "",
  });

  const triggerConfetti = useConfetti();

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
      triggerConfetti();
    } else {
      toast({ title: "Failed to create archive." });
    }
  };

  const handleMetaUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setArchiveMeta((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    const parseArchiveMetadata = {
      ...archiveMeta,
      [e.target.name]: e.target.value,
    };

    const result = ArchiveSchema.safeParse(parseArchiveMetadata);

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
            <PlusIcon size={24} />
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
