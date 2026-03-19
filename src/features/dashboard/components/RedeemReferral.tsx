import axios from "axios";
import React from "react";
import Header from "./Header";

const RedeemReferral = () => {
  const redeemReferralBonus = async () => {
    const referralCode = prompt("Enter a referral code:");
    if (referralCode) {
      try {
        await axios.post("/api/redeem-referral", { referralCode });
      } catch {
        alert("An error occurred while redeeming the reward.");
      }
    }
  };

  return (
    <div className="w-full">
      <Header title="DailySAT Referral" icon="gift" />
      <p className="text-sm text-gray-500 font-light leading-relaxed mb-6">
        Redeem{" "}
        <span className="font-semibold text-blue-500">250 coins</span>{" "}
        by using a friend's referral code.
      </p>
      <button
        onClick={redeemReferralBonus}
        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-px"
      >
        Redeem Reward
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
};

export default RedeemReferral;
