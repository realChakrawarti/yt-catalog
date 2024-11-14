"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";

import withAuth from "~/app/auth/with-auth-hoc";
import { CatalogAddIcon } from "~/components/custom/icons";
import Spinner from "~/components/custom/Spinner";
import { Button } from "~/components/shadcn/button";
import { useToast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import CatalogTable from "./catalog-table";

function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: catalogs,
    isLoading,
    error,
    mutate,
  } = useSWR("/catalogs", (url) => fetchApi(url, { cache: "no-store" }));

  const handleEdit = (catalogId: string) => {
    router.push(`/catalogs/${catalogId}/edit`);
  };

  const handleDelete = async (catalogId: string) => {
    if (catalogId) {
      try {
        const result = await fetchApi(`/catalogs/${catalogId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast({ title: result.message });
      } catch (err) {}
    }
  };

  const createNewCatalog = async () => {
    const result = await fetchApi("/catalogs", {
      method: "POST",
    });

    if (result.success) {
      mutate();
      toast({ title: result.message });
      router.push(`/catalogs/${result.data.catalogId}/edit`);
    } else {
      toast({ title: "Failed to create catalog." });
    }
  };

  // TODO: Maybe a search bar to search through catalogs and curate
  return (
    <div className="p-3 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg lg:text-xl">Catalogs</h1>
          <Button onClick={createNewCatalog}>
            <span className="flex items-center gap-2">
              <CatalogAddIcon size={24} />
              Create Catalog
            </span>
          </Button>
        </div>
        {error && <p>Error loading catalogs</p>}
        {isLoading ? (
          <Spinner className="size-8" />
        ) : (
          <section className="w-full rounded-lg">
            {/* TODO: Maybe add a skeleton? */}
            <CatalogTable
              catalogs={catalogs?.data}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
