import { NxResponse } from "@/app/lib/nx-response";
import { createCatalog, getCatalogByUser } from "./models";
import { getUserIdCookie } from "@/app/lib/server-helper";

export async function GET() {
  const userId = getUserIdCookie();
  const data = await getCatalogByUser(userId);
  return NxResponse.success("Catalogs data fetched successfully.", data, 200);
}

export async function POST() {
  const userId = getUserIdCookie();
  await createCatalog(userId);

  return NxResponse.success<any>("Catalog page created successfully.", {}, 201);
}
