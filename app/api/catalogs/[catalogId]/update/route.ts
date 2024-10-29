import { NxResponse } from "@/lib/nx-response";
import { getUserIdCookie } from "@/lib/server-helper";
import { NextRequest } from "next/server";
import { updateCatalogVideos, updateChannels } from "../../models";
import { revalidatePath } from "next/cache";

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

  const catalogPayload = await request.json();

  await updateChannels(userId, catalogId, catalogPayload);

  // Update the catalog
  updateCatalogVideos(catalogId);

  // Revalidate the /explore route
  revalidatePath("/explore");

  return NxResponse.success<any>("Channel list update successfully.", {}, 201);
}
