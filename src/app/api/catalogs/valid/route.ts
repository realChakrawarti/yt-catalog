import { NextRequest } from "next/server";

import { getValidCatalogIds } from "~/entities/catalogs/services/get-valid-catalogs-ids";
import { NxResponse } from "~/utils/nx-response";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
