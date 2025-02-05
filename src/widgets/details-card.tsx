import { EyeIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

import { ValidMetadata } from "~/shared/types-schema/types";

import ThumbnailCarousel from "./carousel-thumbnails";
import JustTip from "./just-the-tip";
import OverlayTip from "./overlay-tip";

interface DetailsCardProps {
  pageData: ValidMetadata;
  path: string;
}

export default function DetailsCard({ pageData, path }: DetailsCardProps) {
  return (
    <Link
      key={pageData?.id}
      href={path}
      className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
    >
      <section className="aspect-video">
        <ThumbnailCarousel thumbnails={pageData.thumbnails} />
      </section>
      {pageData?.pageviews ? <Pageview pageviews={pageData.pageviews} /> : null}
      {pageData?.totalVideos ? (
        <TotalVideos totalVideos={pageData.totalVideos} />
      ) : null}

      <div className="absolute inset-0 aspect-video bg-gradient-to-b from-transparent to-black/90"></div>
      <div className="p-4">
        <h2 className="font-semibold">{pageData?.title}</h2>
        <p className="text-sm text-muted-foreground">{pageData?.description}</p>
      </div>
    </Link>
  );
}

function TotalVideos({ totalVideos }: { totalVideos: number }) {
  return (
    <JustTip label="Total videos">
      <OverlayTip
        id="total-videos"
        className="flex gap-1 absolute top-2 left-2 items-center p-1 rounded-md z-20"
      >
        <p className="text-xs tracking-widest">{totalVideos}</p>
        <VideoIcon className="size-3" />
      </OverlayTip>
    </JustTip>
  );
}

function Pageview({ pageviews }: { pageviews: number }) {
  if (pageviews !== undefined) {
    return (
      <JustTip label="Unique views">
        <OverlayTip
          id="pageviews"
          className="flex gap-1 absolute top-2 right-2 items-center p-1 rounded-md z-20"
        >
          <p className="text-xs tracking-widest">{pageviews}</p>
          <EyeIcon className="size-3" />
        </OverlayTip>
      </JustTip>
    );
  }
  return null;
}
