import { doc, writeBatch } from "firebase/firestore";

import { db } from "~/utils/firebase";
import { COLLECTION } from "~/utils/server-helper";

export async function deleteArchive(userId: string, archiveId: string) {
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
}
