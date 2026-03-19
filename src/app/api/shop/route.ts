import { ShopItem } from "@/features/shop/types/shopItem";
import { SHOP_ITEM_CATALOG, normalizeShopItemKey } from "@/features/shop/data";
import { db } from "@/services/database/mongo";
import { User } from "@/shared/types/user";
import { handleGetSession } from "@/services/auth/auth/authActions";
import { ensureUserDocument } from "@/services/user/ensureUserDocument";

const ensurePositiveInteger = (value: unknown) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  const floored = Math.floor(parsed);
  return floored > 0 ? floored : 1;
};

const normalizeIncomingItems = (incoming: any[]): ShopItem[] => {
  const now = new Date().toISOString();
  return incoming
    .map((item) => {
      const rawName =
        typeof item?.name === "string"
          ? item.name
          : typeof item?.key === "string"
            ? item.key
            : "";
      const normalizedKey = normalizeShopItemKey(rawName);
      const catalogItem = SHOP_ITEM_CATALOG[normalizedKey];

      if (!catalogItem) {
        return null;
      }

      const quantity = ensurePositiveInteger(item?.amnt ?? item?.qty ?? 1);
      const date =
        typeof item?.date === "string" && item.date.trim().length
          ? item.date
          : now;

      const payload: ShopItem = {
        ...catalogItem,
        amnt: quantity,
        date,
      };

      return payload;
    })
    .filter((item): item is ShopItem => item !== null);
};

const mergeCollections = (base: ShopItem[] = [], additions: ShopItem[]) => {
  const map = new Map<string, ShopItem>();

  base.forEach((item) => {
    if (!item?.name) return;
    const quantity = ensurePositiveInteger(item.amnt ?? 1);
    map.set(item.name, {
      ...item,
      amnt: quantity,
    });
  });

  additions.forEach((item) => {
    const quantity = ensurePositiveInteger(item.amnt ?? 1);
    const existing = map.get(item.name);

    if (existing) {
      map.set(item.name, {
        ...existing,
        amnt: ensurePositiveInteger(existing.amnt ?? 1) + quantity,
        date: item.date ?? existing.date,
        price: item.price ?? existing.price,
        purpose: item.purpose ?? existing.purpose,
      });
    } else {
      map.set(item.name, {
        ...item,
        amnt: quantity,
      });
    }
  });

  return Array.from(map.values());
};

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

    const normalizedItems = normalizeIncomingItems(items);

    if (!normalizedItems.length) {
      return Response.json(
        {
          result: "Invalid purchase request",
        },
        { status: 400 },
      );
    }

    const totalCost = normalizedItems.reduce((sum, item) => {
      const quantity = ensurePositiveInteger(item.amnt ?? 1);
      return sum + item.price * quantity;
    }, 0);

    if (totalCost <= 0) {
      return Response.json({
        result: "Invalid purchase request",
      });
    }

    const MAX_ATTEMPTS = 3;
    let attempts = 0;
    let baseItems = Array.isArray(user.itemsBought) ? user.itemsBought : [];
    let updatedUser: User | null = null;

    while (attempts < MAX_ATTEMPTS) {
      const merged = mergeCollections(baseItems, normalizedItems);

      updatedUser = await users.findOneAndUpdate(
        {
          email: user.email,
          currency: { $gte: totalCost },
          itemsBought: baseItems,
        },
        {
          $inc: { currency: -totalCost },
          $set: { itemsBought: merged },
        },
        { returnDocument: "after", includeResultMetadata: false },
      );

      if (updatedUser) {
        break;
      }

      const refreshedUser = await users.findOne({ email: user.email });
      if (!refreshedUser) {
        break;
      }

      if ((refreshedUser.currency ?? 0) < totalCost) {
        return Response.json(
          {
            result: "Insufficient balance",
          },
          { status: 400 },
        );
      }

      baseItems = Array.isArray(refreshedUser.itemsBought)
        ? refreshedUser.itemsBought
        : [];
      attempts += 1;
    }

    if (!updatedUser) {
      return Response.json(
        {
          result: "Unable to complete purchase",
        },
        { status: 409 },
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
