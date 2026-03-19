import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

const missingEnvMessage =
  "Upstash Redis disabled: REDIS_URL and REDIS_TOKEN must be configured";

export const getRedisClient = () => {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(missingEnvMessage);
    }
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis({ url, token });
  }

  return redisClient;
};
