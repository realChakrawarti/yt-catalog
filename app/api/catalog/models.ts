import { db } from "@/app/lib/firebase";
import {
  COLLECTION,
  createNanoidToken,
  YOUTUBE_CHANNELS_INFORMATION,
} from "@/app/lib/server-helper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getVideosByCatalogId } from "../explore/models";

import topicData from "./youtube-topics.json";

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param catalogId
 * @param userId
 * @returns
 */
export async function getCatalogById(catalogId: string, userId: string) {
  // Get channel list
  const userRef = doc(db, COLLECTION.users, userId);

  let catalogResponseData = {};

  try {
    const userPageRef = doc(userRef, COLLECTION.catalogs, catalogId);

    const channelList = await getDoc(userPageRef);
    const channelListData = channelList.data()?.channels;

    // Get title and description

    const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
    const catalogSnap = await getDoc(catalogRef);
    const catalogData = catalogSnap.data();

    catalogResponseData = {
      title: catalogData?.title,
      description: catalogData?.description,
      channelList: channelListData,
    };
  } catch (err) {
    console.error(err);
  }

  return catalogResponseData;
}

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
        id: catalogId,
        title: catalogData?.title,
        description: catalogData?.description,
        videoData: catalogData?.data,
      });
    }
  } catch (err) {
    console.error(err);
  }

  return userCatalogsData;
}

type TopicId = keyof typeof topicData;

function extractTopics(topicIds: TopicId[]): string[] {
  let topicNames: string[] = [];
  topicIds.forEach((topicId) => topicNames.push(topicData[topicId]));
  return topicNames;
}

async function getChannelsInfo(channels: string[]) {
  let channelsInfo: any[] = [];
  // Create a separate doc with channels information, fetch from youtube API
  const response = await fetch(YOUTUBE_CHANNELS_INFORMATION(channels));
  const result = await response.json();

  const channelListItems = result?.items;

  for (let i = 0; i < channelListItems?.length; i++) {
    const channelInfo = channelListItems[i];

    const channelMeta = {
      id: channelInfo.id,
      handle: channelInfo.snippet.customUrl,
      title: channelInfo.snippet.title,
      description: channelInfo.snippet.description,
      logo: channelInfo.snippet.thumbnails.medium.url,
      topics: extractTopics(channelInfo.topicDetails.topicIds),
    };

    channelsInfo.push(channelMeta);
  }

  return channelsInfo;
}

/**
 * This function updates the channels of a specific catalogId
 * @param userId
 * @param catalogId
 * @param channels
 */
export async function updateChannels(
  userId: string,
  catalogId: string,
  catalogPayload: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId)

  const {channels, title, description} = catalogPayload

  try {
    const channelsInfo = await getChannelsInfo(channels);

    await updateDoc(userCatalogRef, {
      channels: channelsInfo,
      updatedAt: new Date(),
    });

    if (title || description) {
      await updateDoc(catalogRef, {
        title: title,
        description: description
      })
    }

  } catch (err) {
    console.error(err);
  }
}

/**
 * This function creates a catalog page for a user
 * @param userId
 */
export async function createCatalog(userId: string) {
  const userRef = doc(db, COLLECTION.users, userId);
  const nanoidToken = createNanoidToken();
  const catalogRef = doc(db, COLLECTION.catalogs, nanoidToken);

  // Add a doc to user -> page collection
  const userPageRef = doc(userRef, COLLECTION.catalogs, nanoidToken);

  // Create pages sub-collection
  await setDoc(userPageRef, {
    channels: [],
    updatedAt: new Date(),
  });

  // Add a doc to pages collection
  await setDoc(catalogRef, {
    data: {
      updatedAt: new Date(0),
    },
    videoRef: userPageRef,
    title: `Title - ${nanoidToken}`,
    description: `Description - ${nanoidToken}`,
  });
}

export async function updateCatalogVideos(catalogId: string) {
  const data = await getVideosByCatalogId(catalogId);
  return data;
}
