import { useRouter } from "next/navigation";
import useSWR from "swr";

import {ArchiveIcon} from "~/components/custom/icons"
import Spinner from "~/components/custom/spinner";
import { Badge } from "~/components/shadcn/badge";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import ArchiveTable from "./archive-table";
import CreateArchiveDialog from "./create-archive-dialog";

const LIMIT_ARCHIVES = 10;

export default function ArchiveView() {
  const router = useRouter();
  const {
    data: archives,
    isLoading: isArchiveLoading,
    error: isArchiveError,
    mutate,
  } = useSWR("/archives", (url) => fetchApi(url, { cache: "no-store" }));

  const handleArchiveEdit = (archiveId: string) => {
    router.push(`/archives/${archiveId}/edit`);
  };

  const handleArchiveDelete = async (archiveId: string) => {
    if (archiveId) {
      try {
        const result = await fetchApi(`/archives/${archiveId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast({ title: result.message });
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl flex items-center gap-3">
          <ArchiveIcon />
          <p>Archives</p>
          <Badge className="text-lg lg:text-xl text-primary" variant="outline">
            {archives?.data.length}/{LIMIT_ARCHIVES}
          </Badge>
        </h1>
        <CreateArchiveDialog
          disabled={archives?.data.length >= LIMIT_ARCHIVES}
          revalidateCatalogs={mutate}
        />
      </div>
      {isArchiveError && <p>Error loading archives</p>}
      {isArchiveLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full rounded-lg">
          {/* TODO: Maybe add a skeleton? */}
          <ArchiveTable
            archives={archives?.data}
            onDelete={handleArchiveDelete}
            onEdit={handleArchiveEdit}
          />
        </section>
      )}
    </div>
  );
}
