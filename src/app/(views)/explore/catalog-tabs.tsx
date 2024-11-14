"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import Spinner from "~/components/custom/Spinner";
import { Tab, TabList, TabPanel, Tabs } from "~/components/custom/Tabs";
import fetchApi from "~/utils/fetch";

import CatalogCard from "./catalog-card";

// TODO: Make use of usehooks-ts "useLocalStorage" maybe?
export default function CatalogTabs() {
  const [favoriteCatalogs, setFavoriteCatalogs] = useState([]);

  const {
    data: validCatalogs,
    isLoading,
    error,
  } = useSWR("/catalogs/valid", () => fetchApi("/catalogs/valid", {cache: "no-store"}));

  useEffect(() => {
    setFavoriteCatalogs(
      JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
    );
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab id="public">Public</Tab>
        <Tab id="favorite">Favorites</Tab>
      </TabList>
      <TabPanel className="p-0" id="public">
        {isLoading && <Spinner className="size-8" />}
        {!error && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {validCatalogs?.data?.length ? (
              validCatalogs?.data?.map((pageData: any) => {
                if (pageData?.id) {
                  return <CatalogCard key={pageData.id} pageData={pageData} />;
                }
              })
            ) : (
              <div>No catalogs found</div>
            )}
          </div>
        )}
      </TabPanel>
      <TabPanel id="favorite">
        <div>
          <h1 className="text-lg">Favorite Catalogs</h1>
          {favoriteCatalogs.map((favCatalog: any) => {
            return (
              <Link href={`/@${favCatalog.id}`} key={favCatalog.id}>
                <section className="flex px-4 py-2 border-2 border-orange-600 flex-col gap-3">
                  <div className="space-y-1">
                    <h1 className="text-base">{favCatalog.title}</h1>
                    <p className="text-sm text-gray-400">
                      {favCatalog.description}
                    </p>
                  </div>
                </section>
              </Link>
            );
          })}
        </div>
      </TabPanel>
    </Tabs>
  );
}
