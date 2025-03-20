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
    "/api/catalogs/",
    "/api/catalogs/:catalogId/update",
    "/api/catalogs/:catalogId/playlist",
    "/api/catalogs/:catalogId/delete",
    "/api/logout",
    "/api/youtube/video",
    "/api/youtube/playlists",
  ],
};
