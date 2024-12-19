import { Metadata, ResolvingMetadata } from "next/types";

import GridContainer from "~/components/custom/grid-container";
import YouTubeCard from "~/components/custom/youtube-card";
import fetchApi from "~/utils/fetch";

type PageProps = {
  params: { archiveId: string };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
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
  const { archiveId } = params;

  const result = await fetchApi(`/archives/${archiveId}`);
  const archiveData = result.data;

  const archiveTitle = archiveData.title;
  const archiveDescription = archiveData.description;

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {archiveTitle}
          </h1>
          <p className="text-base text-muted-foreground">
            {archiveDescription}
          </p>
        </div>
      </section>

      {archiveData.videos.length ? (
        <section className="px-0 md:px-3">
          <GridContainer>
            {archiveData.videos.map((item: any) => {
              return <YouTubeCard key={item.id} {...item} />;
            })}
          </GridContainer>
        </section>
      ) : (
        <p>No videos added yet.</p>
      )}
    </div>
  );
}
