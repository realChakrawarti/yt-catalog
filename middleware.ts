import { NextRequest, NextResponse } from "next/server";
import { getUserIdCookie } from "./lib/server-helper";

export async function middleware(request: NextRequest) {
  const userId = getUserIdCookie();

  if (!userId) {
    console.log("Logging out ", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/"));
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
    "/api/catalogs/:catalogId/delete",
    "/api/logout",
    "/api/youtube/videoId",
  ],
};
