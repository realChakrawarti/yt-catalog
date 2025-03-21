import { NextRequest, NextResponse } from "next/server";

import { getUserIdCookie } from "./shared/lib/next/get-cookie";
import { NxResponse } from "./shared/lib/next/nx-response";

export async function middleware(request: NextRequest) {
  const userId = getUserIdCookie();

  if (!userId) {
    console.log("Not authorized: ", request.nextUrl.pathname);
    return NxResponse.fail(
      "Not authorized",
      { code: "UNAUTHORIZED", details: "Not authorized" },
      401
    );
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // Archives Routes
    "/api/archives/",
    "/api/archives/:archiveId/add-video",
    "/api/archives/:archiveId/delete",
    "/api/archives/:archiveId/remove-video",
    "/api/archives/:archiveId/update",
    // Catalogs Routes
    "/api/catalogs/",
    "/api/catalogs/:catalogId/channel",
    "/api/catalogs/:catalogId/delete",
    "/api/catalogs/:catalogId/playlist",
    "/api/catalogs/:catalogId/update",
    "/api/catalogs/:catalogId/video",
    // YouTube Routes
    "/api/youtube/video",
    "/api/youtube/playlists",
    // User Routes
    "/api/logout",
  ],
};
