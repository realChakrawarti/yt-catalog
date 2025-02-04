import Archives from "~/views/explore/archives";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default function ArchivesPage() {
  return <Archives />;
}
