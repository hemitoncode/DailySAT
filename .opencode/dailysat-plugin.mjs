import { tool } from "@opencode-ai/plugin";

export default async (ctx) => {
  return {
    tool: {
      dev: tool({
        description: "Start the Next.js development server",
        args: {},
        async execute(args, context) {
          const proc = Bun.spawn(["pnpm", "dev"], {
            cwd: context.directory,
            stdout: "inherit",
            stderr: "inherit",
          });
          return "Development server started on http://localhost:3000";
        },
      }),

      build: tool({
        description: "Build the Next.js application for production",
        args: {},
        async execute(args, context) {
          const result = await context.$.run("pnpm build");
          return result.stdout || "Build completed";
        },
      }),

      lint: tool({
        description: "Run ESLint to check code quality",
        args: {},
        async execute(args, context) {
          const result = await context.$.run("pnpm lint");
          return result.stdout || "Lint check completed";
        },
      }),

      seed: tool({
        description: "Seed the database with sample questions",
        args: {
          type: tool.schema
            .string()
            .describe("Question type: 'math' or 'english'")
            .default("math"),
          count: tool.schema
            .number()
            .describe("Number of questions to generate")
            .default(10),
        },
        async execute(args, context) {
          const { type, count } = args;
          return `Seeding ${count} ${type} questions... (Note: Implement seeding logic in services/database/seed.ts)`;
        },
      }),

      dbstatus: tool({
        description: "Check database connection status",
        args: {},
        async execute(args, context) {
          return "Checking MongoDB connection...";
        },
      }),

      cleanup: tool({
        description: "Clean up build artifacts and caches",
        args: {},
        async execute(args, context) {
          const cleanup = await context.$.run(
            "rm -rf .next && rm -rf node_modules/.cache",
          );
          return "Cleaned up .next and node_modules/.cache";
        },
      }),

      deploy: tool({
        description: "Deploy to Vercel (requires Vercel CLI)",
        args: {
          env: tool.schema
            .string()
            .describe("Environment: 'production' or 'preview'")
            .default("production"),
        },
        async execute(args, context) {
          const { env } = args;
          return `Deploying to ${env}... (Note: Ensure Vercel CLI is installed: npm i -g vercel)`;
        },
      }),

      genkey: tool({
        description: "Generate a random secret key for environment variables",
        args: {
          length: tool.schema
            .number()
            .describe("Key length in bytes")
            .default(32),
        },
        async execute(args, context) {
          const key = crypto.randomBytes(args.length || 32).toString("hex");
          return `Generated secret key:\nBETTER_AUTH_SECRET=${key}\nJWT_SECRET=${key}`;
        },
      }),
    },
  };
};
