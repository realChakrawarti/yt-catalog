import { EyeIcon } from "lucide-react";
import Link from "next/link";

import ThumbnailCarousel from "./carousel-thumbnails";
import JustTip from "./just-the-tip";

export default function DetailsCard({ pageData, path }: any) {
  return (
    <Link
      key={pageData?.id}
      href={path}
      className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
    >
      <section className="aspect-video">
        <ThumbnailCarousel thumbnails={pageData.thumbnails} />
      </section>
      <JustTip label="Unique views">
        <div
          id="pageviews"
          className="flex gap-1 absolute top-2 right-2 items-center p-1 bg-accent/70 rounded-md z-20"
        >
          <p className="text-xs">{pageData.pageviews}</p>
          <EyeIcon className="size-3" />
        </div>
      </JustTip>
      <div className="absolute inset-0 aspect-video bg-gradient-to-b from-transparent to-black/90"></div>
      <div className="p-4">
        <h2 className="font-semibold">{pageData?.title}</h2>
        <p className="text-sm text-muted-foreground">{pageData?.description}</p>
      </div>
    </Link>
  );
}
