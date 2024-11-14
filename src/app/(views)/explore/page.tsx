import CatalogTabs from "./catalog-tabs";

export default async function ExplorePage() {
  return (
    <div className="p-3">
      <h1 className="text-lg md:text-xl">Explore Catalog</h1>
      <CatalogTabs />
    </div>
  );
}
