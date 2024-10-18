"use client";

import { Button } from "@/app/components/Button";
import withAuth from "@/app/context/withAuth";

import { useEffect, useState } from "react";
import CatalogTable from "./catalog-table";
import fetchApi from "@/lib/fetch";
import { toast } from "@/app/components/Toast";
import { BreadcrumbLayer } from "@/app/components/Breadcrumbs";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const router = useRouter();

  const getUserCatalog = async () => {
    try {
      const result = await fetchApi("/catalogs");
      setCatalogs(result.data);
    } catch (err) {}
  };

  const handleEdit = (catalogId: string) => {
    router.push(`/catalogs/${catalogId}/edit`);
  };

  const handleDelete = async (catalogId: string) => {
    if (catalogId) {
      try {
        const result = await fetchApi(`/catalogs/${catalogId}/delete`, {
          method: "DELETE",
        });
        await getUserCatalog();
        toast(result.message);
      } catch (err) {}
    }
  };

  useEffect(() => {
    getUserCatalog();
  }, []);

  const createNewCatalog = async () => {
    const result = await fetchApi("/catalogs", {
      method: "POST",
    });

    getUserCatalog();

    toast(result.message);
  };

  const bcLayers = [
    {
      label: "Dashboard",
      disabled: true,
    },
  ];

  return (
    <div className="py-10">
      <BreadcrumbLayer layers={bcLayers} />
      <section className="flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg lg:text-xl">Catalogs</h1>
            <Button onPress={createNewCatalog}>Create Catalog</Button>
          </div>

          {catalogs?.length ? (
            <section className="w-full">
              <CatalogTable
                catalogs={catalogs}
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
