import { create } from "zustand";

import type { PlaylistItem } from "~/types-schema/types";

export type LocalChannel = {
  title: string;
  id: string;
};

type VideoLink = {
  link: string;
  error: string;
};

type ChannelInfo = { title: string; id: string };

interface CatalogStore {
  channelInfo: ChannelInfo;
  videoLink: VideoLink;
  localChannels: LocalChannel[];
  savedChannels: any[];
  localPlaylists: PlaylistItem[];
  searchPlaylists: any[];
  channelPlaylists: any[];
  playlistInput: string;
  savedPlaylists: any[];
  setChannelInfo: (_channelInfo: ChannelInfo) => void;
  setVideoLink: (_videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (_playlist: any[]) => void;
  setLocalChannels: (_localChannels: LocalChannel[]) => void;
  setSavedChannels: (_channels: any[]) => void;
  setLocalPlaylists: (_localPlaylists: PlaylistItem[]) => void;
  setSearchPlaylists: (_searchPlaylists: any[]) => void;
  setChannelPlaylists: (_channelPlaylists: any[]) => void;
  setPlaylistInput: (_input: string) => void;
  resetLocalPlaylist: () => void;
}

const useCatalogStore = create<CatalogStore>((set) => ({
  channelInfo: {
    title: "",
    id: "",
  },
  localChannels: [],
  savedChannels: [],
  localPlaylists: [],
  searchPlaylists: [],
  channelPlaylists: [],
  playlistInput: "",
  savedPlaylists: [],
  videoLink: { error: "", link: "" },
  setChannelInfo: (channelInfo) => set({ channelInfo: channelInfo }),
  setVideoLink: (link) => {
    return set((state) => ({
      videoLink: {
        ...state.videoLink,
        ...link,
      },
    }));
  },
  setSavedPlaylists: (playlists) => set({ savedPlaylists: playlists }),
  setPlaylistInput: (inputValue) => set({ playlistInput: inputValue }),
  setLocalChannels: (localChannels) => set({ localChannels }),
  setSavedChannels: (channels) => set({ savedChannels: channels }),
  setLocalPlaylists: (localPlaylists) =>
    set({ localPlaylists: localPlaylists }),
  setSearchPlaylists: (searchPlaylists) =>
    set({ searchPlaylists: searchPlaylists }),
  setChannelPlaylists: (channelPlaylists) =>
    set({ channelPlaylists: channelPlaylists }),
  resetLocalPlaylist: () =>
    set({
      playlistInput: "",
      searchPlaylists: [],
      localPlaylists: [],
      channelPlaylists: [],
      videoLink: { error: "", link: "" },
      channelInfo: {
        title: "",
        id: "",
      },
    }),
}));

export default useCatalogStore;
