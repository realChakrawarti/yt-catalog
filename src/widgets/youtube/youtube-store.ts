import { create } from "zustand";

interface State {
  player: YT.Player | null;
}

interface Actions {
  setPlayer: (_player: YT.Player) => void;
  resetPlayer: () => void;
}

const initialState = {
  player: null,
} satisfies State;

const usePlayerStore = create<State & Actions>((set) => ({
  ...initialState,
  resetPlayer: () => {
    set({
      player: null,
    });
  },
  setPlayer: (player) => {
    set({ player: player });
  },
}));

export default usePlayerStore;
