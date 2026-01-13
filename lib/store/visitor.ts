import { create } from "zustand";
import { persist } from "zustand/middleware";

type VisitorState = {
  visitorId: string;
  getVisitorId: () => string;
  setVisitorId: () => void;
};

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set, get) => ({
      visitorId: crypto.randomUUID(),

      getVisitorId: () => {
        return get().visitorId;
      },

      setVisitorId: () => {
        set({ visitorId: crypto.randomUUID() });
      },
    }),
    {
      name: "apex-visitor",
      partialize: (state) => ({ visitorId: state.visitorId }),
    }
  )
);

export const getVisitorId = () => {
  return useVisitorStore.getState().visitorId;
};
