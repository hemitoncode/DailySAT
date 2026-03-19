"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { PageHeader } from "@/shared/components";
import { useUserStore } from "@/stores/user";
import { ShopItem } from "@/features/shop/types/shopItem";
import { cn } from "@/utils/utils";

type InventoryCategory = "icons" | "banners" | "investors" | "collectibles";
type FilterKey = InventoryCategory | "all";

const filterOptions: { key: FilterKey; label: string; note: string }[] = [
  { key: "all", label: "All items", note: "Everything you own" },
  { key: "icons", label: "Icons", note: "Dashboard companions" },
  { key: "banners", label: "Banners", note: "Status ribbons" },
  { key: "investors", label: "Investors", note: "Coin drip" },
  { key: "collectibles", label: "Artifacts", note: "Misc rewards" },
];

const categoryStyles: Record<
  InventoryCategory,
  { label: string; badge: string; dot: string }
> = {
  icons: {
    label: "Animal Icon",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-400",
  },
  banners: {
    label: "Banner",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    dot: "bg-sky-400",
  },
  investors: {
    label: "Coin Investor",
    badge: "bg-purple-50 text-purple-700 border-purple-100",
    dot: "bg-purple-400",
  },
  collectibles: {
    label: "Collectible",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-400",
  },
};

const categorizeItem = (item: ShopItem): InventoryCategory => {
  if (/icon/i.test(item.name)) return "icons";
  if (/banner/i.test(item.name)) return "banners";
  if (/investor/i.test(item.name)) return "investors";
  return "collectibles";
};

