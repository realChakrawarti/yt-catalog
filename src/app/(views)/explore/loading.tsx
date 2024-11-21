import Spinner from "~/components/custom/spinner";

export default function ExploreLoading() {
  return (
    <div className="h-full flex flex-col items-center mt-7">
      <Spinner label="Catalogs are being generated." className="size-7" />
    </div>
  );
}
