import { NextRequest } from "next/server";

import { getValidCatalogIds } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
