import { YoutubePlayer } from "./component";
import { MdOutlineUpdate } from "react-icons/md";
import { timeDifference } from "@/app/lib/client-helper";
import TimeDifference from "@/app/components/TimeDifference";
import fetchApi from "@/app/lib/fetch";
import { Metadata, ResolvingMetadata } from "next/types";

function parseCatalogHandle(str: string) {
  return str.substring(1);
}

type PageProps = {
  params: { catalogHandle: string };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const catalogHandle = decodeURIComponent(params.catalogHandle);
  const catalogId = parseCatalogHandle(catalogHandle);

  const result = await fetchApi(`/explore?catalogId=${catalogId}`);
  const catalogData = result.data;

  return {
    title: `${catalogData.title} | YTCatalog`,
    openGraph: {
      type: "website",
      title: catalogData.title,
      url: `https://ytcatalog.707x.in/${catalogHandle}`,
      description: catalogData.description,
      siteName: "YTCatalog",
    },
  };
}

// export const revalidate = 43_200;
export const revalidate = 60 * 5;

export default async function CatalogHandle({ params }: PageProps) {
  const catalogHandle = decodeURIComponent(params.catalogHandle);
  const catalogId = parseCatalogHandle(catalogHandle);

  const result = await fetchApi(`/explore?catalogId=${catalogId}`);

  const catalogData = result.data

  const videos: Record<string, any> = catalogData.data;
  const nextUpdate = catalogData?.nextUpdate;
  const catalogTitle = catalogData.title;
  const catalogDescription = catalogData.description;

  if (!videos) {
    return (
      <div className="h-full w-full grid place-items-center">
        No data available. Please update the channel list
      </div>
    );
  }

  const today: any[] = videos?.day;
  const week: any[] = videos?.week;
  const month: any[] = videos?.month;

  const VideoCard = (props: any) => {
    const {
      videoId,
      title,
      channelTitle,
      publishedAt,
      channelId,
      channelLogo,
    } = props;
    const timeElapsed = timeDifference(publishedAt);

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
              {/* <AddToFavorites /> */}
            </div>
          </div>
        </div>
      </header>

      {/* Today */}
      {today.length ? (
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
      {week.length ? (
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
      {month.length ? (
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
