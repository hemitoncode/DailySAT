import { db } from "@/services/database/mongo";
import { ObjectId } from "mongodb";
import { BONUS_REFERRED_PERSON, BONUS_REFERRER } from "@/shared/data/constant";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { ensureUserDocument } from "@/services/user/ensureUserDocument";

/**
 * @swagger
 * /api/referral:
 *   post:
 *     summary: Update referral information
 *     description: Updates the referral information for a referred person and a referee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_referred:
 *                 type: string
 *                 description: Email of the referred person
 *               id_referee:
 *                 type: string
 *                 description: ID of the referee
 *     responses:
 *       200:
 *         description: Referral information updated successfully
 *       400:
 *         description: Invalid referral code or error in reading request JSON
 *       500:
 *         description: Error in connecting with the MongoDB client
 */

export const POST = async (request: Request) => {
  const body = await request.json();

  // The referralCode is the referrer's UID by design
  const referralCode = body.referralCode;

  if (!referralCode) {
    return Response.json({
      code: 400,
      message: "Referral code is required.",
    });
  }

  if (!ObjectId.isValid(referralCode)) {
    return Response.json({
      code: 400,
      message: "Invalid referral code.",
    });
  }

  const session = await handleGetSession();
  const currentUser = await ensureUserDocument(session?.user);

  if (!currentUser?.email) {
    return Response.json({
      code: 401,
      message: "User is not authenticated.",
    });
  }

  try {
    // Check if the referee exists
    const referee = await db
      .collection("users")
      .findOne({ _id: new ObjectId(referralCode) });

    if (!referee) {
      return Response.json({
        code: 400,
        message: "Invalid referral code.",
      });
    }

    if (currentUser._id && currentUser._id.toString() === referralCode) {
      return Response.json({
        code: 400,
        message: "You cannot use your own referral code.",
      });
    }

    if (currentUser.isReferred) {
      return Response.json({
        code: 400,
        message: "Referral already used. Cannot perform this action twice.",
      });
    }

    await db.collection("users").findOneAndUpdate(
      { email: currentUser.email },
      {
        $inc: { currency: BONUS_REFERRED_PERSON },
        $set: { isReferred: true },
      },
    );

    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(referralCode) },
        { $inc: { currency: BONUS_REFERRER } },
      );

    return Response.json({
      code: 200,
      message: "Referral code redeemed successfully.",
    });
  } catch (error) {
    return Response.json({
      code: 500,
      message: error,
    });
  }
};
