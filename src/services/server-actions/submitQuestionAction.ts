"use server";

import { QUESTION_IS_CORRECT_POINTS } from "@/shared/data/constant";
import { db } from "@/services/database/mongo";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { Investor } from "@/features/shop/types/investor";
import { determineLeague } from "@/services/leaderboard/leaderboard/determineLeague";
import { updateLeaderboard } from "@/services/leaderboard/leaderboard/updateLeaderboard";
export const handleSubmitQuestion = async (
  isCorrect: boolean,
  coinReward?: number,
) => {
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

    const rewardAmount = isCorrect
      ? (coinReward ?? QUESTION_IS_CORRECT_POINTS) + investorRewardBonus
      : 0;

    const correctIncrement = isCorrect ? 1 : 0;
    const wrongIncrement = isCorrect ? 0 : 1;
    const pointsIncrement = isCorrect ? 1 : -1;

    await usersColl.updateOne(
      { email },
      {
        $inc: {
          currency: rewardAmount,
          correctAnswered: correctIncrement,
          wrongAnswered: wrongIncrement,
          points: pointsIncrement,
        },
      },
    );
    // Get updated user data for leaderboard
    const updatedUser = await usersColl.findOne({ email });
    const correctAnswered = updatedUser?.correctAnswered ?? 0;
    const wrongAnswered = updatedUser?.wrongAnswered ?? 0;
    const userScore =
      typeof updatedUser?.points === "number"
        ? updatedUser.points
        : correctAnswered - wrongAnswered;
    const league = determineLeague(userScore);
    if (updatedUser && league !== "None") {
      const userData = {
        score: userScore,
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
