import { NextRequest } from "next/server";

import { getVideosByCatalog } from "~/entities/catalogs/services/get-videos-by-catalog";
import { NxResponse } from "~/utils/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  if (catalogId) {
    try {
      const data = await getVideosByCatalog(catalogId);

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
    } catch (err) {
      console.error(err);
      return NxResponse.fail(
        "Unable to fetch catalog videos.",
        {
          code: "CATALOG_VIDEOS",
          details: "Unable to fetch catalog videos.",
        },
        400
      );
    }
  }
}
