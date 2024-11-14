import { NextRequest, NextResponse } from "next/server";

import { getUserIdCookie } from "./utils/server-helper";

export async function middleware(request: NextRequest) {
  const userId = getUserIdCookie();

  if (!userId) {
    console.log("Not authorized: ", request.nextUrl.pathname);
    return NextResponse.json("Not authorized", { status: 401 });
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
