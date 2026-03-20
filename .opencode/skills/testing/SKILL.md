---
name: testing
description: Expert in testing strategies, test setup, and best practices for this Next.js/React application. Use when writing tests, debugging test failures, or improving test coverage.
---

# Testing Agent

Expert guidance for testing Next.js applications and React components.

## Tech Stack Context

This project uses:

- **Next.js 15** with React 18
- **TypeScript** with strict typing
- **Jest** (likely) or **Vitest** for unit testing
- **React Testing Library** for component testing
- **Playwright** or **Cypress** for E2E testing

## Testing Pyramid

```
        ┌─────────────┐
        │     E2E     │  Few, slow, comprehensive
        │   (Playwright)│
        ├─────────────┤
        │ Integration │  API routes, full components
        ├─────────────┤
        │    Unit     │  Many, fast, focused
        │   (Jest)    │
        └─────────────┘
```

## Project Test Structure

```
src/
├── __tests__/           # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── components/
│   └── Component.test.tsx
└── lib/
    └── utils.test.ts
```

## Unit Testing

### Setup

```typescript
// jest.config.ts or vitest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = createJestConfig(config);
```

### Testing Utils

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
```

### Component Test Example

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Hook Test Example

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "../hooks/useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("decrements", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});
```

### Zustand Store Test

```typescript
// stores/user/user.test.ts
import { renderHook, act } from "@testing-library/react";
import { useUserStore } from "../stores/user/user";

describe("useUserStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useUserStore.setState({ currency: 0, points: 0 });
  });

  it("adds currency", () => {
    const { result } = renderHook(() => useUserStore());

    act(() => {
      useUserStore.getState().addCurrency(50);
    });

    expect(result.current.currency).toBe(50);
  });

  it("tracks correct answers", () => {
    act(() => {
      useUserStore.getState().incrementCorrect();
    });

    const state = useUserStore.getState();
    expect(state.correctAnswers).toBe(1);
  });
});
```

### Utility Function Test

```typescript
// lib/utils.test.ts
import { cn } from "./utils";

describe("cn (classname utility)", () => {
  it("merges class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("handles undefined/false values", () => {
    const result = cn("base", undefined, false, "final");
    expect(result).toBe("base final");
  });
});
```

## Integration Testing

### API Route Test

```typescript
// app/api/questions/route.test.ts
import { NextRequest } from "next/server";

// Mock the database
jest.mock("@/services/database/mongo", () => ({
  getQuestions: jest
    .fn()
    .mockResolvedValue([
      { _id: "1", question: "What is 2+2?", category: "algebra" },
    ]),
}));

describe("GET /api/questions", () => {
  it("returns questions list", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toHaveLength(1);
  });
});
```

### Server Action Test

```typescript
// actions/submitAnswer.test.ts
import { submitAnswer } from "../actions/submitAnswer";

describe("submitAnswer", () => {
  it("returns success for correct answer", async () => {
    const result = await submitAnswer({
      questionId: "123",
      answer: 2,
      correctAnswer: 2,
    });

    expect(result.success).toBe(true);
    expect(result.coinsEarned).toBe(50);
  });

  it("returns no coins for wrong answer", async () => {
    const result = await submitAnswer({
      questionId: "123",
      answer: 1,
      correctAnswer: 2,
    });

    expect(result.success).toBe(false);
    expect(result.coinsEarned).toBe(0);
  });
});
```

## E2E Testing (Playwright)

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

### E2E Test Example

```typescript
// e2e/practice.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Practice Questions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/practice");
  });

  test("displays question and options", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /question/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /option/i })).toHaveCount(4);
  });

  test("selecting answer shows result", async ({ page }) => {
    await page.getByRole("button", { name: /option a/i }).click();
    await expect(page.getByText(/correct/i)).toBeVisible();
  });

  test("calculator can be opened for math", async ({ page }) => {
    await page.goto("/practice/math");
    await page.getByRole("button", { name: /calculator/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Run specific file
pnpm test src/components/Button.test.tsx

# Run with coverage
pnpm test:coverage

# Run E2E
pnpm test:e2e

# Run specific E2E file
pnpm test:e2e practice.spec.ts
```

## Best Practices

1. **Test behavior, not implementation** - Test what users see/do
2. **Use meaningful descriptions** - "shows error when email is invalid"
3. **Mock external dependencies** - Database, APIs, third-party services
4. **Keep tests isolated** - Each test independent
5. **Follow AAA pattern** - Arrange, Act, Assert
6. **Test edge cases** - Empty, null, maximum values
7. **Don't test library code** - Trust your dependencies
