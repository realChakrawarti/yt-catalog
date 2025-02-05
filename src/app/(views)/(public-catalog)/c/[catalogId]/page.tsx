/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next/types";

import fetchApi from "~/utils/fetch";
import PubliCatalog from "~/views/public-catalog";

type PublicCatalogParams = {
  params: { catalogId: string };
  searchParams?: {
    channelId: string;
  };
};

export async function generateMetadata({
  params,
}: PublicCatalogParams): Promise<Metadata> {
  const { catalogId } = params;

  const result = await fetchApi(`/catalogs/${catalogId}/videos`);
  const catalogData = result.data;

  return {
    title: `${catalogData?.title} | YTCatalog`,
    openGraph: {
      type: "website",
      title: catalogData?.title,
      url: `https://ytcatalog.707x.in/${catalogId}`,
      description: catalogData?.description,
      siteName: "YTCatalog",
    },
  };
}

export const revalidate = 60 * 10; // Cache the page for 10 minutes, unless revalidated on updates

export default async function PublicCatalogPage({
  params,
  searchParams,
}: PublicCatalogParams) {
  const channelId = searchParams?.channelId;

  const { catalogId } = params;

  return <PubliCatalog catalogId={catalogId} channelId={channelId ?? ""} />;
}
