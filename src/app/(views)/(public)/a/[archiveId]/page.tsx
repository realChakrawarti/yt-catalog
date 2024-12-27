import { Metadata } from "next/types";

import fetchApi from "~/utils/fetch";
import VideoPage from "./RenderPage";

type PageProps = {
  params: { archiveId: string };
};

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { archiveId } = params;

  const result = await fetchApi(`/archives/${archiveId}`);
  const archiveData = result.data;

  return {
    title: `${archiveData?.title} | YTCatalog`,
    openGraph: {
      type: "website",
      title: archiveData?.title,
      url: `https://ytcatalog.707x.in/a/${archiveId}`,
      description: archiveData?.description,
      siteName: "YTCatalog",
    },
  };
}

export default async function ArchivePage({ params }: PageProps) {
  return(
    <div>
      <VideoPage params={params}/>
    </div>
  )
}
