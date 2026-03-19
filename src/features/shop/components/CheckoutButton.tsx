"use client";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    try {
      window.dispatchEvent(new CustomEvent("get-items-to-buy"));

      const handleBuyItems = async (e: Event) => {
        const items = (e as CustomEvent<{ items: Record<string, number> }>).detail.items;
        const itemsToBuy = Object.entries(items)
          .filter(([, qty]) => qty > 0)
          .map(([name, qty]) => ({ name, qty }));

        if (!itemsToBuy.length) {
          toast.info("Add items to your cart before checking out.");
          return;
        }

        await axios.post("/api/shop/checkout", { items: itemsToBuy });
        toast.success("Purchase successful!");
        window.removeEventListener("buy-items", handleBuyItems);
      };

      window.addEventListener("buy-items", handleBuyItems);
    } catch {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={handleCheckout}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-px transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Checkout
      </button>
    </div>
  );
}
