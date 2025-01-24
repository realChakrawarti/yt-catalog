import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { PlaylistItem } from "~/types-schema/types";
import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { deletePlaylist, updateCatalogPlaylists } from "../../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

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

  const playlistPayload: PlaylistItem[] = await request.json();

  await updateCatalogPlaylists(userId, catalogId, playlistPayload);

  return NxResponse.success<any>("Playlist update successfully.", {}, 201);
}

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  const playlists = await request.json();

  await deletePlaylist(userId, catalogId, playlists);

  revalidatePath(`/c/${catalogId}`);

  return NxResponse.success<any>("Playlist deleted successfully.", {}, 201);
}
