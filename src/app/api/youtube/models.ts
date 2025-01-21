import { YOUTUBE_CHANNEL_PLAYLISTS } from "~/utils/server-helper";

async function getAllPlaylists(channelId: string, data: any, playlists: any[]) {
  const pageToken = data.nextPageToken;
  if (pageToken) {
    const response = await fetch(
      YOUTUBE_CHANNEL_PLAYLISTS(channelId, pageToken)
    );
    const result = await response.json();
    playlists = [...playlists, ...result.items];
    return await getAllPlaylists(channelId, result, playlists);
  }

  return playlists;
}

// Get all playlists by channel
export async function getPlaylistsByChannel(channelId: string) {
  const response = await fetch(YOUTUBE_CHANNEL_PLAYLISTS(channelId));
  const firstPageData = await response.json();
  if (response.status === 200) {
    let playlistItems = firstPageData.items;
    const allPlaylistItems = await getAllPlaylists(
      channelId,
      firstPageData,
      playlistItems
    );

    return allPlaylistItems;
  } else {
    throw Error(firstPageData.error.message);
  }
}
