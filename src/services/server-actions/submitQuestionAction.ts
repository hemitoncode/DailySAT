"use server";

import { QUESTION_IS_CORRECT_POINTS } from "@/shared/data/constant";
import { db } from "@/services/database/mongo";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { Investor } from "@/features/shop/types/investor";
import { ensureUserDocument } from "@/services/user/ensureUserDocument";
import { User } from "@/shared/types/user";

type SubmitQuestionResponse = {
  status: number;
  result?: string;
  error?: string;
  isCorrect?: boolean;
  user?: Partial<User>;
};

export const handleSubmitQuestion = async (
  isCorrect: boolean,
  coinReward?: number,
): Promise<SubmitQuestionResponse> => {
  try {
    const session = await handleGetSession();
    const baseUser = await ensureUserDocument(session?.user);

    if (!baseUser?.email) {
      throw new Error("User email not found in session.");
    }

    const email = baseUser.email;

    const usersColl = db.collection<User>("users");
    let investorRewardBonus = 0;

    const investorItem = baseUser?.investors;

    // Calculate earnings for each investor item
    investorRewardBonus =
      investorItem?.reduce((total: number, investor: Investor) => {
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

    let updatedUser = await usersColl.findOneAndUpdate(
      { email },
      {
        $inc: {
          currency: rewardAmount,
          correctAnswered: correctIncrement,
          wrongAnswered: wrongIncrement,
          points: pointsIncrement,
        },
      },
      { returnDocument: "after", includeResultMetadata: false },
    );

    if (!updatedUser) {
      updatedUser = await usersColl.findOne({ email });
    }

    return {
      status: 200,
      result: "Server action done",
      isCorrect,
      user: updatedUser
        ? {
            currency: updatedUser.currency,
            correctAnswered: updatedUser.correctAnswered,
            wrongAnswered: updatedUser.wrongAnswered,
            points: updatedUser.points,
            itemsBought: updatedUser.itemsBought,
            investors: updatedUser.investors,
            isReferred: updatedUser.isReferred,
          }
        : undefined,
    };
  } catch (error: any) {
    return {
      status: 500,
      error: error.message || "Internal Server Error",
    };
  }
};
