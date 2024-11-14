import Link from "next/link";

import ThumbnailCarousel from "./carousel-thumbnails";

export default function CatalogCard({ pageData }: any) {
  return (
    <Link
      className="relative"
      key={pageData?.id}
      href={pageData?.id}
    >
      <section className="aspect-video">
        <ThumbnailCarousel thumbnails={pageData.thumbnails} />
      </section>
      <div className="absolute inset-0 aspect-video bg-gradient-to-b from-transparent to-black/90"></div>
      <div className="absolute bottom-3 left-3">
        <h1 className="text-base text-white">{pageData?.title}</h1>
        <p className="text-sm text-gray-500">{pageData?.description}</p>
      </div>
    </Link>
  );
}
