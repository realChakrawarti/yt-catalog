/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import { Metadata } from "next/types";

import fetchApi from "~/utils/fetch";

import VideoPage from "./RenderPage";

// Refer: https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
const DynamicShareCatalog = dynamic(() => import("./share-catalog"), {
  ssr: false,
});

type PageProps = {
  params: { catalogId: string };
  searchParams?: {
    channelId: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function CatalogHandle({
  params,
  searchParams,
}: PageProps) {
  return (
    <div>
      <VideoPage params={params} searchParams={searchParams}/>
    </div>
  );
};
