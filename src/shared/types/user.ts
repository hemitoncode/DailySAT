// User interface representing a user in the system

import { ShopItem } from "@/features/shop/types/shopItem";
import { ObjectId } from "mongodb";

export interface User {
  // MongoDB string
  _id?: string | ObjectId;
  id?: string;
  email: string;
  name: string;
  image: string;
  isReferred: boolean;

  // Currency
  currency: number;

  // Questions answered
  correctAnswered: number;
  wrongAnswered: number;
  // Items bought
  itemsBought: ShopItem[];

  // Performance points
  points: number;
}
