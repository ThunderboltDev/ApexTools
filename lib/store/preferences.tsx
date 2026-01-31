import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthMethod = "google" | "github" | "magic-link" | null;

type PreferencesState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  lastAuthMethod: AuthMethod;
  setLastAuthMethod: (method: AuthMethod) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      lastAuthMethod: null,
      setLastAuthMethod: (method) => set({ lastAuthMethod: method }),
    }),
    {
      name: "preferences",
    }
  )
);
