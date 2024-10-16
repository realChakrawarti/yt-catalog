import { getUserIdCookie, YOUTUBE_VIDEO_DATA } from "@/app/lib/server-helper";
import { NextRequest, NextResponse } from "next/server";
import {
  createCatalog,
  getCatalogById,
  getCatalogByUser,
  updateCatalogVideos,
  updateChannels,
} from "./models";
import { NxResponse } from "@/app/lib/nx-response";

export async function GET(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogIdParam = request.nextUrl.searchParams.get("catalogId");
  const videoIdParam = request.nextUrl.searchParams.get("videoId");
  const refreshParam = !!parseInt(
    request.nextUrl.searchParams.get("refresh") || ""
  );

  if (!userId) {
    return NxResponse.fail(
      "You are not authorized. Please login again.",
      { code: "UNAUTHORIZED", details: "User ID is missing." },
      401
    );
  }

  // Update the catalog videos
  if (catalogIdParam && refreshParam) {
    const data = await updateCatalogVideos(catalogIdParam);

    if (typeof data === "string") {
      return NxResponse.fail(data, { code: "UNKOWN", details: data }, 404);
    }

    return NxResponse.success<{ videos: any; nextUpdate: string }>(
      "Catalog page updated successfully.",
      {
        videos: data.videos,
        nextUpdate: data.nextUpdate,
      },
      200
    );
  }
  // Get catalog by Id
  else if (catalogIdParam) {
    const data = await getCatalogById(catalogIdParam, userId);
    return NxResponse.success<any>(
      `${catalogIdParam} catalog data fetched successfully.`,
      data,
      200
    );
  }
  // Get video Id details
  else if (videoIdParam) {
    try {
      const response = await fetch(YOUTUBE_VIDEO_DATA(videoIdParam));
      const data = await response.json();
      if (response.status === 200) {
        return NxResponse.success(
          `Channel associated with Video ID: ${videoIdParam} fetched successfully.`,
          data,
          200
        );
      } else {
        throw Error(data.error.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "YOUTUBE_API", details: err.message },
          400
        );
      }
    }
  }
  // Get catalogs of a user
  else {
    const data = await getCatalogByUser(userId);
    return NxResponse.success("Catalogs data fetched successfully.", data, 200);
  }
}

export async function PATCH(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (!userId || !catalogId) {
    return NxResponse.fail(
      "You are not authorized. Please login again.",
      { code: "UNAUTHORIZED", details: "User ID or Catalog ID is missing." },
      401
    );
  }

  const catalogPayload = await request.json();

  await updateChannels(userId, catalogId, catalogPayload);

  return NxResponse.success<any>("Channel list update successfully.", {}, 201);
}

export async function POST(request: NextRequest) {
  const userId = getUserIdCookie();
  const catalogId = request.nextUrl.searchParams.get("catalogId");

  if (!userId) {
    return NxResponse.fail(
      "You are not authorized. Please login again.",
      { code: "UNAUTHORIZED", details: "User ID is missing." },
      401
    );
  }

  if (catalogId) {
    return NxResponse.fail(
      "The endpoint doesn't support params.",
      { code: "INVALID_PARAM", details: "Endpoint doesn't accept catalogId." },
      400
    );
  }

  await createCatalog(userId);

  return NxResponse.success<any>("Catalog page created successfully.", {}, 201);
}
