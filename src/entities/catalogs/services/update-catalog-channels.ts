// TODO: Remove Topic data, payload should only be array of channels, make sure to type it
import { doc, updateDoc } from "firebase/firestore";

import { YOUTUBE_CHANNELS_INFORMATION } from "~/shared/lib/api/youtube-endpoints";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { db } from "~/shared/lib/firebase/config";

import topicData from "./youtube-topics.json";

/**
 * This function updates the channels of a specific catalogId
 * @param userId
 * @param catalogId
 * @param channels
 */
export async function updateCatalogChannels(
  userId: string,
  catalogId: string,
  catalogPayload: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  const { channels } = catalogPayload;

  try {
    const channelsInfo = await getChannelsInfo(channels);

    await updateDoc(userCatalogRef, {
      channels: channelsInfo,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
  }
}

type TopicId = keyof typeof topicData;

function extractTopics(topicIds: TopicId[]): string[] {
  let topicNames: string[] = [];
  topicIds.forEach((topicId) => topicNames.push(topicData[topicId]));
  return topicNames;
}

/**
 * Retrieves detailed information for a list of YouTube channels.
 *
 * @param channels - An array of YouTube channel IDs to fetch information for
 * @returns An array of channel metadata objects with ID, handle, title, description, logo, and topics
 *
 * @remarks
 * Fetches channel information from the YouTube API and transforms the response into a structured format.
 * Extracts key details such as channel title, description, custom URL, thumbnail, and associated topics.
 *
 * @throws {Error} If there's an issue fetching channel information from the YouTube API
 */
async function getChannelsInfo(channels: string[]) {
  let channelsInfo: any[] = [];
  // Create a separate doc with channels information, fetch from youtube API
  const response = await fetch(YOUTUBE_CHANNELS_INFORMATION(channels));
  const result = await response.json();

  const channelListItems = result?.items;

  for (let i = 0; i < channelListItems?.length; i++) {
    const channelInfo = channelListItems[i];

    const channelMeta = {
      description: channelInfo.snippet.description,
      handle: channelInfo.snippet.customUrl,
      id: channelInfo.id,
      logo: channelInfo.snippet.thumbnails.medium.url,
      title: channelInfo.snippet.title,
      // TODO: Remove Topics, feels a bit redundant
      topics: extractTopics(channelInfo.topicDetails.topicIds),
    };

    channelsInfo.push(channelMeta);
  }

  return channelsInfo;
}
