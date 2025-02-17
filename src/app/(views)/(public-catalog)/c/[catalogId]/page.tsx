/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next/types";

import fetchApi from "~/shared/lib/api/fetch";
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
      description: catalogData?.description,
      siteName: "YTCatalog",
      title: catalogData?.title,
      type: "website",
      url: `https://ytcatalog.707x.in/${catalogId}`,
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
