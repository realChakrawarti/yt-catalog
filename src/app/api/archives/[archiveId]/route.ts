import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { getArchiveById, updateArchiveMeta } from "../models";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  const data = await getArchiveById(archiveId);
  return NxResponse.success<any>(
    `${archiveId} archive data fetched successfully.`,
    data,
    200
  );
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  const payload = await request.json();

  const message = await updateArchiveMeta(archiveId, payload);

  return NxResponse.success(message, {}, 201);
}
