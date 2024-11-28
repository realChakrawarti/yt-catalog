import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { removeVideoFromArchive } from "../../models";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { archiveId } = ctx.params;

  const payload = await request.json();

  const message = await removeVideoFromArchive(userId, archiveId, payload);

  return NxResponse.success(message, {}, 201);
}
