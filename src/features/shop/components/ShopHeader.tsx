import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";

export default function ShopHeader() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return (
      <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 rounded-2xl px-8 py-8 flex items-center justify-between relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/10" />
      <div className="absolute top-4 right-24 w-20 h-20 rounded-full border border-white/08" />
      <div className="absolute -bottom-6 right-40 w-28 h-28 rounded-full bg-white/5" />

      <div className="relative z-10">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-200 mb-1">
          Welcome back
        </p>
        <p
          className="text-4xl text-white leading-tight"
          style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
        >
          {user?.name.split(" ").length === 2 ? user.name.split(" ")[0] : user.name}!
        </p>
        <p className="text-sm text-blue-200 font-light mt-1 max-w-xs">
          Pick up something new to help you study and improve your score.
        </p>
      </div>

      <img
        src="assets/shop-graphic.png"
        className="h-24 lg:h-32 absolute -bottom-2 right-6 opacity-90"
        alt="Shop Graphic"
      />
    </div>
  );
}
