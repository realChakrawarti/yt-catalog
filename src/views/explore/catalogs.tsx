import fetchApi from "~/utils/fetch";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";

import FavoriteCatalog from "./favorite-catalogs";

export default async function Catalogs() {
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
