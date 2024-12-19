import DetailsCard from "~/components/custom/details-card";
import GridContainer from "~/components/custom/grid-container";
import fetchApi from "~/utils/fetch";

import FavoriteCatalog from "./favorite-catalogs";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function CatalogsPage() {
  const catalogs = await fetchApi("/catalogs/valid");
  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight flex gap-2 items-start">
        <p>Catalogs</p>
        <FavoriteCatalog />
      </h1>
      <div className="w-full pt-7">
        <GridContainer>
          {catalogs?.data?.length ? (
            catalogs?.data?.map((pageData: any) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/c/${pageData.id}`}
                    key={pageData.id}
                    pageData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No catalogs found.</div>
          )}
        </GridContainer>
      </div>
    </div>
  );
}
