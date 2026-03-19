// UI Components and Icons
import { Minus, Plus } from "lucide-react";

// Types
import { DisplayBanner } from "@/features/dashboard/types/banner";
import Image from "next/image";
import { useShop } from "@/hooks/useShop";
import { ShopItem } from "@/features/shop/types/shopItem";
import { useUserStore } from "@/stores/user";
import { useEffect } from "react";

interface ComponentShopItem {
  name: string;
  purpose: string;
  price: number;
  dispatch?: (_action: { type: string; payload?: string }) => void;
}

const ShopItemDisplay: React.FC<ComponentShopItem> = ({
  name,
  purpose,
  price,
}) => {
  const { state, increment, decrement } = useShop();
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    const handleGetItems = (e: Event) => {
      window.dispatchEvent(
        new CustomEvent("buy-items", { detail: { items: state } }),
      );
    };
    window.addEventListener("get-items-to-buy", handleGetItems);
    return () => window.removeEventListener("get-items-to-buy", handleGetItems);
  }, [state]);

  const bannerMap: { [key: string]: DisplayBanner } = {
    diamondbanner: {
      style:
        "bg-[#00d3f2] p-1 flex items-center justify-center font-bold text-white shadow-lg border-[4px] text-center border-[#a2f4fd] w-[80px] h-[30px] absolute top-3 right-3 rounded-xl",
      content: "Congratulations on your Diamond Banner",
    },
    emeraldbanner: {
      style:
        "bg-[#009966] p-1 flex items-center justify-center font-bold text-white shadow-lg border-[4px] text-center border-[#5ee9b5] w-[80px] h-[30px] absolute top-3 right-3 rounded-xl",
      content: "Congratulations on your Emerald Banner",
    },
    goldbanner: {
      style:
        "bg-[#FFD700] p-1 flex items-center justify-center font-bold text-white shadow-lg border-[4px] text-center border-[#fff085] w-[80px] h-[30px] absolute top-3 right-3 rounded-xl",
      content: "Congratulations on your Gold Banner",
    },
    bronzebanner: {
      style:
        "bg-[#9E5E23] p-1 flex items-center justify-center font-bold text-white shadow-lg border-[4px] text-center border-[#E0AF7D] w-[80px] h-[30px] absolute top-3 right-3 rounded-xl",
      content: "Congratulations on your Bronze Banner",
    },
  };

  const itemKey = name.toLowerCase().replace(/\s/g, "");
  const qty = state[itemKey] ?? 0;

  const isIncrementDisabled =
    !user ||
    price > (user?.currency ?? 0) ||
    (user?.itemsBought?.some((item: ShopItem) => item.name === name) ??
      false) ||
    qty === 1;

  const isDecrementDisabled = qty === 0;

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
      {/* Icon badge */}
      {name.includes("Icon") && (
        <Image
          src={`/icons/rewards/${name.toLowerCase().split(" ").join("-")}.png`}
          alt="Icon"
          width={44}
          height={44}
          className="absolute -right-3 -top-3 z-10"
        />
      )}

      {/* Banner swatch */}
      {name.includes("Banner") && <div className={bannerMap[itemKey]?.style} />}

      {/* Item info */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-1">
          {name.includes("Banner")
            ? "Banner"
            : name.includes("Icon")
              ? "Icon"
              : "Item"}
        </p>
        <h2 className="text-lg font-bold text-gray-900 leading-tight">
          {name}
        </h2>
        <p className="text-sm text-gray-500 font-light mt-1">
          {purpose || "No description available."}
        </p>
      </div>

      {/* Price + quantity row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-0.5">
            Price
          </p>
          <p className="text-xl font-bold text-blue-500 leading-none">
            {price}
            <span className="text-xs font-medium text-gray-400 ml-1">
              coins
            </span>
          </p>
        </div>

        {/* Qty stepper */}
        <div className="flex items-center gap-3 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2">
          <button
            onClick={() => {
              if (isDecrementDisabled) return;
              decrement(name);
              window.dispatchEvent(
                new CustomEvent("user-updated", { detail: { price } }),
              );
            }}
            disabled={isDecrementDisabled}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
              isDecrementDisabled
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <Minus size={14} />
          </button>

          <span className="text-xl font-bold text-gray-900 w-6 text-center leading-none">
            {qty}
          </span>

          <button
            onClick={() => {
              if (isIncrementDisabled) return;
              increment(name);
              window.dispatchEvent(
                new CustomEvent("user-updated", { detail: { price: -price } }),
              );
            }}
            disabled={isIncrementDisabled}
            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
              isIncrementDisabled
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopItemDisplay;
