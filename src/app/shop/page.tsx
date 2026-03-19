"use client";
import React, { useEffect } from "react";
import UserCoinDisplay from "@/features/shop/components/UserCoinDisplay";
import ShopHeader from "@/features/shop/components/ShopHeader";
import ShopGridTabs from "@/features/shop/components/ShopGridTabs";
import ItemGrid from "@/features/shop/components/ItemGrid";
import CheckoutButton from "@/features/shop/components/CheckoutButton";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { User } from "@/shared/types/user";
import { toast } from "react-toastify";

export default function Shop() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        const userData: User | undefined = response?.data?.user;
        setUser?.(userData ?? null);
      } catch {
        toast.error("Sorry, we couldn't retrieve your user account, please try again later");
      }
    };
    handleGetUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400" />

      {/* Page header */}
      <div className="w-full bg-white border-b border-gray-200 px-8 md:px-16 py-8">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-blue-500 mb-1">
          DailySAT · Store
        </p>
        {!user ? (
          <Skeleton className="w-64 h-12 rounded-full bg-gray-200" />
        ) : (
          <h1
            className="text-4xl md:text-5xl text-gray-900 leading-tight"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
          >
            Browse the{" "}
            <span className="text-blue-500">shop.</span>
          </h1>
        )}
        {!user ? (
          <Skeleton className="w-48 h-4 mt-2 rounded-full bg-gray-200" />
        ) : (
          <p className="text-sm text-gray-500 font-light mt-1">
            Buy items to enhance your study experience and boost your SAT score.
          </p>
        )}
      </div>

      <div className="px-8 md:px-16 py-8 space-y-6">
        <ShopHeader />
        <ShopGridTabs />
        <ItemGrid />
      </div>

      <CheckoutButton />
      <UserCoinDisplay />
    </div>
  );
}
