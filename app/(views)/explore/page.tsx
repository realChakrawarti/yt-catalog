import CatalogTabs from "./catalog-tabs";

export default async function ExplorePage() {
  return (
    <div className="py-10">
      <h1 className="text-lg md:text-xl">Explore Catalogs</h1>
      <CatalogTabs />
    </div>
  );
}
