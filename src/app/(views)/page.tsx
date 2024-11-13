import Link from "next/link";
import { GrCatalog } from "react-icons/gr";
import FeatureList from "~/components/custom/feature-list";


export default function LoginPage() {
  return (
    <div className="flex flex-col">
      <Link
        className="bg-slate-800 p-3 flex flex-col cursor-pointer"
        href={"/explore"}
        target="_blank"
      >
        <div className="self-center flex-grow grid items-center">
          <GrCatalog className="size-16" />
        </div>
        <p className="text-gray-400">Explore catalogs</p>
      </Link>
      <FeatureList />
    </div>
  );
}
