"use client";

import { Tab, TabList, TabPanel, Tabs } from "@/app/components/Tabs";
import { useEffect, useState } from "react";
import CatalogCard from "./catalog-card";
import fetchApi from "@/lib/fetch";
import Link from "next/link";

// TODO: Make use of usehooks-ts "useLocalStorage" maybe?
export default function CatalogTabs() {
  const [catalogsData, setCatalogsData] = useState([]);

  const [favoriteCatalogs, setFavoriteCatalogs] = useState([]);

  useEffect(() => {
    const getValidCatalogs = async () => {
      const result = await fetchApi("/catalogs/valid");
      setCatalogsData(result?.data);
    };

    setFavoriteCatalogs(
      JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
    );

    getValidCatalogs();
  }, []);

  return (
    <Tabs>
      <TabList>
        <Tab id="public">Public</Tab>
        <Tab id="favorite">Favorites</Tab>
      </TabList>
      <TabPanel id="public">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {catalogsData?.length ? (
            catalogsData?.map((pageData: any) => {
              if (pageData?.id) {
                return <CatalogCard key={pageData.id} pageData={pageData} />;
              }
            })
          ) : (
            <div>No catalogs found</div>
          )}
        </div>
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
