# The Shelf — Setup Guide

A dark, atmospheric online bookshelf inspired by Rusty Lake.
Built with Next.js 14 · TypeScript · Tailwind CSS · NextAuth.js · Prisma · PostgreSQL.

---

## Prerequisites

- Node.js 18+
- npm 9+
- A [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres) account
- A Google Cloud account for OAuth

---

## 1. Clone & Install

```bash
git clone https://github.com/your-username/bookshelf.git
cd bookshelf
npm install
```

---

## 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled, from Neon/Vercel) |
| `DIRECT_URL` | Direct (non-pooled) connection (for Neon migrations) |
| `NEXTAUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

---

## 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google+ API** or **People API**
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
5. Application type: **Web Application**
6. Add Authorised Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** into `.env.local`

---

## 4. Set Up the Database (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project → copy the **Connection String**
3. In your Neon dashboard, find:
   - **Pooled connection** → use as `DATABASE_URL`
   - **Direct connection** → use as `DIRECT_URL`
4. Paste both into `.env.local`

---

## 5. Run Prisma Migration

Generate the client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

> For production, use `npx prisma migrate deploy` after creating a migration with `npx prisma migrate dev --name init`.

---

## 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 7. Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### Step 3: Add Environment Variables
In Vercel dashboard → **Settings → Environment Variables**, add all variables from `.env.example`:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` → set to your Vercel deployment URL (e.g., `https://bookshelf-abc123.vercel.app`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Step 4: Configure Build Command
In Vercel → **Settings → General → Build Command**, set:
```
npx prisma generate && npm run build
```

Or add to `package.json`:
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Step 5: Run Migration on Production
After first deploy, run in your terminal (with `DATABASE_URL` set):
```bash
npx prisma migrate deploy
```

Or use Vercel's **Shell** feature to run it once.

### Step 6: Update Google OAuth Redirect URI
Add your Vercel URL to the Google OAuth redirect URIs:
```
https://your-domain.vercel.app/api/auth/callback/google
```

---

## Database Schema

```prisma
model User {
  id    String  @id @default(cuid())
  name  String?
  email String? @unique
  books Book[]
}

model Book {
  id          String   @id @default(cuid())
  title       String
  description String
  userId      String
  createdAt   DateTime @default(now())
  user        User     @relation(...)
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Auth | NextAuth.js v4 (Google OAuth) |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon) |
| Deploy | Vercel |

---

## Features

- 🌑 Dark atmospheric UI inspired by Rusty Lake
- 📚 Personal bookshelf with per-user book storage
- ✨ Optimistic UI updates (instant feedback)
- 🖱️ Parallax shelf on landing page
- 🔊 Ambient sound toggle + hover sound effects
- 💀 Animated book removal
- 📖 Accordion book description panel
- 🔐 Google OAuth authentication
- 💾 Persistent PostgreSQL storage
