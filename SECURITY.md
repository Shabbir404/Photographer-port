# Security — why the site was hacked and how to fix it

## What went wrong

1. **RLS allowed anonymous writes** — The old setup used policies like `FOR INSERT WITH CHECK (true)` for the `anon` role. Anyone can read your anon key from the built site and run `supabase.from('projects').insert(...)` in the browser console. **UI login did not protect the database.**

2. **Admin password in `VITE_*` env vars** — Vite bundles those into JavaScript. Anyone can open DevTools → Sources and search for your password.

3. **Service role key in the frontend (if used)** — `VITE_SUPABASE_SERVICE_KEY` bypasses all RLS. Never put the service role key in any `VITE_` variable or client code.

## Secure model (what this repo uses now)

| Action | Who can do it |
|--------|----------------|
| View gallery | Everyone (anon `SELECT`) |
| Upload / delete | Only a signed-in Supabase Auth user whose email matches RLS |
| Console without login | **Read only** — writes are rejected by Postgres |

## New project checklist

1. Create a **new** Supabase project (recommended after a compromise).
2. **Authentication → Providers → Email** — disable public sign-ups.
3. **Authentication → Users** — add one admin user (strong password).
4. **SQL Editor** — run `supabase/secure-setup.sql` and replace `YOUR_ADMIN_EMAIL` with that user's email (both table and storage policies).
5. Create storage bucket `works` (public read).
6. `.env` — only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. **Rotate keys** on the old project, then delete the old project when done.
8. Remove `VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`, and `VITE_SUPABASE_SERVICE_KEY` from hosting env vars (Vercel/Netlify).

## After migrating

- Delete spam rows in `projects` and junk files in the `works` bucket.
- Revoke the old anon key if the project still exists.
- Never commit `.env`.
