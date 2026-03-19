"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useShop } from "@/hooks/useShop";
import { SHOP_ITEM_CATALOG } from "@/features/shop/data";
import { ShopItem } from "@/features/shop/types/shopItem";
import { useUserStore } from "@/stores/user";

export default function CheckoutButton() {
  const { state, clear } = useShop();
  const updateUser = useUserStore((s) => s.updateUser);

  const handleCheckout = async () => {
    const itemsToBuy = Object.entries(state)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => {
        const catalogItem = SHOP_ITEM_CATALOG[key];
        if (!catalogItem) {
          return null;
        }
        const payload: ShopItem = {
          ...catalogItem,
          amnt: qty,
          date: new Date().toISOString(),
        };
        return payload;
      })
      .filter((item): item is ShopItem => item !== null);

    if (!itemsToBuy.length) {
      toast.info("Add items to your cart before checking out.");
      return;
    }

    try {
      const response = await axios.post("/api/shop", { items: itemsToBuy });
      const updatedUser = response?.data?.user;
      if (updatedUser) {
        updateUser?.({
          currency: updatedUser.currency,
          itemsBought: updatedUser.itemsBought,
        });
      }
      clear();
      toast.success("Purchase successful!");
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.result
          ? error.response.data.result
          : "Checkout failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleCheckout}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-px transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Checkout
      </button>
    </div>
  );
}
