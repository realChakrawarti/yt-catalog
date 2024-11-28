import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { getValidArchiveIds } from "../models";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidArchiveIds();
  return NxResponse.success(
    "Valid archive ids fetched successfully.",
    pageListData,
    200
  );
}
