"use client";

import CatalogTable from "./catalog-table";
import fetchApi from "~/utils/fetch";
import { toast } from "~/components/custom/Toast";
import { BreadcrumbLayer } from "~/components/custom/Breadcrumbs";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Spinner from "~/components/custom/Spinner";
import withAuth from "~/app/auth/with-auth-hoc";
import { Button } from "~/components/shadcn/button";

function DashboardPage() {
  const router = useRouter();

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
        toast(result.message);
      } catch (err) {}
    }
  };

  const createNewCatalog = async () => {
    const result = await fetchApi("/catalogs", {
      method: "POST",
    });

    if (result.success) {
      mutate();
      toast(result.message);
      router.replace(`/catalogs/${result.data.catalogId}/edit`);
    } else {
      toast("Failed to create catalog.");
    }
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
            <Button onClick={createNewCatalog}>Create Catalog</Button>
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
