"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import fetchApi from "@/app/lib/fetch";
import withAuth from "@/app/context/withAuth";
import Link from "next/link";
import ChannelTable from "./channel-table";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/Toast";
import {
  BreadcrumbLayer,
  type BreadcrumbLayerProps,
} from "@/app/components/Breadcrumbs";

type CatalogPageParams = {
  catalogId: string;
};

function CatalogPage({ params }: { params: CatalogPageParams }) {
  const { catalogId } = params;

  const [catalogMeta, setCatalogMeta] = useState<{
    title: string;
    description: string;
  }>();

  const router = useRouter();

  // TODO: Show list of videos in a tabular format?
  const [catalogVideoData, setCatalogVideoData] = useState<any>();

  // TODO: Show list of channels
  const [catalogChannels, setCatalogChannels] = useState<any>();

  const updateCatalogVideoData = async () => {
    const result = await fetchApi(`/catalogs/${catalogId}/update`);
    toast(result.message);
  };

  const getChannels = async (currentPage: string) => {
    const result = await fetchApi(`/catalogs/${currentPage}`);
    const catalogData = result?.data;
    const channelList = catalogData?.channelList;
    if (channelList?.length) {
      setCatalogChannels(channelList);
    }

    setCatalogMeta({
      title: catalogData?.title,
      description: catalogData?.description,
    });
  };

  useEffect(() => {
    if (catalogId) {
      getChannels(catalogId);
    }
  }, [catalogId]);

  const bcLayers: BreadcrumbLayerProps[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: `Catalog/${catalogId}`,
      disabled: true,
    },
  ];

  return (
    <div className="py-10">
      <BreadcrumbLayer layers={bcLayers} />
      <div className="flex justify-between items-center">
        <section className="space-y-1">
          <div className="text-lg">{catalogMeta?.title}</div>
          <div className="text-base text-gray-500">
            {catalogMeta?.description}
          </div>
        </section>
        <div className="flex gap-2 items-center">
          {catalogChannels?.length ? (
            <Link href={`/@${catalogId}`} target="_blank">
              Visit Catalog
            </Link>
          ) : null}
          {catalogChannels?.length ? (
            <Button onPress={updateCatalogVideoData}>Update Catalog</Button>
          ) : null}
          <Button onPress={() => router.push(`${catalogId}/edit`)}>Edit</Button>
        </div>
      </div>
      <div className="pt-5">
        {catalogChannels?.length ? (
          <ChannelTable channels={catalogChannels} />
        ) : (
          <p>No channels added yet</p>
        )}
      </div>
      <div className="pt-5">{JSON.stringify(catalogVideoData, null, 2)}</div>
    </div>
  );
}

export default withAuth(CatalogPage);
