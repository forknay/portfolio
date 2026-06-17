import { create } from "zustand";

/** What the corner subtitle should show when hovering a star/planet. */
export interface HoverInfo {
  name: string;
  subtitle: string;
  /** Accent colour for the little marker. */
  color: string;
}

interface UIState {
  hovered: HoverInfo | null;
  /** Name of the constellation currently shown on the landing page. */
  constellationName: string | null;

  setHovered: (info: HoverInfo | null) => void;
  setConstellationName: (name: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hovered: null,
  constellationName: null,
  setHovered: (hovered) => set({ hovered }),
  setConstellationName: (constellationName) => set({ constellationName }),
}));
