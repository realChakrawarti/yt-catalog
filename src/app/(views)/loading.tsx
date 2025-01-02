import Spinner from "~/components/shared/spinner";

export default function RootLoading() {
  return (
    <div className="h-full flex flex-col items-center mt-7">
      <Spinner className="size-7" />
    </div>
  );
}
