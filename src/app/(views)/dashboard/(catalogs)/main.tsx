"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";

import {BookOpenIcon} from "~/components/custom/icons"
import Spinner from "~/components/custom/spinner";
import { Badge } from "~/components/shadcn/badge";
import { toast } from "~/hooks/use-toast";
import fetchApi from "~/utils/fetch";

import CatalogTable from "./catalog-table";
import CreateCatalogDialog from "./create-catalog-dialog";

const LIMIT_CATALOGS = 5;

export default function CatalogView() {
  const router = useRouter();

  const {
    data: catalogs,
    isLoading: isCatalogLoading,
    error: isCatalogError,
    mutate,
  } = useSWR("/catalogs", (url) => fetchApi(url, { cache: "no-store" }));

  // TODO: Normal navigation with pre-fetch catalog meta data on Link?
  const handleCatalogEdit = (catalogId: string) => {
    router.push(`/catalogs/${catalogId}/edit`);
  };

  const handleCatalogDelete = async (catalogId: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl flex items-center gap-3">
          <BookOpenIcon />
          <p>Catalogs</p>
          <Badge className="text-lg lg:text-xl text-primary" variant="outline">
            {catalogs?.data.length}/{LIMIT_CATALOGS}
          </Badge>
        </h1>
        <div className="flex items-center gap-3">
          <CreateCatalogDialog
            disabled={catalogs?.data.length >= LIMIT_CATALOGS}
            revalidateCatalogs={mutate}
          />
        </div>
      </div>
      {isCatalogError && <p>Error loading catalogs</p>}
      {isCatalogLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full rounded-lg">
          {/* TODO: Maybe add a skeleton? */}
          <CatalogTable
            catalogs={catalogs?.data}
            onDelete={handleCatalogDelete}
            onEdit={handleCatalogEdit}
          />
        </section>
      )}
    </div>
  );
}
