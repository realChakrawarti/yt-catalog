import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { addArchiveVideo } from "~/entities/archives/services/add-archive-video";
import { NxResponse } from "~/shared/lib/nx-response";
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
  const result = await addArchiveVideo(userId, archiveId, payload);

  // Reset page cache when archives updates
  revalidatePath("/explore/archives");
  revalidatePath(`/a/${archiveId}`);

  return NxResponse.success(result, {}, 201);
}
