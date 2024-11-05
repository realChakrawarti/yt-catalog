"use client";

import { Button } from "@/app/components/Button";
import withAuth from "@/app/context/withAuth";
import CatalogTable from "./catalog-table";
import fetchApi from "@/lib/fetch";
import { toast } from "@/app/components/Toast";
import { BreadcrumbLayer } from "@/app/components/Breadcrumbs";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "@/app/components/Spinner";

function DashboardPage() {
  const router = useRouter();

  const {
    data: catalogs,
    isLoading,
    error,
    mutate,
  } = useSWR("/catalogs", (url) => fetchApi<any[]>(url));

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
        toast(result.message);
      } catch (err) {}
    }
  };

  const createNewCatalog = async () => {
    const result = await fetchApi<any>("/catalogs", {
      method: "POST",
    });

    mutate();
    toast(result.message);
    router.replace(`/catalogs/${result.data.catalogId}/edit`);
  };

  const bcLayers = [
    {
      label: "Dashboard",
      disabled: true,
    },
  ];

  return (
    <div>
      <BreadcrumbLayer layers={bcLayers} />
      <section className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg lg:text-xl">Catalogs</h1>
            <Button onPress={createNewCatalog}>Create Catalog</Button>
          </div>
          {error && <p>Error loading catalogs</p>}
          {isLoading ? (
            <Spinner className="size-8" />
          ) : catalogs?.data?.length ? (
            <section className="w-full">
              <CatalogTable
                catalogs={catalogs.data}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </section>
          ) : (
            <div>No catalog was found!</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default withAuth(DashboardPage);
