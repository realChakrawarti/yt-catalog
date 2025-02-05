import { NextRequest } from "next/server";

import { createCatalog } from "~/entities/catalogs/services/create-catalog";
import { getCatalogByUser } from "~/entities/catalogs/services/get-catalogs-by-user";
import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

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
