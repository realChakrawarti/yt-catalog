"use client";

import { Separator } from "~/shared/ui/separator";

import ArchiveView from "./archive-view";
import CatalogView from "./catalog-view";

export default function Dashboard() {
  return (
    <div className="p-3 flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <Separator className="my-3" />
      <CatalogView />
      <Separator className="my-3" />
      <ArchiveView />
    </div>
  );
}
