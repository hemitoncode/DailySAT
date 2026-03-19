import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Items, Notes } from "@/features/shop/data/index";
import ShopItemDisplay from "@/features/shop/components/ShopItem";
import { ShopItem } from "@/features/shop/types/shopItem";
import { useGridStore } from "@/stores/shop";
import { useUserStore } from "@/stores/user";

export default function ItemGrid() {
  const user = useUserStore((state) => state.user);
  const grid = useGridStore((state) => state.grid);

  if (!user || user.currency === -1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="w-full h-48 rounded-2xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      {Notes[grid] && (
        <p className="text-xs font-medium text-gray-400 text-center tracking-wide">
          {Notes[grid]}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Items[grid].map((item: ShopItem, index: number) => (
          <ShopItemDisplay
            key={index}
            name={item.name}
            purpose={item.purpose}
            price={item.price}
          />
        ))}
      </div>
    </>
  );
}
