<div align="center">
  <img src="/public/logo/dailysat.png" width="20%" alt="DailySAT" />
</div>

# DailySAT

<h3 align="center">
  Your AI-Powered SAT Preparation Platform
</h3>

<p align="center">
  Master the SAT with personalized study plans, practice questions, gamification, and real-time progress tracking.
</p>

<div align="center">

  <a href="https://dailysat.org/">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-DailySAT-2F80ED?color=2F80ED&logoColor=white"/>
  </a>
  <a href="LICENSE-CODE">
    <img src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/pnpm-FY23C48?logo=pnpm&logoColor=white"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?logo=github"/>

</div>

---

## ✨ Features

| Feature                   | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| 📝 **Practice Questions** | Comprehensive SAT questions for Math and English with detailed explanations |
| 🤖 **AI Study Planner**   | Personalized study plans powered by Groq SDK based on your target score     |
| 🏆 **Gamification**       | Earn coins, maintain streaks, and unlock rewards                            |
| 🛒 **Avatar Shop**        | Spend your hard-earned coins on exclusive avatars                           |
| 📊 **Progress Tracking**  | Visual statistics and analytics of your performance                         |
| 👥 **Referral System**    | Invite friends and earn rewards together                                    |
| 🎯 **Leaderboard**        | Compete with other students and track rankings                              |
| 🔐 **Google OAuth**       | Quick and secure authentication                                             |
| 🔄 **Rate Limiting**      | Redis-powered caching for optimal performance                               |

---

## 📚 Practice Categories

### Math

- **Advanced Math** — Complex algebraic expressions and problem-solving
- **Problem-Solving and Data Analysis** — Statistical reasoning and data interpretation
- **Geometry** — Spatial reasoning and geometric calculations
- **Algebra** — Linear equations, functions, and inequalities

### English

- **Information and Ideas** — Reading comprehension and textual analysis
- **Standard English Conventions** — Grammar, punctuation, and sentence structure
- **Expression of Ideas** — Rhetorical effectiveness and writing strategy
- **Craft and Structure** — Author's choices and text organization

---

## 🛠 Tech Stack

<div align="center">

| Category                  | Technology                       |
| ------------------------- | -------------------------------- |
| **Framework**             | Next.js 15, React 18, TypeScript |
| **Styling**               | TailwindCSS 3.4                  |
| **State Management**      | Zustand 5                        |
| **Database**              | MongoDB                          |
| **Caching/Rate Limiting** | Upstash Redis                    |
| **Authentication**        | Better Auth, Google OAuth        |
| **AI Integration**        | Groq SDK                         |
| **Animations**            | Framer Motion                    |
| **Charts**                | Chart.js                         |
| **Math Rendering**        | KaTeX                            |
| **Package Manager**       | pnpm                             |

</div>

---

## 📂 Project Structure

```
dailysat/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── practice/          # Practice question pages
│   │   ├── ai/                # AI study planner
│   │   ├── shop/              # Avatar shop
│   │   ├── leaderboard/       # Leaderboard page
│   │   ├── team/              # Team page
│   │   └── contact/           # Contact page
│   ├── features/              # Feature modules
│   │   ├── landing/           # Landing page components
│   │   ├── practice/          # Practice system components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── shop/              # Shop components
│   │   ├── ai-planner/        # AI study planner components
│   │   ├── leaderboard/       # Leaderboard components
│   │   └── ...
│   ├── services/              # Backend services
│   │   ├── database.ts        # MongoDB connection
│   │   ├── auth.ts            # Authentication service
│   │   ├── rate-limiter.ts    # Redis rate limiting
│   │   ├── ai.ts              # AI integration
│   │   └── email.ts           # Email service
│   ├── shared/                # Shared components, hooks, types, utilities
│   ├── stores/                # Zustand stores
│   │   ├── user/              # User state
│   │   ├── practice/          # Practice session state
│   │   ├── shop/              # Shop state
│   │   └── modals/            # Modal state
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── diagrams/                  # Architecture diagrams
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended) or npm
- **Docker** (for MongoDB)
- **Redis** server

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/anomalyco/dailysat.git
   cd dailysat
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then fill in the required values in `.env.local` (see [Environment Variables](#-environment-variables) below).

4. **Set up MongoDB (Docker)**

   ```bash
   docker pull mongo
   ```

   Your local MongoDB URI will be:

   ```
   mongodb://localhost:27017/
   ```

   Open **MongoDB Compass** and connect using the URI above. Create a new database named `DailySAT`.

5. **Start Redis locally**

   ```bash
   redis-server
   ```

   > If Redis is not installed, install it first via your package manager.

6. **Get API Keys**

   **Groq API Key:**
   1. Create an account at [Groq](https://console.groq.com/)
   2. Navigate to "API Keys" and create a new key
   3. Paste it in your `.env.local`

   **OpenRouter API Key:**
   1. Create an account at [OpenRouter](https://openrouter.ai/)
   2. Go to "Keys" and click "Create API Key"
   3. Name it "deepseek-key" and paste it in your `.env.local`

7. **Run the development server**

   ```bash
   pnpm dev
   ```

8. **Open** [http://localhost:3000](http://localhost:3000) in your browser

---

## 📜 Available Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the development server         |
| `pnpm build`   | Build the application for production |
| `pnpm start`   | Start the production server          |
| `pnpm lint`    | Run ESLint to check code quality     |
| `pnpm prepare` | Install Husky git hooks              |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGO_URL=                    # MongoDB connection string

# Authentication (Better Auth)
BETTER_AUTH_SECRET=           # Random secret for auth encryption
BETTER_AUTH_URL=              # Your app URL (e.g., http://localhost:3000)

# Google OAuth
NEXT_PUBLIC_AUTH_GOOGLE_ID=   # Google OAuth Client ID
NEXT_PUBLIC_AUTH_GOOGLE_SECRET= # Google OAuth Client Secret
AUTH_GOOGLE_APP_PASSWORD=     # App password for email (if needed)

# Redis (Upstash)
REDIS_URL=                    # Upstash Redis URL
REDIS_TOKEN=                  # Upstash Redis Token

# JWT
JWT_SECRET=                   # Secret for JWT token generation

# AI Services
NEXT_PUBLIC_GROQ_API_KEY=     # Groq API Key for AI study planner
OPENROUTER_API_KEY=           # OpenRouter API Key

# Encryption
CRYPTOJS_SECRET_KEY=          # Secret for CryptoJS encryption
```

