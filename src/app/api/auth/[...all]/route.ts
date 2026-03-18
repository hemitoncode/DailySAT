import { auth } from "@/services/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const maxDuration = 60;

export const { POST, GET } = toNextJsHandler(auth);
