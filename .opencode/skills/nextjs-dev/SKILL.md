---
name: nextjs-dev
description: Expert in Next.js 15, React 18, and TypeScript development. Use when building pages, API routes, components, or debugging Next.js applications. Handles App Router, Server Actions, middleware, and Next.js configuration.
---

# Next.js 15 Development Agent

Expert guidance for building Next.js 15 applications with React 18 and TypeScript.

## Tech Stack Context

This project uses:

- **Next.js 15** with App Router
- **React 18** with Server Components
- **TypeScript** with strict typing
- **pnpm** as package manager
- **TailwindCSS 3.4** for styling
- **Zustand 5** for state management

## Project Structure Conventions

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (route handlers)
│   ├── (routes)/          # Route groups
│   ├── layout.tsx         # Root/layout layouts
│   └── page.tsx           # Page components
├── features/              # Feature modules
│   └── {feature}/         # Feature folder
│       ├── components/    # Feature components
│       ├── types/         # Feature types
│       └── hooks/         # Feature hooks
├── services/              # Backend services
├── shared/                # Shared code
│   ├── components/        # Common UI components
│   │   └── ui/           # Shadcn-style components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Library utilities
└── stores/               # Zustand stores
```

## Key Patterns

### App Router Patterns

```typescript
// app/page.tsx - Server Component (default)
export default async function Page() {
  return <div>Server Component</div>;
}

// app/page.tsx - Client Component
"use client";
import { useState } from "react";
export default function Page() {
  const [state, setState] = useState();
  return <div>{state}</div>;
}
```

### API Routes (App Router)

```typescript
// app/api/route/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ data: "response" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### Server Actions

```typescript
// actions.ts
"use server";

export async function serverAction(formData: FormData) {
  // Server-side logic
  return { success: true };
}
```

### Route Handlers vs Middleware

- **Route Handlers** (`app/api/*/route.ts`): Handle HTTP requests
- **Middleware** (`middleware.ts`): Handle auth, redirects, etc. at edge

### Middleware Pattern

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check auth, redirect, etc.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

## Component Patterns

### Client Component with Props

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  initialCount?: number;
}

export function Counter({ title, initialCount = 0 }: Props) {
  const [count, setCount] = useState(initialCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>{title}</h2>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </motion.div>
  );
}
```

### Zustand Store

```typescript
// stores/feature/store.ts
import { create } from "zustand";

interface State {
  value: string;
  setValue: (value: string) => void;
}

export const useFeatureStore = create<State>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
```

## Common Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Best Practices

1. **Use Server Components by default** - Only add "use client" when needed
2. **Keep API logic in route handlers** - Don't call DB directly from components
3. **Use TypeScript strictly** - Avoid `any`, use proper interfaces
4. **Leverage Zustand for client state** - Keep React state minimal
5. **Use path aliases** - `@/components/*`, `@/services/*`, etc.
