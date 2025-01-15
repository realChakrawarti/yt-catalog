/* eslint-disable @next/next/no-img-element */
import type { LucideIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Metadata } from "next/types";
import { ReactNode } from "react";

import GridContainer from "~/components/shared/grid-container";
import { ClockIcon, MonthIcon, WeekIcon } from "~/components/shared/icons";
import Marker from "~/components/shared/marker";
import ScrollTop from "~/components/shared/scroll-top";
import YouTubeCard from "~/components/shared/youtube/youtube-card";
import fetchApi from "~/utils/fetch";

import { AddToFavorites } from "./add-to-fav";
import FilterChannel, { CurrentActive } from "./filter-channel";
import { filterChannel, getActiveChannelIds } from "./helper-methods";
import NextUpdate from "./next-update";

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
  const channelId = searchParams?.channelId;

  const { catalogId } = params;

  const result = await fetchApi(`/catalogs/${catalogId}/videos`);

  const catalogData = result.data;

  const videos: Record<string, any> = catalogData?.data;
  const catalogTitle = catalogData?.title;
  const catalogDescription = catalogData?.description;

  if (!videos) {
    return (
      <div className="h-full w-full grid place-items-center">
        No data available. Please update the channel list
      </div>
    );
  }

  const [today, week, month] = filterChannel(videos, channelId);

  const activeChannels = getActiveChannelIds(videos);

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {catalogTitle}
              </h1>
              <p className="text-base text-muted-foreground">
                {catalogDescription}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <DynamicShareCatalog
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
              <AddToFavorites
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
              <NextUpdate catalogId={catalogId} />
              <FilterChannel activeChannels={activeChannels} />
            </div>
          </div>
        </div>
      </section>

      <CurrentActive activeChannels={activeChannels} />

      {/* Today */}
      {today?.length ? (
        <VideoSection icon={ClockIcon} label="Today">
          {today.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                enableJsApi: true,
                addWatchLater: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      {/* This week */}
      {week?.length ? (
        <VideoSection icon={WeekIcon} label="This week">
          {week.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                enableJsApi: true,
                addWatchLater: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      {/* This month */}
      {month?.length ? (
        <VideoSection icon={MonthIcon} label="This month">
          {month.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                enableJsApi: true,
                addWatchLater: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      <ScrollTop />
    </div>
  );
}

type VideoSectionProps = {
  label: string;
  children: ReactNode;
  icon: LucideIcon;
};

function VideoSection({ label, children, icon: Icon }: VideoSectionProps) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="h-6 px-2 md:px-0 flex items-center gap-2 text-primary">
        <Marker />
        <h2 id={id} className="text-lg">
          <a href={`#${id}`}>{label}</a>
        </h2>
        <Icon />
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
