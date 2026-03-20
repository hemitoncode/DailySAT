---
name: database-dev
description: Expert in MongoDB operations, database schema design, and data modeling for this SAT prep platform. Use when working with user data, practice questions, shop items, or any database-related tasks.
---

# Database Development Agent

Expert guidance for MongoDB operations and database schema design.

## Tech Stack Context

This project uses:

- **MongoDB** with native mongodb driver
- **Upstash Redis** for caching and rate limiting
- Collections: `users`, `math`, `english`

## Database Structure

### Users Collection

```javascript
{
  _id: ObjectId,
  name: string,
  email: string,
  image: string,
  currency: number,           // Coins balance
  points: number,             // Total points earned
  correctAnswers: number,     // Total correct
  wrongAnswers: number,       // Total wrong
  currentStreak: number,      // Daily streak
  longestStreak: number,      // Best streak
  referralCode: string,       // User's referral code
  referredBy: string | null,  // Who referred them
  referralCount: number,      // How many they've referred
  itemsBought: string[],      // Purchased shop items
  studyPlan: StudyPlan | null, // AI study plan
  createdAt: Date,
  updatedAt: Date
}
```

### Math Questions Collection

```javascript
{
  _id: ObjectId,
  category: "advanced-math" | "problem-solving" | "geometry" | "algebra",
  difficulty: "easy" | "medium" | "hard",
  question: string,           // LaTeX supported
  options: string[],          // Answer choices (LaTeX supported)
  correctAnswer: number,      // Index of correct option
  explanation: string,         // Why the answer is correct
  createdAt: Date
}
```

### English Questions Collection

```javascript
{
  _id: ObjectId,
  category: "information-ideas" | "standard-english" | "expression-ideas" | "craft-structure",
  difficulty: "easy" | "medium" | "hard",
  passage: string,            // Reading passage
  question: string,
  options: string[],
  correctAnswer: number,
  explanation: string,
  createdAt: Date
}
```

## Database Connection Pattern

```typescript
// services/database/mongo/index.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL!;
const client = new MongoClient(uri);

export async function getDatabase() {
  await client.connect();
  return client.db("DailySAT");
}

// Usage in API routes
export async function getUsers() {
  const db = await getDatabase();
  return db.collection("users");
}
```

## Common Patterns

### Find User by Email

```typescript
export async function findUserByEmail(email: string) {
  const users = await getUsers();
  return users.findOne({ email });
}
```

### Update User Currency

```typescript
export async function addCoins(userId: string, amount: number) {
  const users = await getUsers();
  return users.updateOne(
    { _id: new ObjectId(userId) },
    { $inc: { currency: amount } },
  );
}
```

### Add Question (Admin)

```typescript
export async function addMathQuestion(
  question: Omit<MathQuestion, "_id" | "createdAt">,
) {
  const math = await getMathQuestions();
  return math.insertOne({
    ...question,
    createdAt: new Date(),
  });
}
```

## Rate Limiting with Redis

```typescript
// services/rate-limiter/index.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function checkRateLimit(identifier: string) {
  const key = `rate:${identifier}`;
  const current = await redis.get<number>(key);

  if (current && current >= 5) {
    return false; // Rate limited
  }

  await redis.incr(key);
  await redis.expire(key, 300); // 5 minutes
  return true;
}
```

## Environment Variables

```env
MONGO_URL=mongodb://localhost:27017/
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your-redis-token
```

## Best Practices

1. **Always use environment variables** for connection strings
2. **Handle connections properly** - Reuse client when possible
3. **Use ObjectId** for MongoDB IDs, not strings
4. **Index frequently queried fields** - email, category, difficulty
5. **Validate data** before inserting/updating
6. **Use projections** to fetch only needed fields
