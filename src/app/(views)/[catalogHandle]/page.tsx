import { YoutubePlayer } from "./component";
import { MdOutlineUpdate } from "react-icons/md";
import { getTimeDifference } from "~/utils/client-helper";
import TimeDifference from "~/components/custom/TimeDifference";
import fetchApi from "~/utils/fetch";
import { Metadata, ResolvingMetadata } from "next/types";
import { AddToFavorites } from "./add-to-fav";
import FilterChannel from "./filter-channel";
import {
  filterChannel,
  getActiveChannelIds,
  parseCatalogHandle,
} from "./helper-methods";

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

// export const revalidate = 43_200;
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

  const VideoCard = (props: any) => {
    const {
      videoId,
      title,
      channelTitle,
      publishedAt,
      channelId,
      channelLogo,
    } = props;
    const [_, timeElapsed] = getTimeDifference(publishedAt, true);

    return (
      <div className="flex flex-col gap-3">
        <div className="w-full h-full space-y-1">
          <YoutubePlayer videoId={videoId} title={title} />
          <div className="flex gap-2 items-start py-2">
            <img src={channelLogo} className="size-8" alt={channelTitle} />
            <span className="flex flex-col gap-1">
              <p className="text-sm md:text-base text-gray-50">{title}</p>
              <p className="text-xs md:text-sm text-gray-300 flex gap-2 items-center">
                <a
                  className="hover:underline"
                  href={`https://youtube.com/channel/${channelId}`}
                  target="_blank"
                >
                  {channelTitle}
                </a>
                <b>•</b>
                <span>{timeElapsed}</span>
              </p>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6">
      <header className="px-2 md:px-0">
        <div className="space-y-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
            <div className="space-y-1">
              <h1 className="text-2xl text-gray-50">{catalogTitle}</h1>
              <p className="text-base text-gray-300 hidden lg:block">
                {catalogDescription}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-base text-gray-300 flex gap-2 items-center self-start">
                <MdOutlineUpdate />
                Next update: <TimeDifference date={nextUpdate} />
              </p>
              <AddToFavorites
                catalogId={catalogId}
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
              />
            </div>
          </div>
        </div>

        <FilterChannel activeChannels={activeChannels} />
      </header>

      {/* Today */}
      {today?.length ? (
        <>
          <h2 className="text-2xl px-2 md:px-0">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {today.map((video) => (
              <VideoCard key={video.videoId} {...video} />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {/* This week */}
      {week?.length ? (
        <>
          <h2 className="text-2xl px-2 md:px-0">This week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {week.map((video) => (
              <VideoCard key={video.videoId} {...video} />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {/* This month */}
      {month?.length ? (
        <>
          <h2 className="text-2xl px-2 md:px-0">This month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {month.map((video) => (
              <VideoCard key={video.videoId} {...video} />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
