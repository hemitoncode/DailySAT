export const runtime = "edge";

import { Ratelimit } from "@upstash/ratelimit";
import { getRedisClient } from "@/services/database/redis";

const redis = getRedisClient();

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(5, "5 m", 5),
    })
  : null;

export const handleRatelimitSuccess = async (session: any | null) => {
  const email = session?.user?.email;

  if (!ratelimit || !email) return "not-reached";

  const { success } = await ratelimit.limit(email);
  return success ? "not-reached" : "reached";
};
