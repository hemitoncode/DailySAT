import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import { useGridStore } from "@/stores/shop";
import { GridType } from "@/features/shop/types/grid";

const tabs: { key: GridType; label: string }[] = [
  { key: "investor", label: "Investor" },
  { key: "animal", label: "Animal Icon" },
  { key: "banners", label: "Banners" },
];

export default function ShopGridTabs() {
  const user = useUserStore((state) => state.user);
  const grid = useGridStore((state) => state.grid);
  const setGrid = useGridStore((state) => state.setGrid);

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        {tabs.map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1 rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setGrid(tab.key)}
          className={`flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl transition ${
            grid === tab.key
              ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
              : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
