import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import DetailsCard from "~/components/shared/details-card";
import GridContainer from "~/components/shared/grid-container";
import Marker from "~/components/shared/marker";
import type { ValidMetadata } from "~/types-schema/types";
import fetchApi from "~/utils/fetch";

import LastWatched from "./last-watched";

export const dynamic = "force-dynamic";
export const revalidate = 60 * 5; // Cache the page for 5 minutes, unless revalidated on updates

export default async function ExplorePage() {
  const catalogs = await fetchApi<ValidMetadata[]>("/catalogs/valid");
  const archives = await fetchApi<Omit<ValidMetadata, "pageviews">[]>(
    "/archives/valid"
  );

  const catalogsData = catalogs?.data;
  const archivesData = archives?.data;

  const ENABLE_FEATURED = true;

  return (
    <div className="p-3 space-y-7">
      {/* Last watched */}
      <LastWatched />
      {/* Featured Catalogs */}
      {catalogsData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured catalogs" link="/explore/catalogs" />
          <div className="w-full pt-7">
            <GridContainer>
              {catalogsData.slice(0, 4).map((catalog) => (
                <DetailsCard
                  path={`/c/${catalog.id}`}
                  key={catalog.id}
                  pageData={catalog}
                />
              ))}
            </GridContainer>
          </div>
        </section>
      ) : null}

      {/* Featured Archives */}
      {archivesData?.length && ENABLE_FEATURED ? (
        <section>
          <Title label="Featured archives" link="/explore/archives" />
          <div className="w-full pt-7">
            <GridContainer>
              {archivesData.slice(0, 4).map((archive) => (
                <DetailsCard
                  path={`/a/${archive.id}`}
                  key={archive.id}
                  pageData={archive}
                />
              ))}
            </GridContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Title({ label, link }: { label: string; link?: string }) {
  return (
    <h1
      className="h-7 text-2xl font-semibold tracking-tight text-primary flex items-center gap-2"
      aria-label={label}
    >
      <Marker />
      <div className="flex items-end gap-2">
        <p>{label}</p>
        {link ? (
          <Link className="cursor-pointer" href={link}>
            <ChevronRightIcon className="size-7 text-primary stroke-[3]" />
          </Link>
        ) : null}
      </div>
    </h1>
  );
}
