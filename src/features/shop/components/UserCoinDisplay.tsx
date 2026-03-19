import React, { useEffect, useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import axios from "axios";

export default function UserCoinDisplay() {
  const user = useUserStore((state) => state.user);
  const [coins, setCoins] = useState(-1);

  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get("/api/auth/get-user");
        const userDoc = await res.data.user;
        setCoins(userDoc.currency ?? -1);
      } catch {
        setCoins(-1);
      }
    };
    fetchUserDoc();

    const handleUserUpdate = (e: Event) => {
      const price = (e as CustomEvent<{ price: number }>).detail.price;
      setCoins((prev) => prev + price);
    };
    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {coins !== -1 ? (
        <div className="flex items-center gap-2 bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/30">
          <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z" />
          </svg>
          {coins} coins
        </div>
      ) : (
        <Skeleton className="h-10 w-24 rounded-xl bg-blue-200" />
      )}
    </div>
  );
}
