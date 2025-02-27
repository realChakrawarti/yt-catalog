import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { deleteArchive } from "~/entities/archives";
import { getUserIdCookie } from "~/shared/lib/next/get-cookie";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { archiveId } = ctx.params;

  try {
    await deleteArchive(userId, archiveId);
    revalidatePath("/explore");
    revalidatePath("/explore/archives");
    return NxResponse.success("Archive deleted successfully.", {}, 200);
  } catch (err) {
    return NxResponse.fail(
      "Failed to delete Archive. Try again.",
      {
        code: "UNABLE_DELETE_ARCHIVE",
        details: "Failed to delete Archive. Try again.",
      },
      401
    );
  }
}
