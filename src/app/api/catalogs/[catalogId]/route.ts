import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";
import { getUserIdCookie } from "~/utils/server-helper";

import { getCatalogById } from "../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  try {
    const data = await getCatalogById(catalogId, userId);

    return NxResponse.success<any>(
      `${catalogId} catalog data fetched successfully.`,
      data,
      200
    );
  } catch (err) {
    console.error(String(err));
    return NxResponse.fail(
      "Unable to fetch catalog details.",
      {
        code: "GET_CATALOG",
        details: "Unable to fetch catalog details.",
      },
      400
    );
  }
}
