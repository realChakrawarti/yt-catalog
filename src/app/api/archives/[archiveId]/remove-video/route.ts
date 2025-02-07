import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { removeArchiveVideo } from "~/entities/archives";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

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
