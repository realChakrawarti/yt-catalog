import { YOUTUBE_CHANNEL_PLAYLISTS } from "~/utils/server-helper";

// TODO: Limit no of recurive calls that could be made, probably limit result to 500, i.e; 10
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

// TODO: Consider checking if a playlist has 0 items, hence don't take that into account
//  "contentDetails": {
// "itemCount": 0
// }

// Get all playlists by channel
export async function getPlaylistsByChannel(channelId: string) {
  const response = await fetch(YOUTUBE_CHANNEL_PLAYLISTS(channelId));
  const firstPageData = await response.json();
  if (response.status === 200) {
    const playlistItems = firstPageData.items;
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
