import { NextRequest } from "next/server";

import { NxResponse } from "~/utils/nx-response";

import { getVideosByCatalogId } from "../../models";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  if (catalogId) {
    const data = await getVideosByCatalogId(catalogId);

    if (typeof data === "string") {
      return NxResponse.fail(data, { code: "UNKNOWN", details: data }, 400);
    }

    const response = {
      title: data.title,
      description: data.description,
      data: data.videos,
      nextUpdate: data.nextUpdate,
    };

    return NxResponse.success<any>(
      `Catalog: ${catalogId} videos fetched successfully.`,
      response,
      200
    );
  }
}
