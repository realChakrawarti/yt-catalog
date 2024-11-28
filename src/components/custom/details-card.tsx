import Link from "next/link";

import ThumbnailCarousel from "./carousel-thumbnails";

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
      <div className="absolute inset-0 aspect-video bg-gradient-to-b from-transparent to-black/90"></div>
      <div className="p-4">
        <h2 className="font-semibold">{pageData?.title}</h2>
        <p className="text-sm text-muted-foreground">{pageData?.description}</p>
      </div>
    </Link>
  );
}
