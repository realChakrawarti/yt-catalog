import { NextRequest } from "next/server";
import { getValidCatalogIds, getVideosByCatalogId } from "./models";
import { NxResponse } from "@/app/lib/nx-response";

// TODO: Send limit in the params when making a request
export async function GET(request: NextRequest) {
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (catalogId) {
    const data = await getVideosByCatalogId(catalogId);

    if (typeof data === "string") {
      return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
    }

    const response = {
      title: data.title,
      description: data.description,
      data: data.videos,
      nextUpdate: data.nextUpdate,
    };

    return NxResponse.success<any>(
      `Catalog: ${catalogId} videos fetched successfully.`,
      response,
      200
    );
  }

  // Get valid catalog Ids
  const pageListData = await getValidCatalogIds();
  return NxResponse.success(
    "Valid catalog ids fetched successfully.",
    pageListData,
    200
  );
}