const formatCoins = (value: number) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} coins`;

const formatDate = (value?: string) => {
  if (!value) return "Date unavailable";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const InventoryPage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [selectedCategory, setSelectedCategory] = useState<FilterKey>("all");
  const [isFetching, setIsFetching] = useState(!user);

  useEffect(() => {
    if (user) {
      setIsFetching(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        setUser?.(response?.data?.user ?? null);
      } catch {
        toast.error("Sorry, we couldn't load your items right now.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [setUser, user]);

  const collection = user?.itemsBought ?? [];

  const heroItem = useMemo(() => {
    if (!collection.length) return null;
    return collection.reduce<ShopItem | null>((current, candidate) => {
      if (!current) return candidate;
      return (candidate.price ?? 0) > (current.price ?? 0)
        ? candidate
        : current;
    }, null);
  }, [collection]);

  const { spent, yieldPerDay, uniqueCategories, topCategory } = useMemo(() => {
    const counts: Record<InventoryCategory, number> = {
      icons: 0,
      banners: 0,
      investors: 0,
      collectibles: 0,
    };
    let lifetimeSpend = 0;
    let investorYield = 0;

    collection.forEach((item) => {
      const category = categorizeItem(item);
      counts[category] += 1;
      lifetimeSpend += item.price ?? 0;
      if (category === "investors") {
        investorYield += item.reward ?? 0;
      }
    });

    const top =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "collectibles";
    const unique = Object.values(counts).filter((count) => count > 0).length;

    return {
      spent: lifetimeSpend,
      yieldPerDay: investorYield,
      uniqueCategories: unique,
      topCategory: top as InventoryCategory,
    };
  }, [collection]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return collection;
    return collection.filter(
      (item) => categorizeItem(item) === selectedCategory,
    );
  }, [collection, selectedCategory]);

  const recentItems = useMemo(() => {
    if (!collection.length) return [];
    return [...collection].slice(-5).reverse();
  }, [collection]);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&display=swap');`}</style>

      <PageHeader>
        <PageHeader.Eyebrow>DailySAT · Inventory</PageHeader.Eyebrow>
        <PageHeader.Title>
          Review your <span className="text-blue-500">collection.</span>
        </PageHeader.Title>
        <PageHeader.Description>
          Every banner, icon, and investor lives here. Keep tabs on what you own
          and what&rsquo;s left to unlock.
        </PageHeader.Description>
      </PageHeader>

      <div className="px-8 md:px-16 py-10 space-y-10">
        {isFetching ? (
          <LoadingVault />
        ) : !collection.length ? (
          <EmptyState />
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Items curated"
                value={`${collection.length}`}
                detail="Unique purchases"
              />
              <StatCard
                label="Lifetime spend"
                value={formatCoins(spent)}
                detail="Invested into boosts"
              />
              <StatCard
                label="Daily coin drip"
                value={yieldPerDay ? `${yieldPerDay} coins/day` : "—"}
                detail="From investor tier"
              />
              <StatCard
                label="Categories owned"
                value={`${uniqueCategories}/4`}
                detail={`${categoryStyles[topCategory].label} is dominant`}
              />
            </section>

            {heroItem && (
              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-500">
                    Spotlight item
                  </p>
                  <h2
                    className="mt-2 text-3xl text-slate-900"
                    style={{ fontFamily: "'Fraunces', 'Caveat', cursive" }}
                  >
                    {heroItem.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {heroItem.purpose}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span className="rounded-full border border-gray-200 px-3 py-1">
                      {categoryStyles[categorizeItem(heroItem)].label}
                    </span>
                    <span className="rounded-full border border-gray-200 px-3 py-1">
                      {formatCoins(heroItem.price ?? 0)}
                    </span>
                    {heroItem.amnt && (
                      <span className="rounded-full border border-gray-200 px-3 py-1">
                        Qty {heroItem.amnt}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-600">
                    Ledger recap
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCoins(spent)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Total coins spent so far
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {yieldPerDay
                            ? `${yieldPerDay} coins/day`
                            : "Investor upgrade pending"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Passive income from investor tier
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {categoryStyles[topCategory].label}
                        </p>
                        <p className="text-xs text-slate-500">
                          Most collected category
                        </p>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href="/shop"
                    className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600"
                  >
                    Visit the Shop
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-500">
                    Filter inventory
                  </p>
                  <p className="text-sm text-slate-500">
                    Tap to narrow your view.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedCategory(option.key)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-left transition",
                        selectedCategory === option.key
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-white text-slate-600 hover:border-gray-300",
                      )}
                    >
                      <p className="text-xs font-semibold tracking-[0.2em] uppercase">
                        {option.label}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {option.note}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item, index) => (
                  <InventoryCard
                    key={`${item.name}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-500">
                    Recent additions
                  </p>
                  <p className="text-sm text-slate-500">
                    The last five rewards you grabbed.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-blue-600"
                >
                  Go to shop →
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {recentItems.map((item, index) => (
                  <div
                    key={`${item.name}-recent-${index}`}
                    className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-none last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-slate-600">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {categoryStyles[categorizeItem(item)].label}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {formatCoins(item.price ?? 0)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDate(item.date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const InventoryCard = ({ item, index }: { item: ShopItem; index: number }) => {
  const category = categorizeItem(item);
  const styles = categoryStyles[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold",
            styles.badge,
          )}
        >
          {styles.label}
        </span>
        <span className="text-xs font-semibold text-slate-400">
          #{index + 1}
        </span>
      </div>
      <h3
        className="mt-4 text-2xl text-slate-900"
        style={{ fontFamily: "'Fraunces', 'Caveat', cursive" }}
      >
        {item.name}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{item.purpose}</p>
      <div className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span className="rounded-full border border-gray-200 px-3 py-1">
          {formatCoins(item.price ?? 0)}
        </span>
        {item.amnt && (
          <span className="rounded-full border border-gray-200 px-3 py-1">
            Qty {item.amnt}
          </span>
        )}
        {item.reward && (
          <span className="rounded-full border border-gray-200 px-3 py-1">
            +{item.reward} coins / day
          </span>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-500">
      {label}
    </p>
    <p
      className="mt-2 text-3xl text-slate-900"
      style={{ fontFamily: "'Fraunces', 'Caveat', cursive" }}
    >
      {value}
    </p>
    <p className="text-sm text-slate-500">{detail}</p>
  </div>
);

const LoadingVault = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-3xl border border-gray-200 bg-white animate-pulse"
        />
      ))}
    </div>
    <div className="h-64 rounded-3xl border border-gray-200 bg-white animate-pulse" />
    <div className="h-80 rounded-3xl border border-gray-200 bg-white animate-pulse" />
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center shadow-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-blue-500">
      No items yet
    </p>
    <p
      className="mt-3 text-3xl text-slate-900"
      style={{ fontFamily: "'Fraunces', 'Caveat', cursive" }}
    >
      Start filling your vault
    </p>
    <p className="mt-2 text-sm text-slate-500">
      Purchases from the shop will appear here instantly. Icons, banners,
      investors… grab your first one to unlock this ledger.
    </p>
    <Link
      href="/shop"
      className="mt-6 inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-600"
    >
      Browse the shop →
    </Link>
  </div>
);

export default InventoryPage;
