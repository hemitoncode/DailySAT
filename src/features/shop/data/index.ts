import { ShopItem } from "@/features/shop/types/shopItem";

// Shop Categories Help Text
export const Notes = {
  animal:
    "Collect as many icons as you like—the priciest animal you own is still highlighted across the app.",
};

type ShopCatalogItem = Pick<ShopItem, "name" | "price" | "purpose">;

// Shop Items Configuration
export const Items: { animal: ShopCatalogItem[] } = {
  animal: [
    {
      name: "Cheetah Icon",
      price: 250,
      purpose: "Have a cheetah icon up next to your name on the dashboard!",
    },
    {
      name: "Owl Icon",
      price: 300,
      purpose: "Have an owl icon up next to your name on the dashboard!",
    },
    {
      name: "Shark Icon",
      price: 350,
      purpose: "Have a shark icon up next to your name on the dashboard!",
    },
    {
      name: "Tiger Icon",
      price: 400,
      purpose: "Have a tiger icon up next to your name on the dashboard!",
    },
  ],
};

export const normalizeShopItemKey = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "");

const flattenCatalog = Object.values(Items).flat();

export const SHOP_ITEM_CATALOG: Record<string, ShopCatalogItem> =
  flattenCatalog.reduce(
    (acc, item) => {
      acc[normalizeShopItemKey(item.name)] = item;
      return acc;
    },
    {} as Record<string, ShopCatalogItem>,
  );
