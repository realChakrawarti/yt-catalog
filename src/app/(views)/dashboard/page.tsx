"use client";

import withAuth from "~/app/auth/with-auth-hoc";
import { Separator } from "~/components/shadcn/separator";

import ArchiveView from "./(archive)/main";
import CatalogView from "./(catalogs)/main";

function DashboardPage() {
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

export default withAuth(DashboardPage);
