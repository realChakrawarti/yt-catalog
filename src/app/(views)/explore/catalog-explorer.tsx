"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import Spinner from "~/components/custom/Spinner";
import fetchApi from "~/utils/fetch";

import { Button } from "../../../components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/shadcn/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/shadcn/tabs";
import CatalogCard from "./catalog-card";

export function CatalogExplorer() {
  const [favoriteCatalogs, setFavoriteCatalogs] = useState([]);

  const {
    data: validCatalogs,
    isLoading,
    error,
  } = useSWR("/catalogs/valid", () =>
    fetchApi("/catalogs/valid", { cache: "no-store" })
  );

  useEffect(() => {
    setFavoriteCatalogs(
      JSON.parse(window?.localStorage?.getItem("favorites") || "[]")
    );
  }, []);

  const [activeTab, setActiveTab] = useState("public");

  return (
    <div className="w-full pt-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary" />
                  Favorite Catalogs
                </SheetTitle>
                <SheetDescription>
                  Your collection of favorite catalogs
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="grid gap-4">
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div>
        {activeTab === "public" ? (
          <Catalogs
            isLoading={isLoading}
            error={error}
            catalogs={validCatalogs}
          />
        ) : (
          <div>Coming soon...</div>
        )}
      </div>
    </div>
  );
}

function Catalogs({ isLoading, error, catalogs }: any) {
  return (
    <>
      {isLoading && <Spinner className="size-8" />}
      {!error && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalogs?.data?.length ? (
            catalogs?.data?.map((pageData: any) => {
              if (pageData?.id) {
                return <CatalogCard key={pageData.id} pageData={pageData} />;
              }
            })
          ) : (
            <div>No catalogs found</div>
          )}
        </div>
      )}
    </>
  );
}
