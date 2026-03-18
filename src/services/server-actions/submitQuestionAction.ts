"use server";

import { QUESTION_IS_CORRECT_POINTS } from "@/shared/data/constant";
import { db } from "@/services/database/mongo";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { Investor } from "@/features/shop/types/investor";
import { determineLeague } from "@/services/leaderboard/leaderboard/determineLeague";
import { updateLeaderboard } from "@/services/leaderboard/leaderboard/updateLeaderboard";
export const handleSubmitQuestion = async (isCorrect: boolean) => {
  try {
    const session = await handleGetSession();
    const email = session?.user?.email;

    if (!email) {
      throw new Error("User email not found in session.");
    }

    const usersColl = db.collection("users");
    let investorRewardBonus = 0;

    const investorItem = await usersColl.findOne<{ investors: Investor[] }>(
      { email },
      { projection: { investors: 1 } },
    );

    // Calculate earnings for each investor item
    investorRewardBonus =
      investorItem?.investors.reduce((total: number, investor: Investor) => {
        const amnt = investor.amnt ?? 1;
        const reward = investor.reward ?? 0;
        return total + amnt * reward;
      }, 0) ?? 0;

    await usersColl.updateOne(
      { email },
      {
        $inc: {
          currency: isCorrect
            ? QUESTION_IS_CORRECT_POINTS + investorRewardBonus
            : 0,
          correctAnswered: isCorrect ? 1 : 0,
          wrongAnswered: !isCorrect ? 1 : 0,
        },
      },
    );
    // Get updated user data for leaderboard
    const updatedUser = await usersColl.findOne({ email });
    const league = determineLeague(updatedUser?.points);
    if (updatedUser && league !== "None") {
      const userData = {
        score: updatedUser.points,
        username: updatedUser.name || "Anonymous User",
        league: league,
      };

      // Update leaderboard
      await updateLeaderboard(db, league, userData);
    }

    return {
      status: 200,
      result: "Server action done",
      isCorrect,
    };
  } catch (error: any) {
    return {
      status: 500,
      error: error.message || "Internal Server Error",
    };
  }
};
