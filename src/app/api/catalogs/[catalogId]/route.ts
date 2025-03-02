import { NextRequest } from "next/server";

import { getCatalogById, updateCatalogMeta } from "~/entities/catalogs";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  const payload = await request.json();

  const message = await updateCatalogMeta(catalogId, payload);

  return NxResponse.success(message, {}, 201);
}

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
