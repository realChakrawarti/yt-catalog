import clsx from "clsx";

type Properties = {
  className?: string;
  label?: string;
};

export default function Spinner(properties: Properties) {
  return (
    <div className={"flex flex-col items-center mb-0.5 space-y-3"}>
      {properties.label ? <p>{properties.label}</p> : null}
      <div className={properties?.className}>
        <div
          className={
            "animate-spin rounded-full w-full h-full border-2 border-current border-t-transparent"
          }
          role="status"
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
