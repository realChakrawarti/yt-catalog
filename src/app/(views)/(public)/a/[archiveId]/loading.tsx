import Spinner from "~/components/custom/spinner";

export default function CatalogPublicLoading() {
  return (
    <div className="h-full flex flex-col items-center mt-7">
      <Spinner label="Archive videos are loading." className="size-7" />
    </div>
  );
}
