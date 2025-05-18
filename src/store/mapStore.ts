import { create } from "zustand";

interface Point {
  lat: number;
  lon: number;
}

interface MapStore {
  selectedPoint: Point | null;
  setSelectedPoint: (point: Point) => void
}

export const useMapStore = create<MapStore>((set) => ({
  selectedPoint: null,
  setSelectedPoint: (point) => set({ selectedPoint: point }),
}));
