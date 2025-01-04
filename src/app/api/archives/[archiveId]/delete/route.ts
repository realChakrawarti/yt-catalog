import { doc, writeBatch } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { db } from "~/utils/firebase";
import { NxResponse } from "~/utils/nx-response";
import { COLLECTION, getUserIdCookie } from "~/utils/server-helper";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { archiveId } = ctx.params;

  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const userArchiveRef = doc(
    db,
    COLLECTION.users,
    userId,
    COLLECTION.archives,
    archiveId
  );

  const batch = writeBatch(db);
  batch.delete(archiveRef);
  batch.delete(userArchiveRef);

  await batch.commit();

  revalidatePath("/explore");
  revalidatePath("/explore/archives");

  return NxResponse.success("Archive deleted successfully.", {}, 200);
}
