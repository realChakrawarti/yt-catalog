import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware running on " + request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    "/api/catalogs/:catalogId/update",
    "/api/catalogs/",
    "/api/youtube/videoId",
  ],
};
