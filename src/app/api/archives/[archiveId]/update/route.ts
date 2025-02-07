import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { addArchiveVideo } from "~/entities/archives";
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
  const result = await addArchiveVideo(userId, archiveId, payload);

  // Reset page cache when archives updates
  revalidatePath("/explore/archives");
  revalidatePath(`/a/${archiveId}`);

  return NxResponse.success(result, {}, 201);
}
