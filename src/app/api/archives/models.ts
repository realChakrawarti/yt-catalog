import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { unstable_noStore } from "next/cache";

import { ValidMetadata } from "~/types-schema/types";
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
export async function getArchiveById(archiveId: string) {
  let archiveResponseData = {};

  try {
    // Get title and description
    const archiveRef = doc(db, COLLECTION.archives, archiveId);
    const archiveSnap = await getDoc(archiveRef);
    const archiveData = archiveSnap.data();

    archiveResponseData = {
      title: archiveData?.title,
      description: archiveData?.description,
      videos: archiveData?.data.videos,
    };
  } catch (err) {
    console.error(err);
  }

  return archiveResponseData;
}

export async function addArchiveVideo(
  userId: string,
  archiveId: string,
  videoData: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const userArchiveRef = doc(userRef, COLLECTION.archives, archiveId);

  const batch = writeBatch(db);

  // Since both read and writes happening, consider using `runTransaction`
  // Refer: https://firebase.google.com/docs/firestore/manage-data/transactions
  try {
    const userArchiveSnap = await getDoc(userArchiveRef);
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(archiveRef, {
      "data.updatedAt": new Date(),
      "data.videos": arrayUnion(videoData),
      "data.totalVideos": currentTotalVideos + 1,
    });

    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: arrayUnion(videoData.videoId),
    });

    batch.commit();

    return "Video added successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to add video to archive.";
  }
}

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

export async function removeVideoFromArchive(
  userId: string,
  archiveId: string,
  payload: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const userArchiveRef = doc(userRef, COLLECTION.archives, archiveId);

  const batch = writeBatch(db);

  try {
    const userArchiveSnap = await getDoc(userArchiveRef);
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: arrayRemove(payload.videoId),
    });

    batch.update(archiveRef, {
      "data.updatedAt": new Date(),
      "data.videos": arrayRemove(payload),
      "data.totalVideos": Math.max(0, currentTotalVideos - 1),
    });

    batch.commit();

    return "Video removed successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to remove video from archive.";
  }
}

const getArchiveMetadata = async (archiveId: string) => {
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const archiveSnap = await getDoc(archiveRef);
  const archiveData = archiveSnap.data();
  return archiveData;
};

const getVideoThumbnails = (archiveData: DocumentData) => {
  const videos = archiveData.data.videos;
  const thumbnails = videos.map((video: any) => video.thumbnail);
  return thumbnails;
};

export async function getValidArchiveIds() {
  unstable_noStore();
  let archiveListData: any[] = [];
  const archivesCollectionRef = collection(db, COLLECTION.archives);

  const validArchiveQuery = query(
    archivesCollectionRef,
    where("data.videos", "!=", false),
    limit(25)
  );

  const archivesDoc = await getDocs(validArchiveQuery);
  const archiveIds = archivesDoc.docs.map((archive) => archive.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    archiveIds.map(async (archiveId) => {
      const archiveData = await getArchiveMetadata(archiveId);
      if (archiveData) {
        const metaData: Omit<ValidMetadata, "pageviews"> = {
          thumbnails: getVideoThumbnails(archiveData),
          title: archiveData?.title,
          description: archiveData?.description,
          id: archiveId,
          updatedAt: archiveData?.data.updatedAt.toDate(),
          totalVideos: archiveData?.data?.totalVideos,
        };

        archiveListData.push(metaData);
      }
    })
  );

  return archiveListData;
}
