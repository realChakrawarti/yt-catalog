import { Edit } from "lucide-react";
import { FormEvent } from "react";
import { KeyedMutator } from "swr";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { ApiResponse } from "~/shared/lib/next/nx-response";
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
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { useMetaValidate } from "~/widgets/use-meta-validate";

interface UpdateCatalogMetaProps {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
  catalogId: string;
  title: string;
  description: string;
}

export default function UpdateCatalogMeta({
  revalidateCatalog,
  catalogId,
  title,
  description,
}: UpdateCatalogMetaProps) {
  const { meta, metaError, handleOnChange, submitDisabled } = useMetaValidate({
    title,
    description,
  });

  async function updateArchiveMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await fetchApi(`/catalogs/${catalogId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: meta.title,
        description: meta.description,
      }),
    });

    if (!result.success) {
      toast({ title: result.message });
    } else {
      revalidateCatalog();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Catalog</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => updateArchiveMeta(e)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={meta.title}
              name="title"
              onChange={handleOnChange}
            />
            {metaError.title ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {metaError.title}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={meta.description}
              name="description"
              onChange={handleOnChange}
            />
            {metaError.description ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {metaError.description}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={Boolean(submitDisabled)} type="submit">
                Update
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
