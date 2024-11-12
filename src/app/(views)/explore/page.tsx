import CatalogTabs from "./catalog-tabs";

export default async function ExplorePage() {
  return (
    <div>
      <h1 className="text-lg md:text-xl">Explore Catalog</h1>
      <CatalogTabs />
    </div>
  );
}
