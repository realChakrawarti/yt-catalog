import { db } from "@/lib/firebase";
import { NxResponse } from "@/lib/nx-response";
import { COLLECTION, getUserIdCookie } from "@/lib/server-helper";
import { doc, writeBatch } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function DELETE(_request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdCookie();
  const { catalogId } = ctx.params;

  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const userCatalogRef = doc(
    db,
    COLLECTION.users,
    userId,
    COLLECTION.catalogs,
    catalogId
  );

  const batch = writeBatch(db);
  batch.delete(catalogRef);
  batch.delete(userCatalogRef);

  await batch.commit();

  revalidatePath("/explore");

  return NxResponse.success("Catalog deleted successfully.", {}, 200);
}
