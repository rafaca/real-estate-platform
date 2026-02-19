import { create } from "zustand";

interface SearchState {
  // Map interaction state
  hoveredListingId: string | null;
  selectedListingId: string | null;
  mapBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;

  // View mode
  viewMode: "list" | "map" | "split";

  // Actions
  setHoveredListingId: (id: string | null) => void;
  setSelectedListingId: (id: string | null) => void;
  setMapBounds: (bounds: SearchState["mapBounds"]) => void;
  setViewMode: (mode: SearchState["viewMode"]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  hoveredListingId: null,
  selectedListingId: null,
  mapBounds: null,
  viewMode: "split",

  setHoveredListingId: (id) => set({ hoveredListingId: id }),
  setSelectedListingId: (id) => set({ selectedListingId: id }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
