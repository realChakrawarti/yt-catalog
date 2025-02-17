import { NextRequest } from "next/server";

import { getValidArchiveIds } from "~/entities/archives";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidArchiveIds();
  return NxResponse.success(
    "Valid archive ids fetched successfully.",
    pageListData,
    200
  );
}
