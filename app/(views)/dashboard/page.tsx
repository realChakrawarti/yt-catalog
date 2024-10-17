"use client";
import { Button } from "@/app/components/Button";
import withAuth from "@/app/context/withAuth";

import { useEffect, useState } from "react";
import CatalogTable from "./catalog-table";
import fetchApi from "@/app/lib/fetch";
import { toast } from "@/app/components/Toast";
import {
  Breadcrumb,
  BreadcrumbLayer,
  Breadcrumbs,
} from "@/app/components/Breadcrumbs";

function DashboardPage() {
  const [catalogs, setCatalogs] = useState<any[]>([]);

  const getUserCatalog = async () => {
    try {
      const result = await fetchApi("/catalog");
      setCatalogs(result.data);
    } catch (err) {}
  };

  useEffect(() => {
    getUserCatalog();
  }, []);

  const createNewCatalog = async () => {
    const result = await fetchApi("/catalog", {
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
              <CatalogTable catalogs={catalogs} />
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
