"use client";

import { Button } from "@/app/components/Button";
import fetchApi from "@/lib/fetch";
import withAuth from "@/app/context/withAuth";
import Link from "next/link";
import ChannelTable from "./channel-table";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/Toast";
import {
  BreadcrumbLayer,
  type BreadcrumbLayerProps,
} from "@/app/components/Breadcrumbs";
import useSWR from "swr";
import Spinner from "@/app/components/Spinner";

type CatalogPageParams = {
  catalogId: string;
};

function CatalogPage({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  const router = useRouter();
  const {
    data: catalogData,
    isLoading,
    error,
  } = useSWR(catalogId ? `/catalogs/${catalogId}` : null, (url) =>
    fetchApi<any>(url)
  );

  const updateCatalogVideoData = async () => {
    const result = await fetchApi(`/catalogs/${catalogId}/update`);
    toast(result.message);
  };

  const bcLayers: BreadcrumbLayerProps[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: `Catalogs/${catalogId}`,
      disabled: true,
    },
  ];

  if (isLoading) return <Spinner className="size-8" />;
  if (error) return <p>Something went wrong!</p>;
  return (
    <div>
      <BreadcrumbLayer layers={bcLayers} />
      <div className="flex justify-between items-center">
        <section className="space-y-1">
          <div className="text-lg">{catalogData?.data?.title}</div>
          <div className="text-base text-gray-500">
            {catalogData?.data?.description}
          </div>
        </section>
        <div className="flex gap-2 items-center">
          {catalogData?.data?.channelList.length ? (
            <Link href={`/@${catalogId}`} target="_blank">
              Visit Catalog
            </Link>
          ) : null}
          {catalogData?.data?.channelList.length ? (
            <Button onPress={updateCatalogVideoData}>Update Catalog</Button>
          ) : null}
          {/* <Button onPress={() => router.push(`${catalogId}/edit`)}>Edit</Button> */}
        </div>
      </div>
      {/* <div className="pt-5">
        {catalogData?.data?.channelList.length ? (
          <ChannelTable channels={catalogData?.data?.channelList} />
        ) : (
          <p>No channels added yet</p>
        )}
      </div> */}
    </div>
  );
}

export default withAuth(CatalogPage);
