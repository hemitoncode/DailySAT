import { ShopItem } from "@/features/shop/types/shopItem";
import { db } from "@/services/database/mongo";
import { User } from "@/shared/types/user";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { ensureUserDocument } from "@/services/user/ensureUserDocument";

/**
 * Appends an array of items to a user's "itemsBought" array.
 * @param email - The email of the user.
 * @param items - An array of items to append to the itemsBought array.
 */

export const POST = async (request: Request) => {
  const { items } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({
      result: "Items must be a non-empty array",
    });
  }

  try {
    const session = await handleGetSession();
    const user = await ensureUserDocument(session?.user);

    if (!user?.email) {
      return Response.json(
        {
          result: "User not authenticated",
        },
        { status: 401 },
      );
    }

    const users = db.collection<User>("users");

    const totalCost = items.reduce((sum, item: ShopItem) => {
      const quantity = item.amnt ?? 1;
      return sum + item.price * quantity;
    }, 0);

    if (totalCost <= 0) {
      return Response.json({
        result: "Invalid purchase request",
      });
    }

    const updateDoc: any = {
      $inc: { currency: -totalCost },
      $push: {
        itemsBought: {
          $each: items,
        },
      },
    };

    const updatedUser = await users.findOneAndUpdate(
      { email: user.email, currency: { $gte: totalCost } },
      updateDoc,
      { returnDocument: "after", includeResultMetadata: false },
    );

    if (!updatedUser) {
      return Response.json(
        {
          result: "Insufficient balance",
        },
        { status: 400 },
      );
    }

    return Response.json({
      result: "Success - items bought",
      user: {
        currency: updatedUser.currency,
        itemsBought: updatedUser.itemsBought,
      },
    });
  } catch {
    return Response.json(
      {
        result: "DB Error",
      },
      { status: 500 },
    );
  }
};
