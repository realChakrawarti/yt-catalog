import { NextRequest, NextResponse } from "next/server";
import { getValidCatalogIds, getVideosByCatalogId } from "./models";

// TODO: Send limit in the params when making a request
export async function GET(request: NextRequest) {
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (catalogId) {
    const data = await getVideosByCatalogId(catalogId);

    if (typeof data === "string") {
      return NextResponse.json({ message: data }, { status: 400 });
    }

    const response = {
      title: data.title,
      description: data.description,
      data: data.videos,
      nextUpdate: data.nextUpdate,
    };

    return NextResponse.json(response, { status: 200 });
  }

  // Get valid catalog Ids
  const pageListData = await getValidCatalogIds();
  return NextResponse.json({ data: pageListData }, { status: 200 });
}
