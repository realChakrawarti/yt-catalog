import Spinner from "~/components/shared/spinner";

export default function ExploreLoading() {
  return (
    <div className="h-full flex flex-col items-center mt-7">
      <Spinner label="" className="size-7" />
    </div>
  );
}
