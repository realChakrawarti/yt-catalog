import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import { db } from "~/utils/firebase";
import {
  COLLECTION,
  createNanoidToken,
  toUTCString,
} from "~/utils/server-helper";

/**
 * This function returns all archive of a user
 * @param userId
 * @returns
 */
export async function getArchiveByUser(userId: string) {
  let userArchivesData: any[] = [];

  const userRef = doc(db, COLLECTION.users, userId);
  try {
    const userArchivesCollectionRef = collection(userRef, COLLECTION.archives);
    const userArchivesDoc = await getDocs(userArchivesCollectionRef);
    const archiveIds = userArchivesDoc.docs.map((doc) => doc.id);

    if (!archiveIds.length) {
      return userArchivesData;
    }

    for (let i = 0; i < archiveIds.length; i++) {
      const archiveId = archiveIds[i];
      const archiveRef = doc(db, COLLECTION.archives, archiveId);
      const archiveSnap = await getDoc(archiveRef);
      const archiveData = archiveSnap.data();

      userArchivesData.push({
        id: archiveId,
        title: archiveData?.title,
        description: archiveData?.description,
        videoData: {
          updatedAt: toUTCString(archiveData?.data?.updatedAt),
          videos: archiveData?.data?.videos,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  return userArchivesData;
}

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

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param archiveId
 * @param userId
 * @returns
 */

// TODO: How would I handle the data? VideoId as an array in userArchive and data retrived from API stored as an object in the main archive?
export async function getArchiveById(archiveId: string, userId: string) {
  const userRef = doc(db, COLLECTION.users, userId);

  let archiveResponseData = {};

  try {
    // const userArchiveRef = doc(userRef, COLLECTION.catalogs, archiveId);

    // Get title and description
    const archiveRef = doc(db, COLLECTION.archives, archiveId);
    const archiveSnap = await getDoc(archiveRef);
    const archiveData = archiveSnap.data();

    archiveResponseData = {
      title: archiveData?.title,
      description: archiveData?.description,
    };
  } catch (err) {
    console.error(err);
  }

  return archiveResponseData;
}
