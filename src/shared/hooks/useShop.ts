import { create } from "zustand";
import { SHOP_ITEM_CATALOG, normalizeShopItemKey } from "@/features/shop/data";
import { useUserStore } from "@/stores/user";

type CartState = Record<string, number>;

const catalogKeys = Object.keys(SHOP_ITEM_CATALOG);

const createInitialState = (): CartState => {
  const state: CartState = {};
  catalogKeys.forEach((key) => {
    state[key] = 0;
  });
  return state;
};

interface ShopStore {
  cart: CartState;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  clear: () => void;
}

const useShopStore = create<ShopStore>((set, get) => ({
  cart: createInitialState(),
  increment: (rawKey) => {
    const itemKey = normalizeShopItemKey(rawKey);
    const price = SHOP_ITEM_CATALOG[itemKey]?.price;
    const { user, setUser } = useUserStore.getState();

    if (!price || !user || user.currency < price) {
      return;
    }

    set((state) => ({
      cart: {
        ...state.cart,
        [itemKey]: (state.cart[itemKey] || 0) + 1,
      },
    }));

    setUser({
      ...user,
      currency: user.currency - price,
    });
  },
  decrement: (rawKey) => {
    const itemKey = normalizeShopItemKey(rawKey);
    const price = SHOP_ITEM_CATALOG[itemKey]?.price;
    const { user, setUser } = useUserStore.getState();
    const currentCount = get().cart[itemKey] || 0;

    if (!price || !user || currentCount <= 0) {
      return;
    }

    set((state) => ({
      cart: {
        ...state.cart,
        [itemKey]: currentCount - 1,
      },
    }));

    setUser({
      ...user,
      currency: user.currency + price,
    });
  },
  clear: () => set({ cart: createInitialState() }),
}));

export const useShop = () => {
  const state = useShopStore((store) => store.cart);
  const increment = useShopStore((store) => store.increment);
  const decrement = useShopStore((store) => store.decrement);
  const clear = useShopStore((store) => store.clear);

  return {
    state,
    increment,
    decrement,
    clear,
  };
};
