import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { getValidCatalogIds } from "../models";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
