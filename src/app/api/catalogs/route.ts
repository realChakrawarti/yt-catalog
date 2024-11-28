import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { createCatalog, getCatalogByUser } from "./models";

export async function GET() {
  const userId = getUserIdCookie();
  const data = await getCatalogByUser(userId);
  return NxResponse.success("Catalogs data fetched successfully.", data, 200);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdCookie();

  const catalogMeta = await request.json();

  const catalogId = await createCatalog(userId, catalogMeta);

  return NxResponse.success<{ catalogId: string }>(
    "Catalog created successfully.",
    { catalogId },
    201
  );
}
