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
  /** True while a camera transition between levels is playing. */
  transitioning: boolean;

  setHovered: (info: HoverInfo | null) => void;
  setConstellationName: (name: string | null) => void;
  setTransitioning: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hovered: null,
  constellationName: null,
  transitioning: false,
  setHovered: (hovered) => set({ hovered }),
  setConstellationName: (constellationName) => set({ constellationName }),
  setTransitioning: (transitioning) => set({ transitioning }),
}));
