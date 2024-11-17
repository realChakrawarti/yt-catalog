import { CatalogExplorer } from "./catalog-explorer";

export default async function ExplorePage() {
  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
      <CatalogExplorer />
    </div>
  );
}
