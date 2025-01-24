import { NextRequest, NextResponse } from "next/server";

import { NxResponse } from "./utils/nx-response";
import { getUserIdCookie } from "./utils/server-helper";

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
    "/api/youtube/get-video",
    "/api/youtube/get-playlists",
  ],
};
