import { getUserIdCookie, YOUTUBE_VIDEO_DATA } from "@/app/lib/server-helper";
import { NextRequest, NextResponse } from "next/server";
import {
  createCatalog,
  getCatalogById,
  getCatalogByUser,
  updateCatalogVideos,
  updateChannels,
} from "./models";

export async function GET(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogIdParam = request.nextUrl.searchParams.get("catalogId");
  const videoIdParam = request.nextUrl.searchParams.get("videoId");
  const refreshParam = !!parseInt(
    request.nextUrl.searchParams.get("refresh") || ""
  );

  if (!userId) {
    return NextResponse.json(
      {
        message: "UserId is missing, please re-authenticate again.",
      },
      { status: 404 }
    );
  }

  // Update the catalog videos
  if (catalogIdParam && refreshParam) {
    const data = await updateCatalogVideos(catalogIdParam);

    if (typeof data === "string") {
      return NextResponse.json({ message: data }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Catalog updated successfully",
        data: {
          videos: data.videos,
          nextUpdate: data.nextUpdate,
        },
      },
      { status: 200 }
    );
  }
  // Get catalog by Id
  else if (catalogIdParam) {
    const data = await getCatalogById(catalogIdParam, userId);
    return NextResponse.json({ data }, { status: 200 });
  }
  // Get video Id details
  else if (videoIdParam) {
    const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  }
  // Get catalogs of a user
  else {
    const data = await getCatalogByUser(userId);
    return NextResponse.json({ data }, { status: 200 });
  }
}

export async function PATCH(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (!userId || !catalogId) {
    return NextResponse.json(
      "Either UserId or CatalogId is missing, please re-authenticate again.",
      { status: 404 }
    );
  }

  const catalogPayload = await request.json();

  await updateChannels(userId, catalogId, catalogPayload);

  return NextResponse.json(
    { message: "Channel list update successfully" },
    { status: 201 }
  );
}

export async function POST(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (!userId) {
    return NextResponse.json(
      "UserId is missing, please re-authenticate again.",
      { status: 404 }
    );
  }

  if (catalogId) {
    return NextResponse.json(
      { message: "The endpoint doesn't support params" },
      { status: 400 }
    );
  }

  await createCatalog(userId);

  return NextResponse.json(
    { message: "Catalog page created successfully" },
    { status: 201 }
  );
}
