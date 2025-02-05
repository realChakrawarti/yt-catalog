import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { removeArchiveVideo } from "~/entities/archives/services/remove-archive-video";
import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { archiveId } = ctx.params;

  const payload = await request.json();

  const message = await removeArchiveVideo(userId, archiveId, payload);

  revalidatePath(`/a/${archiveId}`);

  return NxResponse.success(message, {}, 201);
}
