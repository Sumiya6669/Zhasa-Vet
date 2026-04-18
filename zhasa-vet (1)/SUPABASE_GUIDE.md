# Supabase Setup For ZhasaVet

## 1. Environment Variables

Add these variables locally:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Add these variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 2. Database

Open Supabase SQL Editor and run the full contents of `DATABASE.sql`.

## 3. Authentication Settings

In Supabase Authentication settings:

- Set your production Site URL to your Vercel domain
- Add `http://localhost:5173` to Redirect URLs for local development
- Add your Vercel domain to Redirect URLs for production

If email confirmation is enabled, new users must confirm their email before they can sign in.

## 4. Create The Admin Account

Run:

```bash
npm run create-admin
```

Then sign in at `/admin` with:

- email: `admin@zhasavet.kz`
- or alias: `admin-zhasavet`
- password: the value of `ADMIN_PASSWORD`

## 5. Seed Optional Content

If you want demo products and blog posts, run the SQL seed in `DATABASE.sql` or the local script after installing dependencies.
