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
      } catch (error) {
        toast.error(
          "Sorry, we couldn't retrieve your user account, please try again later"
        );
      }
    };
    handleGetUser();
  }, []);

  return (
    <div className="px-4">
      {!user ? <></> : <UserCoinDisplay />}

      <div className="flex lg:flex-row flex-col items-center lg:space-y-0 space-y-2 lg:space-x-4">
        <ShopHeader />
        <ShopGridTabs />
      </div>

      <div className="text-center mt-4">
        {!user ? (
          <>
            <Skeleton className="h-[40px] mx-auto w-[200px] rounded-3xl bg-black/80" />
            <Skeleton className="h-[30px] mt-2 mx-auto w-[300px] rounded-3xl bg-black/60" />
          </>
        ) : (
          <>
            <h3 className="font-bold text-3xl">DailySAT Shop</h3>
            <p className="font-thin">
              Browse & see what&apos;s interesting to you!
            </p>
          </>
        )}
      </div>

      <ItemGrid />
      <CheckoutButton />
    </div>
  );
}
