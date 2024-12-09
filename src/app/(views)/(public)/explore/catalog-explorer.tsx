"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DetailsCard from "~/components/custom/details-card";
import { HeartListIcon, StarIcon } from "~/components/custom/icons";
import JustTip from "~/components/custom/just-the-tip";
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

// TODO: A compact list for catalogs w/ toggle button
export function CatalogExplorer({ validCatalogs, validArchives }: any) {
  const [favoriteCatalogs, setFavoriteCatalogs] = useState([]);

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
              <TabsTrigger value="catalog">Catalogs</TabsTrigger>
              <TabsTrigger value="archive">Archives</TabsTrigger>
            </TabsList>
          </Tabs>
          <Sheet>
            <JustTip label="Favorite Catalogs">
              <SheetTrigger asChild>
                <Button>
                  <HeartListIcon size={32} />
                </Button>
              </SheetTrigger>
            </JustTip>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5" />
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
                        href={`/c/${favCatalog.id}`}
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
            <Catalogs catalogs={validCatalogs} />
          </>
        ) : (
          <Archives archives={validArchives} />
        )}
      </div>
    </div>
  );
}

function Archives({ archives }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {archives?.data?.length ? (
        archives?.data?.map((pageData: any) => {
          if (pageData?.id) {
            return (
              <DetailsCard
                path={`a/${pageData.id}`}
                key={pageData.id}
                pageData={pageData}
              />
            );
          }
        })
      ) : (
        <div>No archives found.</div>
      )}
    </div>
  );
}

function Catalogs({ catalogs }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {catalogs?.data?.length ? (
        catalogs?.data?.map((pageData: any) => {
          if (pageData?.id) {
            return (
              <DetailsCard
                path={`c/${pageData.id}`}
                key={pageData.id}
                pageData={pageData}
              />
            );
          }
        })
      ) : (
        <div>No catalogs found.</div>
      )}
    </div>
  );
}
