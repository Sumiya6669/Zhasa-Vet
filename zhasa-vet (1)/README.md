# ZhasaVet

Vite + React storefront with Supabase authentication, products, blog posts, and orders.

## What Changed

- The app now works on Vercel as a pure frontend SPA.
- Data is loaded directly from Supabase instead of a local Express server.
- Client-side routes are handled through `vercel.json`.
- A one-time script can create or update the admin account in Supabase Auth.

## Local Run

1. Install dependencies:
   `npm install`
2. Create `.env.local` from `.env.example`
3. Fill in:
   `VITE_SUPABASE_URL`
   `VITE_SUPABASE_ANON_KEY`
   `SUPABASE_SERVICE_ROLE_KEY`
   `SUPABASE_SECRET_KEY`
   `ADMIN_EMAIL`
   `ADMIN_PASSWORD`
4. Start the app:
   `npm run dev`

## Admin Account

1. Set `ADMIN_PASSWORD` in `.env.local`
2. Run:
   `npm run create-admin`
3. Open `/admin`
4. Log in with email `admin@zhasavet.kz` or alias `admin-zhasavet`

## Vercel Deploy

1. Add only these variables in Vercel Project Settings:
   `VITE_SUPABASE_URL`
   `VITE_SUPABASE_ANON_KEY`
2. Build command:
   `npm run build`
3. Output directory:
   `dist`
4. Redeploy

## Required Supabase Setup

Run the SQL from `DATABASE.sql` in the Supabase SQL Editor before deploying.
