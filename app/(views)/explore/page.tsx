import fetchApi from "@/app/lib/fetch";
import CatalogCard from "./catalog-card";

export const revalidate = 60 * 5; // 5 minutes

export default async function ExplorePage() {
  const result = await fetchApi("/explore", {
    cache: "no-store",
  });

  const pagesData = result?.data ?? [];

  return (
    <div>
      <h1 className="text-lg md:text-xl">Explore</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {pagesData?.length ? (
          pagesData?.map((pageData: any) => {
            if (pageData?.id) {
              return <CatalogCard key={pageData.id} pageData={pageData} />;
            }
          })
        ) : (
          <div>No catalogs found</div>
        )}
      </div>
    </div>
  );
}
