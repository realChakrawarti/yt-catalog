"use client";

import { Sheet, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import Spinner from "~/components/custom/Spinner";
import { Button } from "~/components/shadcn/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shadcn/sheet";
import { Tabs, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import fetchApi from "~/utils/fetch";

import CatalogCard from "./catalog-card";

// TODO: Make use of usehooks-ts "useLocalStorage" maybe?
export default function CatalogExplore() {
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
    // <Tabs>
    //   <TabList>
    //     <Tab id="public">Public</Tab>
    //     <Tab id="favorite">Favorites</Tab>
    //   </TabList>
    //   <TabPanel className="p-0" id="public">
    //     {isLoading && <Spinner className="size-8" />}
    //     {!error && !isLoading && (
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    //         {validCatalogs?.data?.length ? (
    //           validCatalogs?.data?.map((pageData: any) => {
    //             if (pageData?.id) {
    //               return <CatalogCard key={pageData.id} pageData={pageData} />;
    //             }
    //           })
    //         ) : (
    //           <div>No catalogs found</div>
    //         )}
    //       </div>
    //     )}
    //   </TabPanel>
    //   <TabPanel id="favorite">
    //     <div>
    //       <h1 className="text-lg">Favorite Catalogs</h1>
    //       {favoriteCatalogs.map((favCatalog: any) => {
    //         return (
    //           <Link href={`/@${favCatalog.id}`} key={favCatalog.id}>
    //             <section className="flex px-4 py-2 border-2 border-orange-600 flex-col gap-3">
    //               <div className="space-y-1">
    //                 <h1 className="text-base">{favCatalog.title}</h1>
    //                 <p className="text-sm text-gray-400">
    //                   {favCatalog.description}
    //                 </p>
    //               </div>
    //             </section>
    //           </Link>
    //         );
    //       })}
    //     </div>
    //   </TabPanel>
    // </Tabs>

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
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                    >
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        {/* <Image
                        src="/placeholder.svg"
                        alt="Catalog thumbnail"
                        className="object-cover"
                        fill
                      /> */}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          Favorite Catalog {item}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Description for favorite catalog {item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* <Image
              src="/placeholder.svg"
              alt={`Catalog ${item}`}
              className="object-cover transition-transform group-hover:scale-105"
              fill
            /> */}
            </div>
            <div className="p-4">
              <h2 className="font-semibold">Title - Catalog {item}</h2>
              <p className="text-sm text-muted-foreground">
                Description - Catalog {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
