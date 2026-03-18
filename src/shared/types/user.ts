// User interface representing a user in the system

import { ShopItem } from "@/features/shop/types/shopItem";
import { Investor } from "@/features/shop/types/investor";

export interface User {
  // MongoDB string
  _id?: string;
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
  investors?: Investor[];

  // Points for leaderboard
  points: number;
}
