import { NxResponse } from "@/lib/nx-response";
import { createCatalog, getCatalogByUser } from "./models";
import { getUserIdCookie } from "@/lib/server-helper";

export async function GET() {
  const userId = getUserIdCookie();
  const data = await getCatalogByUser(userId);
  return NxResponse.success("Catalogs data fetched successfully.", data, 200);
}

export async function POST() {
  const userId = getUserIdCookie();
  const catalogId = await createCatalog(userId);

  return NxResponse.success<{ catalogId: string }>(
    "Catalog page created successfully.",
    { catalogId },
    201
  );
}
