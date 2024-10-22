import Link from "next/link";
import ThumbnailCarousel from "./carousel-thumbnails";

export default function CatalogCard({ pageData }: any) {
  return (
    <Link key={pageData?.id} href={pageData?.id}>
      <section className="flex px-4 py-2 border-2 border-orange-600 flex-col gap-3 h-[480px]">
        <ThumbnailCarousel thumbnails={pageData.thumbnails} />
        <div className="space-y-1">
          <h1 className="text-base">{pageData?.title}</h1>
          <p className="text-sm text-gray-400">{pageData?.description}</p>
        </div>
      </section>
    </Link>
  );
}
