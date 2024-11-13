import { NxResponse } from "~/utils/nx-response";
import { YOUTUBE_VIDEO_DATA } from "~/utils/server-helper";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const videoIdParam = request.nextUrl.searchParams.get("videoId");

  if (!videoIdParam) {
    return NxResponse.fail(
      "VideoId not provided.",
      { code: "BAD_REQUEST", details: "VideoId not provided." },
      400
    );
  }

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
