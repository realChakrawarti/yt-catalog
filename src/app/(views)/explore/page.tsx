import Explore from "~/views/explore";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function ExplorePage() {
  return <Explore />;
}
