# Security — portfolio hardening

## Honest answer: “100% hack proof”?

No website on the public internet is mathematically unhackable. Your goal is **so hard that console script-kiddies and bots cannot touch your data** — which you now have, plus extra layers below.

## What blocks attackers (server-side — cannot be bypassed from console)

| Layer | What it does |
|-------|----------------|
| **RLS** | Anon key = read gallery only. No insert/upload/delete. |
| **Supabase Auth** | Writes need your JWT after email + password. |
| **Sign-ups off** | Nobody can create a second account. |
| **Optional UUID policies** | `harden-by-user-id.sql` — only your user id can write, even if a second account existed. |

Console tests you passed (401 / RLS on insert & upload) = **this layer is working**.

## What blocks attackers (client-side — reduces noise, not a vault)

| Layer | What it does |
|-------|----------------|
| **Hidden admin UI** | No “Admin” button on the public site. |
| **Unlock** | 5× click footer copyright **or** `/?gate=SECRET` (if `VITE_ADMIN_GATE_SECRET` set). |
| **Netlify headers** | `netlify.toml` — anti-clickjacking, nosniff, etc. |

A determined person can still find login in the JS bundle. They **still cannot upload** without your Supabase password.

## “Challenge to hack” checklist (do all of these)

### Supabase Dashboard (5 min)

1. **Authentication → Providers → Email** — sign-ups **disabled**.
2. **Authentication → Users** — exactly **one** admin; password 16+ chars, unique, not reused.
3. **Authentication → Attack Protection** — enable **Leaked password protection** (if on your plan).
4. **Authentication → MFA** — enable for your admin user (best upgrade).
5. **SQL** — policies from `fix-rls-policies.sql` already applied.
6. **Optional** — run `harden-by-user-id.sql` with your user UUID (belt + suspenders).
7. **Settings → API** — never expose **service_role** in frontend or Netlify `VITE_*`.

### Netlify

1. Env vars: **only** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
2. Optional: `VITE_ADMIN_GATE_SECRET` = long random string (e.g. `openssl rand -hex 32`).
3. Redeploy after any env change.

### Your machine

1. `.env` in `.gitignore` — never commit.
2. Delete spam rows/files in Supabase if any remain.
3. Delete the **old** compromised Supabase project when finished.

## How you open admin (after deploy)

1. **5 quick clicks** on “© … All rights reserved” in the footer → **Sign in** appears.
2. Or visit `https://yoursite.netlify.app/?gate=YOUR_SECRET` once (if you set `VITE_ADMIN_GATE_SECRET`).
3. Sign in with Supabase admin email + password.
4. Upload as usual.

## What hackers knew last time

They did **not** need to “steal” your anon key. It is **public in every visitor’s browser** by design. The bug was **RLS allowed anonymous INSERT**. That is fixed.

## Re-test after each deploy

```javascript
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
const sb = createClient('YOUR_URL', 'YOUR_ANON_KEY');
console.log(await sb.from('projects').insert({ name: 'test' }));
console.log(await sb.storage.from('works').upload('x.txt', new Blob(['x'])));
```

Both must fail. Gallery `select` may still work (public read).
