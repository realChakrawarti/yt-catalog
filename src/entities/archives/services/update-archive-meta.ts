import { doc, updateDoc } from "firebase/firestore";

import { COLLECTION } from "~/shared/lib/firebase/collections";
import { db } from "~/shared/lib/firebase/config";

export async function updateArchiveMeta(archiveId: string, archiveMeta: any) {
  const archiveRef = doc(db, COLLECTION.archives, archiveId);

  try {
    await updateDoc(archiveRef, {
      title: archiveMeta.title,
      description: archiveMeta.description,
    });

    return "Archive details updated successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update archive details.";
  }
}
