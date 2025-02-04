import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { PlaylistItem } from "~/shared/types-schema/types";
import { db } from "~/utils/firebase";
import {
  COLLECTION,
  YOUTUBE_CHANNELS_INFORMATION,
} from "~/utils/server-helper";

/**
 * Updates the playlists for a specific user catalog by fetching additional channel information.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param playlists - An array of playlist items to be added to the catalog
 * @returns A promise that resolves when the catalog is updated with new playlist information
 *
 * @remarks
 * This function performs the following steps:
 * 1. Fetches channel details for each playlist's channel
 * 2. Enriches playlist items with channel metadata
 * 3. Updates the catalog document in Firestore with the new playlist information
 *
 * @throws {Error} If there are issues fetching channel information or updating Firestore
 */
export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: PlaylistItem[]
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  const playlistList = [];

  for (let i = 0; i < playlists.length; i++) {
    const { channelId } = playlists[i];
    const response = await fetch(YOUTUBE_CHANNELS_INFORMATION([channelId]));
    const result = await response.json();

    const channelInfo = result?.items[0];

    const playlistItem = {
      id: playlists[i].id,
      title: playlists[i].title,
      description: playlists[i].description,
      publishedAt: playlists[i].publishedAt,
      channelId: playlists[i].channelId,
      channelHandle: channelInfo.snippet.customUrl,
      channelTitle: channelInfo.snippet.title,
      channelDescription: channelInfo.snippet.description,
      channelLogo: channelInfo.snippet.thumbnails.medium.url,
    };

    playlistList.push(playlistItem);
  }

  await updateDoc(userCatalogRef, {
    playlists: arrayUnion(...playlistList),
    updatedAt: new Date(),
  });
}
