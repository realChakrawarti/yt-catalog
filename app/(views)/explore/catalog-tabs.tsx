"use client";

import { Tab, TabList, TabPanel, Tabs } from "@/app/components/Tabs";
import { useEffect, useState } from "react";
import CatalogCard from "./catalog-card";
import fetchApi from "@/lib/fetch";
import Link from "next/link";

export default function CatalogTabs() {
  const [catalogsData, setCatalogsData] = useState([]);

  const [favoriteCatalogs, setFavoriteCatalogs] = useState(
    JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
  );

  useEffect(() => {
    const getValidCatalogs = async () => {
      const result = await fetchApi("/catalogs/valid");
      setCatalogsData(result?.data);
    };

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
          Favorite Catalogs
          {favoriteCatalogs.map((favCatalog: any) => {
            return (
              <Link href={`/@${favCatalog.id}`} key={favCatalog.id}>
                <p>{favCatalog.title}</p>
                <p>{favCatalog.description}</p>
              </Link>
            );
          })}
        </div>
      </TabPanel>
    </Tabs>
  );
}
