---
name: frontend-design
description: Expert in frontend design, UI/UX patterns, and creating visually appealing interfaces for this SAT prep platform. Use when building components, designing pages, or improving user experience.
---

# Frontend Design Agent

Expert guidance for creating beautiful, accessible frontend interfaces.

## Tech Stack Context

This project uses:

- **Next.js 15** with React 18
- **TailwindCSS 3.4** with CSS custom properties
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **KaTeX** for math rendering
- **Shadcn-style UI** components in `/src/shared/components/ui/`

## Design Philosophy

### Core Principles

1. **Clarity over decoration** - Every element serves a purpose
2. **Consistent spacing** - Use Tailwind's spacing scale (1-96, px, etc.)
3. **Color hierarchy** - Primary actions, secondary elements, disabled states
4. **Typography scale** - Clear headings, readable body text
5. **Responsive design** - Mobile-first approach

## Component Patterns

### Shadcn-Style Button

```typescript
// src/shared/components/ui/button.tsx
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ className, variant = "primary", size = "md", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg font-medium transition-colors disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
```

### Card Component

```typescript
// src/shared/components/ui/card.tsx
import { cn } from "@/shared/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover = false }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        hover && "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};
```

### Stat Card

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-full bg-blue-100 p-3 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className={trend.positive ? "text-green-600" : "text-red-600"}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
    </Card>
  );
};
```

### Progress Bar

```typescript
interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
}

export const Progress = ({ value, max = 100, color = "bg-blue-600", showLabel }: ProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};
```

### Modal/Dialog

```typescript
// src/shared/components/ui/modal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## Animation Guidelines

### Framer Motion Best Practices

```typescript
import { motion } from "framer-motion";

// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Stagger children
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
```

## Color System

```css
/* tailwind.config.ts - extend colors */
colors: {
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: {
    500: "#22c55e",
  },
  warning: {
    500: "#f59e0b",
  },
  error: {
    500: "#ef4444",
  },
}
```

## Accessibility

1. **Use semantic HTML** - button, nav, main, section, etc.
2. **Add aria-labels** for icon-only buttons
3. **Ensure contrast** - minimum 4.5:1 for text
4. **Focus states** - visible outlines for keyboard navigation
5. **Alt text** - all images should have descriptive alt text

## KaTeX for Math

```typescript
import katex from "katex";
import "katex/dist/katex.min.css";

// Render math string
const renderMath = (math: string, element: HTMLElement) => {
  katex.render(math, element, {
    throwOnError: false,
    displayMode: true, // for block math
  });
};
```

## Chart.js Setup

```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
```
