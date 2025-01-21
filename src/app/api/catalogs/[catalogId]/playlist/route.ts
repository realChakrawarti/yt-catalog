import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { updateCatalogPlaylists } from "../../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET() {
  return NxResponse.success<any>("Hello", {}, 200);
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  if (!catalogId) {
    return NxResponse.fail(
      "Catalog ID is missing from request params.",
      {
        code: "BAD_REQUEST",
        details: "Catalog ID is missing from request params.",
      },
      400
    );
  }

  const playlistPayload = await request.json();

  console.log(">>>pp", playlistPayload);

  await updateCatalogPlaylists(userId, playlistPayload);

  return NxResponse.success<any>("Playlist update successfully.", {}, 201);
}
