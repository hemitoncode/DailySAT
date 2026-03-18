import React from "react";
import { Button } from "@/shared/components/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserStore } from "@/stores/user";
import { useGridStore } from "@/stores/shop"; // <-- import the grid store
import { GridType } from "@/features/shop/types/grid";

export default function ShopGridTabs() {
    const user = useUserStore((state) => state.user);
    const grid = useGridStore((state) => state.grid);
    const setGrid = useGridStore((state) => state.setGrid);

    const tabs = ["investor", "animal", "banners"];

    if (!user) {
        return (
            <div className="md:w-[600px] w-[350px] mx-auto h-[80px] flex items-center justify-between mt-4">
                {tabs.map((_, i) => (
                    <Skeleton key={i} className="h-[40px] w-1/3 bg-[#4D68C3] rounded-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="md:w-[600px] w-[350px] mx-auto h-[80px] flex items-center justify-between mt-4">
            {tabs.map((tab) => (
                <Button
                    key={tab}
                    onClick={() => setGrid(tab as GridType)}
                    className={`${
                        grid !== tab ? "bg-[#4D68C3] text-white" : ""
                    } rounded-full px-4 py-2 w-1/3`}
                >
                    {tab === "animal" ? "Animal Icon" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
            ))}
        </div>
    );
}
