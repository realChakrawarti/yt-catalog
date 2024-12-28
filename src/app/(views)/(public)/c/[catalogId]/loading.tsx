import GridContainer from "~/components/custom/grid-container";
import { Skeleton } from "~/components/shadcn/skeleton";

export default function CatalogPublicLoading() {
  return (
    <div className="h-full flex flex-col mt-7 gap-10 px-10">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <GridContainer>
        {(() => {
          const items = [];
          for (let i = 0; i < 12; i++) {
            items.push(<YouTubeSkeletonCard key={i} />);
          }
          return items;
        })()}
      </GridContainer>
    </div>
  );
}

function YouTubeSkeletonCard(){
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}