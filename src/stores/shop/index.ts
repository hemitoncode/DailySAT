import { GridType } from "@/features/shop/types/grid";
import { create } from "zustand";

interface GridState {
  grid: GridType;
  setGrid: (newGrid: GridType) => void;
}

export const useGridStore = create<GridState>((set) => ({
  grid: "animal",
  setGrid: (newGrid) => set({ grid: newGrid }),
}));
