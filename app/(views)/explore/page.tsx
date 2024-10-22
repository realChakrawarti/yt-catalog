import fetchApi from "@/lib/fetch";
import CatalogCard from "./catalog-card";

export default async function ExplorePage() {
  const result = await fetchApi("/catalogs/valid", {
    next: { revalidate: 300 },
  });

  const catalogsData = result?.data ?? [];

  return (
    <div className="py-10">
      <h1 className="text-lg md:text-xl">Explore Catalogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
        {catalogsData?.length ? (
          catalogsData?.map((pageData: any) => {
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
