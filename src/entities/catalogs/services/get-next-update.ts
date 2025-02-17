import { doc, getDoc } from "firebase/firestore";

import { COLLECTION } from "~/shared/lib/firebase/collections";
import { db } from "~/shared/lib/firebase/config";

/**
 * Retrieves the next scheduled update time for a specific catalog.
 *
 * @param catalogId - The unique identifier of the catalog
 * @returns The timestamp of the catalog's last update
 */
export async function getNextUpdate(catalogId: string) {
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const catalogSnap = await getDoc(catalogRef);
  const catalogData = catalogSnap.data();

  return catalogData?.data.updatedAt.toDate();
}
