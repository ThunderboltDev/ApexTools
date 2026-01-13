import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
  slugs: Set<string>;
  isBookmarked: (slug: string) => boolean;
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      slugs: new Set(),

      isBookmarked: (slug) => get().slugs.has(slug),

      toggle: (slug) =>
        set((state) => {
          const next = new Set(state.slugs);
          next.has(slug) ? next.delete(slug) : next.add(slug);
          return { slugs: next };
        }),

      add: (slug) =>
        set((state) => ({
          slugs: new Set(state.slugs).add(slug),
        })),

      remove: (slug) =>
        set((state) => {
          const next = new Set(state.slugs);
          next.delete(slug);
          return { slugs: next };
        }),

      clear: () => set({ slugs: new Set() }),
    }),
    {
      name: "tool-bookmarks",
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          if (!value) return null;
          const parsed = JSON.parse(value);
          parsed.state.slugs = new Set(parsed.state.slugs);
          return parsed;
        },

        setItem: (key, value) => {
          const serialized = {
            ...value,
            state: {
              ...value.state,
              slugs: Array.from(value.state.slugs),
            },
          };
          localStorage.setItem(key, JSON.stringify(serialized));
        },

        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);