---

## 🎮 Gamification System

### Coins

- **Earn 50 coins** for every correct answer
- **Referral bonus:** Refer a friend and both get rewarded!

### Referral System

| User     | Reward    |
| -------- | --------- |
| Referrer | 250 coins |
| Referred | 200 coins |

### Streak Tracking

- Maintain daily streaks by practicing consistently
- Streak multipliers increase your coin earnings

### Avatar Shop

- Unlock exclusive avatars using your earned coins
- New avatars added regularly

---

## 🤖 AI Study Planner

The AI-powered study planner creates personalized study schedules based on:

1. **Current Score** — Your starting point
2. **Target Score** — Your goal
3. **Test Date** — When you're taking the SAT

The AI analyzes your strengths and weaknesses across all question categories and generates a customized roadmap to help you achieve your target score efficiently.

---

## 📊 API Documentation

Interactive API documentation is available at:

```
https://www.dailysat.org/api-docs
```

---

## 🧪 Local Development

### Setting Up Mock Database

For local development without production database access:

1. Install **Docker** and **MongoDB Compass**
2. Run `docker pull mongo` to fetch the MongoDB image
3. Connect to `mongodb://localhost:27017/` in Compass
4. Create a database named `DailySAT`
5. Start Redis with `redis-server`

This setup mirrors the production environment.

---

## 🔐 Authentication

The main DailySAT platform uses [Better Auth](https://better-auth.com/) for authentication with Google SSO support. User data is stored in MongoDB under the `users` collection.

Redis is used as a caching layer to reduce database load during API rate-limited operations.

---

## 👥 Contributing

We welcome open-source contributions! Here's how to get started:

### Submitting Issues

If you find a bug or have a feature request, please create an issue in the GitHub Issues tab. Be descriptive in your titles (naming convention is optional for issues).

### Pull Request Naming Convention

Please use the following prefixes:

| Prefix   | Purpose                           |
| -------- | --------------------------------- |
| `feat:`  | New features                      |
| `fix:`   | Bug fixes                         |
| `chore:` | Routine tasks (docs, refactoring) |

### Steps to Contribute

1. Create a new branch from `main`
2. Submit a pull request linking to a relevant issue
3. Our team will review your PR and provide feedback

> **Note:** Open-source contributions are volunteer-based and not subject to payment, but you are encouraged to list your contributions on your resume or portfolio.

> **Credit:** You will receive full credit for any work we use from your contribution.

For references or questions, reach out to the team on our Discord server.

---

## 🧑‍🤝‍🧑 Open Source Mission

Our mission is to build a platform that's **free and accessible to everyone**. We value input from the DailySAT community and believe in the power of open collaboration.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE-CODE](LICENSE-CODE) file for details.

---

<br>
<div align="center">

**Built with ❤️ for students everywhere**

_© 2024-2026 DailySAT. All rights reserved._

</div>
