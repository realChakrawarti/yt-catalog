import DetailsCard from "~/components/shared/details-card";
import GridContainer from "~/components/shared/grid-container";
import fetchApi from "~/utils/fetch";

import LastWatched from "./last-watched";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function ExplorePage() {
  const catalogs = await fetchApi("/catalogs/valid");
  const archives = await fetchApi("/archives/valid");

  const catalogsData = catalogs?.data;
  const archivesData = archives?.data;

  const ENABLE_FEATURED = true;

  return (
    <div className="p-3 space-y-7">
      {/* Last watched */}
      <LastWatched />
      {/* Featured Catalogs */}
      {catalogsData.length && ENABLE_FEATURED ? (
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">
            Featured catalogs
          </h1>
          <div className="w-full pt-7">
            <GridContainer>
              {catalogsData.slice(0, 4).map((catalog: any) => (
                <DetailsCard
                  path={`/c/${catalog.id}`}
                  key={catalog.id}
                  pageData={catalog}
                />
              ))}
            </GridContainer>
          </div>
        </section>
      ) : null}

      {/* Featured Archives */}
      {archivesData.length && ENABLE_FEATURED ? (
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">
            Featured archives
          </h1>
          <div className="w-full pt-7">
            <GridContainer>
              {archivesData.slice(0, 4).map((archive: any) => (
                <DetailsCard
                  path={`/a/${archive.id}`}
                  key={archive.id}
                  pageData={archive}
                />
              ))}
            </GridContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
