import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { getArchiveById } from "../models";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { archiveId } = ctx.params;

  const data = await getArchiveById(archiveId, userId);
  return NxResponse.success<any>(
    `${archiveId} catalog data fetched successfully.`,
    data,
    200
  );
}
