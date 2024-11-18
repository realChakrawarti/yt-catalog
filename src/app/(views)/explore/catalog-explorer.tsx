"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import JustTip from "~/components/custom/just-the-tip";
import Spinner from "~/components/custom/spinner";
import { Button } from "~/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { Tabs, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import fetchApi from "~/utils/fetch";

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

  const [activeTab, setActiveTab] = useState<string>("catalog");

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
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="curate">Curate</TabsTrigger>
            </TabsList>
          </Tabs>
          <Sheet>
            <JustTip label="Favorite Catalogs">
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Star className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </JustTip>
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
                  <div className="grid gap-4"></div>
                  {favoriteCatalogs.map((favCatalog: any) => {
                    return (
                      <Link
                        className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                        href={`/@${favCatalog.id}`}
                        key={favCatalog.id}
                      >
                        <section>
                          <h3 className="font-semibold">{favCatalog.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {favCatalog.description}
                          </p>
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
        {activeTab === "catalog" ? (
          <>
            {isLoading && <Spinner className="size-8" />}
            {!error && !isLoading && (
              <Catalogs
                isLoading={isLoading}
                error={error}
                catalogs={validCatalogs}
              />
            )}
          </>
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
