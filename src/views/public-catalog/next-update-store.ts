import { create } from "zustand";

type State = {
  showBanner: boolean;
};

type Actions = {
  setShowBanner: (_state: boolean) => void;
};

const initialState: State = {
  showBanner: false,
};

const useNextUpdateStore = create<State & Actions>((set) => ({
  ...initialState,
  setShowBanner: (value: boolean) => {
    set({
      showBanner: value,
    });
  },
}));

export default useNextUpdateStore;
