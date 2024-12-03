import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { getNextUpdate } from "../../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

const ONE_HOUR = 3_600_000;
const FOUR_HOURS = 4 * ONE_HOUR;

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;
  const result = await getNextUpdate(catalogId);
  const currentTime = Date.now();

  const lastUpdatedTime = new Date(result).getTime();
  const nextUpdate = new Date(lastUpdatedTime + FOUR_HOURS).toUTCString();

  if (currentTime - lastUpdatedTime > FOUR_HOURS) {
    console.log(`Revalidating path: /c/${catalogId}`);
    revalidatePath(`/c/${catalogId}`);
  }

  return NxResponse.success("", nextUpdate, 200);
}
