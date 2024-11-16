/* eslint-disable @next/next/no-img-element */
import { Clock } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next/types";

import TimeDifference from "~/components/custom/TimeDifference";
import { Button } from "~/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/popover";
import fetchApi from "~/utils/fetch";

import { AddToFavorites } from "./add-to-fav";
import FilterChannel, { CurrentActive } from "./filter-channel";
import {
  filterChannel,
  getActiveChannelIds,
  parseCatalogHandle,
} from "./helper-methods";
import YouTubeCard from "./youtube-card";

type PageProps = {
  params: { catalogHandle: string };
  searchParams?: {
    channelId: string;
  };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const catalogHandle = decodeURIComponent(params.catalogHandle);
  const catalogId = parseCatalogHandle(catalogHandle);

  const result = await fetchApi(`/catalogs/${catalogId}/video`);
  const catalogData = result.data;

  return {
    title: `${catalogData?.title} | YTCatalog`,
    openGraph: {
      type: "website",
      title: catalogData?.title,
      url: `https://ytcatalog.707x.in/${catalogHandle}`,
      description: catalogData?.description,
      siteName: "YTCatalog",
    },
  };
}

export const revalidate = 60 * 5;

export default async function CatalogHandle({
  params,
  searchParams,
}: PageProps) {
  const channelId = searchParams?.channelId;

  const catalogHandle = decodeURIComponent(params.catalogHandle);
  const catalogId = parseCatalogHandle(catalogHandle);

  const result = await fetchApi(`/catalogs/${catalogId}/video`);

  const catalogData = result.data;

  const videos: Record<string, any> = catalogData?.data;
  const nextUpdate = catalogData?.nextUpdate;
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
      <section className="px-0 md:px-3">
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
              <AddToFavorites
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Clock className="h-4 w-4 mr-2" />
                    Next update
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <p>
                    Next update: <TimeDifference date={nextUpdate} />
                  </p>
                </PopoverContent>
              </Popover>
              <FilterChannel activeChannels={activeChannels} />
            </div>
          </div>
        </div>
      </section>

      <CurrentActive activeChannels={activeChannels} />

      {/* Today */}
      {today?.length ? (
        <section className="px-0 md:px-3 space-y-3">
          <h2 className="text-lg">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {today.map((video) => (
              <YouTubeCard key={video.videoId} {...video} />
            ))}
          </div>
        </section>
      ) : (
        <></>
      )}
      {/* This week */}
      {week?.length ? (
        <section className="px-0 md:px-3 space-y-3">
          <h2 className="text-lg">This week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {week.map((video) => (
              <YouTubeCard key={video.videoId} {...video} />
            ))}
          </div>
        </section>
      ) : (
        <></>
      )}
      {/* This month */}
      {month?.length ? (
        <section className="px-0 md:px-3 space-y-3">
          <h2 className="text-lg">This month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {month.map((video) => (
              <YouTubeCard key={video.videoId} {...video} />
            ))}
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
}
