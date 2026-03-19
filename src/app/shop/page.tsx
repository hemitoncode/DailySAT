"use client";
import React, { useEffect } from "react";
import UserCoinDisplay from "@/features/shop/components/UserCoinDisplay";
import ItemGrid from "@/features/shop/components/ItemGrid";
import CheckoutButton from "@/features/shop/components/CheckoutButton";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { User } from "@/shared/types/user";
import { toast } from "react-toastify";
import { PageHeader } from "@/shared/components";

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
        toast.error(
          "Sorry, we couldn't retrieve your user account, please try again later",
        );
      }
    };
    handleGetUser();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-24">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      <PageHeader>
        <PageHeader.Eyebrow>DailySAT · Store</PageHeader.Eyebrow>
        {!user ? (
          <Skeleton className="w-64 h-12 rounded-full bg-gray-200" />
        ) : (
          <PageHeader.Title>
            Browse the <span className="text-blue-500">shop.</span>
          </PageHeader.Title>
        )}
        {!user ? (
          <Skeleton className="w-48 h-4 mt-2 rounded-full bg-gray-200" />
        ) : (
          <PageHeader.Description>
            Buy items to enhance your study experience and boost your SAT score.
          </PageHeader.Description>
        )}
      </PageHeader>

      <div className="px-8 md:px-16 py-8">
        <ItemGrid />
      </div>

      <CheckoutButton />
      <UserCoinDisplay />
    </div>
  );
}
