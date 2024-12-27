"use client";
import React, { ReactNode, useEffect, useState } from "react";
import fetchApi from "~/utils/fetch";
import { filterChannel, getActiveChannelIds } from "./helper-methods";
import { ClockIcon, LucideIcon } from "lucide-react";
import GridContainer from "~/components/custom/grid-container";
import ScrollTop from "~/components/custom/scroll-top";
import { MonthIcon, WeekIcon } from "~/components/custom/icons";
import YouTubeCard from "~/components/custom/youtube-card";
import FilterChannel, { CurrentActive } from "./filter-channel";
import NextUpdate from "./next-update";
import { AddToFavorites } from "./add-to-fav";
import dynamic from "next/dynamic";
import { Skeleton } from "~/components/shadcn/skeleton";

const DynamicShareCatalog = dynamic(() => import("./share-catalog"), {
  ssr: false,
});

type PageProps = {
  params: { catalogId: string };
  searchParams?: {
    channelId: string;
  };
};

const RenderPage = ({ params, searchParams }: PageProps) => {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [videos, setVideos] = useState<Record<string, any>>({});
  const [catalogTitle, setCatalogTitle] = useState<string>();
  const [catalogDescription, setCatalogDescription] = useState<string>();
  useEffect(() => {
    const fetching = async () => {
      const { catalogId } = params;
      const result = await fetchApi(`/catalogs/${catalogId}/videos`);
      const catalogData = result.data;
      setVideos(catalogData?.data);
      setCatalogTitle(catalogData?.title);
      setCatalogDescription(catalogData?.description);
      setIsloading(false);
    };
    fetching();
  }, []);
  const channelId = searchParams?.channelId;
  const { catalogId } = params;

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
              {isLoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ) : (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {catalogTitle}
                </h1>
              )}
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
      {isLoading ? (
        <div className="flex flex-wrap gap-10 w-full py-5 justify-center">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : today?.length ? (
        <VideoSection icon={ClockIcon} label="Today">
          {today.map((video) => (
            <YouTubeCard
              addWatchLater
              hideAvatar={Boolean(channelId)}
              key={video.videoId}
              {...video}
            />
          ))}
        </VideoSection>
      ) : null}

      {/* This week */}
      {isLoading ? (
        <div className="flex flex-wrap gap-10 w-full py-5 justify-center">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : week?.length ? (
        <VideoSection icon={WeekIcon} label="This week">
          {week.map((video) => (
            <YouTubeCard
              addWatchLater
              hideAvatar={Boolean(channelId)}
              key={video.videoId}
              {...video}
            />
          ))}
        </VideoSection>
      ) : null}
      {/* This month */}
      {isLoading ? (
        <div className="flex flex-wrap gap-10 w-full py-5 justify-center">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : month?.length ? (
        <VideoSection icon={MonthIcon} label="This month">
          {month.map((video) => (
            <YouTubeCard
              addWatchLater
              hideAvatar={Boolean(channelId)}
              key={video.videoId}
              {...video}
            />
          ))}
        </VideoSection>
      ) : null}
      <ScrollTop />
    </div>
  );
};

type VideoSectionProps = {
  label: string;
  children: ReactNode;
  icon: LucideIcon;
};

function VideoSection({ label, children, icon: Icon }: VideoSectionProps) {
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="px-2 md:px-0 flex items-center gap-2">
        <Icon />
        <h2 className="text-lg">{label}</h2>
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}

export default RenderPage;
