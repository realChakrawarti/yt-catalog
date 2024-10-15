import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET(request: Request) {
  const response = NextResponse.json(
    { message: "User logged out successfully" },
    { status: 200 }
  );

  response.cookies.delete({name: "userId", path: "/"})
  return response;
}
