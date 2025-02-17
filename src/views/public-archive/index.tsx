import fetchApi from "~/shared/lib/api/fetch";
import GridContainer from "~/widgets/grid-container";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default async function PublicArchive({
  archiveId,
}: {
  archiveId: string;
}) {
  const result = await fetchApi(`/archives/${archiveId}`);
  const archiveData = result.data;

  const archiveTitle = archiveData.title;
  const archiveDescription = archiveData.description;

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {archiveTitle}
          </h1>
          <p className="text-base text-muted-foreground">
            {archiveDescription}
          </p>
        </div>
      </section>

      {archiveData.videos.length ? (
        <section className="px-0 md:px-3">
          <GridContainer>
            {archiveData.videos.map((item: any) => {
              return (
                <YouTubeCard
                  key={item.id}
                  video={item}
                  options={{ hideAvatar: true }}
                />
              );
            })}
          </GridContainer>
        </section>
      ) : (
        <p>No videos added yet.</p>
      )}
    </div>
  );
}
