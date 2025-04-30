import fetchApi from "~/shared/lib/api/fetch";
import DetailsCard from "~/widgets/details-card";
import GridContainer from "~/widgets/grid-container";
import MobileFooter from "~/widgets/mobile-footer";

export default async function Archives() {
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
      <MobileFooter />
    </div>
  );
}
