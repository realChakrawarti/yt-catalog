import { Skeleton } from "~/components/shadcn/skeleton";
import GridContainer from "~/components/shared/grid-container";
export default function CatalogLoadingSkeleton() {
  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
            <div className="space-y-1">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 sm:w-96 w-64" />
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
              <Skeleton className="size-9" />
            </div>
          </div>
        </div>
      </section>
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
    </div>
  );
}
function VideoSection({ children }: any) {
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="px-2 md:px-0 flex items-center gap-2">
        <Skeleton className="size-6" />
        <Skeleton className="h-6 w-32" />
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
function YouTubeSkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg">
        <Skeleton className="relative aspect-video overflow-hidden" />
        <div className="p-3">
          <div className="flex gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-[60%] pr-6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}