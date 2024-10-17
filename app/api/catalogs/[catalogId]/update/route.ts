import { NxResponse } from "@/app/lib/nx-response";
import { getUserIdCookie } from "@/app/lib/server-helper";
import { NextRequest } from "next/server";
import { updateCatalogVideos, updateChannels } from "../../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
    const { catalogId } = ctx.params;
    const data = await updateCatalogVideos(catalogId);

    if (typeof data === "string") {
      return NxResponse.fail(data, { code: "UNKOWN", details: data }, 404);
    }

    return NxResponse.success<{ videos: any; nextUpdate: string }>(
      "Catalog page updated successfully.",
      {
        videos: data.videos,
        nextUpdate: data.nextUpdate,
      },
      200
    );
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  if (!userId || !catalogId) {
    return NxResponse.fail(
      "You are not authorized. Please login again.",
      { code: "UNAUTHORIZED", details: "User ID or Catalog ID is missing." },
      401
    );
  }

  const catalogPayload = await request.json();

  await updateChannels(userId, catalogId, catalogPayload);

  return NxResponse.success<any>("Channel list update successfully.", {}, 201);
}
