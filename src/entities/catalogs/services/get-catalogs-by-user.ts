import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { toUTCString } from "~/shared/lib/date-time/to-utc-string";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { db } from "~/shared/lib/firebase/config";

/**
 * This function returns all catalogs of a user
 * @param userId
 * @returns
 */
export async function getCatalogByUser(userId: string) {
  let userCatalogsData: any[] = [];

  const userRef = doc(db, COLLECTION.users, userId);
  try {
    const userCatalogsCollectionRef = collection(userRef, COLLECTION.catalogs);
    const userCatalogsDoc = await getDocs(userCatalogsCollectionRef);
    const catalogIds = userCatalogsDoc.docs.map((doc) => doc.id);

    if (!catalogIds.length) {
      return userCatalogsData;
    }

    for (let i = 0; i < catalogIds.length; i++) {
      const catalogId = catalogIds[i];
      const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
      const catalogSnap = await getDoc(catalogRef);
      const catalogData = catalogSnap.data();

      userCatalogsData.push({
        description: catalogData?.description,
        id: catalogId,
        title: catalogData?.title,
        videoData: {
          updatedAt: toUTCString(catalogData?.data?.updatedAt),
          videos: catalogData?.data?.videos,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  return userCatalogsData;
}
