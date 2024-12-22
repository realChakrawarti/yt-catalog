import DetailsCard from "~/components/custom/details-card";
import GridContainer from "~/components/custom/grid-container";
import fetchApi from "~/utils/fetch";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function ArchivesPage() {
  const archives = await fetchApi("/archives/valid");

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">Archives</h1>
      <div className="w-full pt-7">
        <GridContainer>
          {archives?.data?.length ? (
            archives?.data?.map((pageData: any) => {
              if (pageData?.id) {
                return (
                  <DetailsCard
                    path={`/a/${pageData.id}`}
                    key={pageData.id}
                    pageData={pageData}
                  />
                );
              }
            })
          ) : (
            <div>No archives found.</div>
          )}
        </GridContainer>
      </div>
    </div>
  );
}
