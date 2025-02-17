import { Metadata } from "next/types";

import fetchApi from "~/shared/lib/api/fetch";
import PublicArchive from "~/views/public-archive";

type PublicArchiveParams = {
  params: { archiveId: string };
};

export async function generateMetadata({
  params,
}: PublicArchiveParams): Promise<Metadata> {
  const { archiveId } = params;

  const result = await fetchApi(`/archives/${archiveId}`);
  const archiveData = result.data;

  return {
    title: `${archiveData?.title} | YTCatalog`,
    openGraph: {
      description: archiveData?.description,
      siteName: "YTCatalog",
      title: archiveData?.title,
      type: "website",
      url: `https://ytcatalog.707x.in/a/${archiveId}`,
    },
  };
}

export default function PublicArchivePage({
  params: { archiveId },
}: PublicArchiveParams) {
  return <PublicArchive archiveId={archiveId} />;
}
