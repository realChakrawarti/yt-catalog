import { doc, setDoc } from "firebase/firestore";

import { db } from "~/utils/firebase";
import { COLLECTION, createNanoidToken } from "~/utils/server-helper";

export async function createArchive(userId: string, archiveMeta: any) {
  const nanoidToken = createNanoidToken(9);

  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, nanoidToken);

  // Add a doc to user -> archive collection
  const userArchiveRef = doc(userRef, COLLECTION.archives, nanoidToken);

  // Create archive sub-collection
  await setDoc(userArchiveRef, {
    videoIds: [],
    updatedAt: new Date(),
  });

  // Add a doc to archive collection
  await setDoc(archiveRef, {
    data: {
      updatedAt: new Date(0),
    },
    videoRef: userArchiveRef,
    title: archiveMeta.title,
    description: archiveMeta.description,
  });

  return nanoidToken;
}
