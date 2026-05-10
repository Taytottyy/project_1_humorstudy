# Humor Study — Voting Site

Public-facing voting site for Crackd humor studies. Users see one caption at a time and vote it funny or not funny.

## Stack
- Next.js 15 (App Router)
- Supabase (read-only access to Crackd DB)
- Tailwind CSS v4
- TypeScript

## Setup

1. Clone this repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the env template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Run locally:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add the two env vars in Vercel's Environment Variables settings
4. Deploy

## Supabase RLS

Make sure your `caption_votes` table allows inserts. In the Supabase SQL editor:

```sql
CREATE POLICY "allow_student_votes" ON caption_votes
FOR INSERT WITH CHECK (true);
```

## File structure

```
app/
  layout.tsx       — root layout
  page.tsx         — redirects / → /vote
  globals.css      — all styles
  vote/
    page.tsx       — main voting UI
lib/
  supabase/
    client.ts      — browser Supabase client
```
