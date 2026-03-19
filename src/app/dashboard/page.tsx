"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import StatDisplay from "@/features/dashboard/components/StatDisplay";
import Option from "@/features/dashboard/components/Option";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Book, Calendar, Sigma } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { User } from "@/shared/types/user";
import { DisplayBanner } from "@/features/dashboard/types/banner";
import RedeemReferral from "@/features/dashboard/components/RedeemReferral";
import { toast } from "react-toastify";
import { PageHeader } from "@/shared/components";

const Home = () => {
  const [icon, setIcon] = useState("");
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [greeting, setGreeting] = useState("");
  const [imageError, setImageError] = useState(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [banner, setBanner] = useState<DisplayBanner>({
    style: "",
    content: "",
  });

  const getIcon = (userData?: User) => {
    const icons = userData?.itemsBought?.filter((item) =>
      item.name.includes("Icon"),
    );
    if (!icons?.length) return;
    const mostExpensiveIcon = icons.reduce((max, item) =>
      item.price > max.price ? item : max,
    );
    setIcon(mostExpensiveIcon.name.split(" ").join("-").toLowerCase());
  };

  const getBanner = (userData?: User) => {
    const banners = userData?.itemsBought?.filter((item) =>
      item.name.includes("Banner"),
    );
    if (!banners?.length) return;
    const mostExpensiveBanner = banners.reduce((max, item) =>
      item.price > max.price ? item : max,
    );

    const bannerMap: { [key: string]: DisplayBanner } = {
      diamondbanner: {
        style:
          "bg-[#00d3f2] p-4 flex items-center justify-center font-bold text-white shadow-lg text-2xl border-[10px] text-center border-[#a2f4fd] h-[150px] w-full rounded-xl",
        content: "Congratulations on your Diamond Banner",
      },
      emeraldbanner: {
        style:
          "bg-[#009966] p-4 flex items-center justify-center font-bold text-white shadow-lg text-2xl border-[10px] text-center border-[#5ee9b5] h-[150px] w-full rounded-xl",
        content: "Congratulations on your Emerald Banner",
      },
      goldbanner: {
        style:
          "bg-[#FFD700] p-4 flex items-center justify-center font-bold text-white shadow-lg text-2xl border-[10px] text-center border-[#fff085] h-[150px] w-full rounded-xl",
        content: "Congratulations on your Gold Banner",
      },
      bronzebanner: {
        style:
          "bg-[#9E5E23] p-4 flex items-center justify-center font-bold text-white shadow-lg text-2xl border-[10px] text-center border-[#E0AF7D] h-[150px] w-full rounded-xl",
        content: "Congratulations on your Bronze Banner",
      },
    };

    const bannerKey = mostExpensiveBanner?.name
      ?.toLowerCase()
      ?.replace(/\s/g, "");
    if (bannerKey && bannerMap[bannerKey]) setBanner(bannerMap[bannerKey]);
  };

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const response = await axios.get("/api/auth/get-user");
        const userData: User | undefined = response?.data?.user;
        setUserCoins(userData?.currency ?? 0);
        getIcon(userData);
        getBanner(userData);
        setUser?.(userData ?? null);
      } catch {
        toast.error("Sorry, we could not get your user data");
      }
    };
    handleGetUser();
  }, []);

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return "Good morning";
      if (hours < 18) return "Good afternoon";
      return "Good evening";
    };
    setGreeting(getGreeting());
  }, []);

  const handleCopyReferral = async () => {
    const referralCode = user?._id?.toString() ?? "";
    await navigator.clipboard.writeText(referralCode);
  };

  const toggleImageError = () => setImageError((prev) => !prev);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans pb-16">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}</style>

      <PageHeader>
        <PageHeader.Eyebrow>SAT Prep · Dashboard</PageHeader.Eyebrow>
        {user ? (
          <PageHeader.Title>
            {greeting ? `${greeting}` : "Welcome back"},{" "}
            <span className="text-blue-500">{user?.name?.split(" ")[0]}.</span>
          </PageHeader.Title>
        ) : (
          <Skeleton className="w-64 md:w-96 h-12 rounded-full bg-gray-200" />
        )}
        {user ? (
          <PageHeader.Description>
            Choose what to study and start practicing.
          </PageHeader.Description>
        ) : (
          <Skeleton className="w-48 h-4 mt-2 rounded-full bg-gray-200" />
        )}
      </PageHeader>

      <div className="px-8 md:px-16 py-8 space-y-6">
        {/* Quick nav options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user ? (
            <Option
              icon={<Book size={16} />}
              header="English"
              redirect="/practice/english"
            />
          ) : (
            <Skeleton className="w-full h-16 rounded-2xl bg-gray-200" />
          )}
          {user ? (
            <Option
              icon={<Sigma size={16} />}
              header="Math"
              redirect="/practice/math"
            />
          ) : (
            <Skeleton className="w-full h-16 rounded-2xl bg-gray-200" />
          )}
          {user ? (
            <Option
              icon={<Calendar size={16} />}
              header="Study Plan"
              redirect="/dashboard/study-plan"
            />
          ) : (
            <Skeleton className="w-full h-16 rounded-2xl bg-gray-200" />
          )}
        </div>

        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Avatar + info */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {user ? (
                <Image
                  src={
                    (!imageError && user?.image) ||
                    "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg"
                  }
                  alt="userpfpic"
                  width={96}
                  height={96}
                  onError={toggleImageError}
                  className="rounded-2xl border border-gray-200 object-cover"
                />
              ) : (
                <Skeleton className="w-24 h-24 rounded-2xl bg-gray-200" />
              )}
              {icon && (
                <Image
                  src={`/icons/rewards/${icon}.png`}
                  alt="Icon"
                  width={36}
                  height={36}
                  className="absolute -right-3 -top-3"
                />
              )}
            </div>

            <div>
              {user ? (
                <>
                  <p
                    className="text-3xl text-blue-500 leading-tight"
                    style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
                  >
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 font-light mt-0.5">
                    {user?.email}
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="w-40 h-8 rounded-full bg-gray-200" />
                  <Skeleton className="w-32 h-3 mt-2 rounded-full bg-gray-200" />
                </>
              )}
            </div>
          </div>

          {/* Referral code */}
          <div className="lg:mr-12">
            {user ? (
              <div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-1.5">
                  Referral Code
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReferral}
                    className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition"
                    title="Copy referral code"
                  >
                    <Image
                      src="/icons/copy.png"
                      className="w-4 h-4"
                      alt="Copy"
                      width={16}
                      height={16}
                    />
                  </button>
                  <p className="text-sm text-gray-600 font-mono">
                    {user?._id?.toString() ?? "Unavailable"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Skeleton className="w-28 h-4 rounded-full bg-gray-200" />
                <Skeleton className="w-44 h-8 mt-2 rounded-xl bg-gray-200" />
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user ? (
            <StatDisplay
              type="coins"
              color="#3b82f6"
              icon="coin"
              header="DailySAT Coins"
              number={userCoins}
            />
          ) : (
            <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
          )}
          {user ? (
            <StatDisplay
              type="correct"
              color="#22c55e"
              icon="checked"
              header="Correct Answers"
              number={user?.correctAnswered ?? 0}
            />
          ) : (
            <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
          )}
          {user ? (
            <StatDisplay
              type="mistakes"
              color="#ef4444"
              icon="cross"
              header="Mistakes"
              number={user?.wrongAnswered ?? 0}
            />
          ) : (
            <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
          )}
        </div>

        {/* Referral + Shop row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!user?.isReferred && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <RedeemReferral />
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            {user ? (
              <Link href="/shop" className="w-full block">
                <StatDisplay
                  type="items"
                  color="#3b82f6"
                  icon="shop"
                  header="Shop"
                  number={user?.itemsBought?.length ?? 0}
                />
              </Link>
            ) : (
              <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
            )}
          </div>
          {user ? (
            <Link
              href="/dashboard/inventory"
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200"
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-blue-500">
                Collection log
              </p>
              <p
                className="text-3xl leading-tight text-slate-900"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              >
                Visit your vault
              </p>
              <p className="text-sm text-slate-500">
                {user?.itemsBought?.length ?? 0} curated items waiting.
              </p>
              <span className="mt-auto inline-flex items-center text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">
                Open ledger
                <span className="ml-2 text-base">→</span>
              </span>
            </Link>
          ) : (
            <Skeleton className="w-full h-36 rounded-2xl bg-gray-200" />
          )}
        </div>

        {/* Banner */}
        {user?.itemsBought?.some((item) => item.name.includes("Banner")) &&
          banner?.style && (
            <div className={banner.style}>
              <p>
                {banner.content}
                {user?.name ? `, ${user.name.split(" ")[0]}!` : "!"}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;
