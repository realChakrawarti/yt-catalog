import { CatalogExplorer } from "./catalog-explorer";

export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function ExplorePage() {
  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
      <CatalogExplorer />
    </div>
  );
}
