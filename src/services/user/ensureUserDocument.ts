import { db } from "@/services/database/mongo";
import { User } from "@/shared/types/user";

interface SessionUser {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  id?: string | null;
}

const DEFAULT_USER: Omit<User, "_id"> = {
  email: "",
  name: "",
  image: "",
  isReferred: false,
  currency: 0,
  correctAnswered: 0,
  wrongAnswered: 0,
  points: 0,
  itemsBought: [],
  investors: [],
};

export const ensureUserDocument = async (
  sessionUser?: SessionUser,
): Promise<User | null> => {
  const email = sessionUser?.email;

  if (!email) {
    return null;
  }

  const usersCollection = db.collection<User>("users");

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return existingUser;
  }

  const newUser: Omit<User, "_id"> = {
    ...DEFAULT_USER,
    email,
    name: sessionUser?.name ?? "",
    image: sessionUser?.image ?? "",
    itemsBought: [],
    investors: [],
  };

  const insertResult = await usersCollection.insertOne({
    ...newUser,
    id: sessionUser?.id ?? undefined,
  } as User);

  return await usersCollection.findOne({ _id: insertResult.insertedId });
};
