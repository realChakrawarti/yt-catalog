import { NextRequest } from "next/server";
import { getValidCatalogIds } from "../models";
import { NxResponse } from "@/app/lib/nx-response";

export async function GET(_request: NextRequest) {
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
