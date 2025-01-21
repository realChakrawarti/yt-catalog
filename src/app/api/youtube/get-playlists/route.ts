import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { getPlaylistsByChannel } from "../models";

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NxResponse.fail(
      "Channel ID not provided.",
      { code: "BAD_REQUEST", details: "Channel ID not provided." },
      400
    );
  }

  try {
    const data = await getPlaylistsByChannel(channelId);

    return NxResponse.success(
      `Playlists associated with channel ID: ${channelId} fetched successfully.`,
      data,
      200
    );
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
