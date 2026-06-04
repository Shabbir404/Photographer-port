# 📸 Photography Portfolio — Md Sowkot Noor

A modern, full-stack photography portfolio built with **React + Vite + Supabase**. Features a glassmorphism UI, admin panel with secure login, image compression, and dynamic gallery powered by Supabase.

---

## ✨ Features

- **Glassmorphism UI** — Dark theme with aurora gradients, blur effects, and grain overlay
- **Dynamic Gallery** — Works fetched live from Supabase database
- **Admin Panel** — Secure lock & key login to manage the portfolio
- **Image Upload** — Upload JPG, JPEG, PNG; auto-compressed to ≤1MB before storage
- **Supabase Backend** — Storage bucket + PostgreSQL database for works
- **Delete Works** — Admins can remove images from both storage and database
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Framer Motion** — Smooth page animations and transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend/DB | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Compression | browser-image-compression |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/photography-portfolio.git
cd photography-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

#### a) Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project.

#### b) Secure database + storage (required)

1. **Authentication → Providers → Email** — turn **off** public sign-ups.
2. **Authentication → Users** — create **one** admin user (your email + strong password).
3. In **SQL Editor**, run `supabase/secure-setup.sql` (or `fix-rls-policies.sql` if upload fails with RLS errors).

This enables a public read-only gallery; only your admin account can upload or delete.

#### c) Create the `works` Storage Bucket

In **Supabase Dashboard → Storage**:
1. Click **New Bucket**
2. Name it: `works`
3. Make it **Public**
4. Click **Create**

Storage policies are included in `secure-setup.sql` (run after creating the bucket).

#### d) Get your API keys

In **Supabase Dashboard → Project Settings → API**:
- Copy **Project URL**
- Copy **anon / public** key

### 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Admin password is **not** stored in `.env`. Use the Supabase Auth user you created in step 3b.

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 5. Add your photo (optional)

Place your portrait photo at:
```
public/photographer.jpg
```

### 6. Run the development server

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🔐 Admin Panel Usage

1. **Unlock admin UI:** click the footer copyright line **5 times** quickly, or visit `/?gate=YOUR_SECRET` if you set `VITE_ADMIN_GATE_SECRET`.
2. Click **Sign in** and use your **Supabase admin email and password**.
3. Once logged in, the panel opens where you can:
   - **Upload** photography works (JPG/JPEG/PNG, any size → auto-compressed to 1MB)
   - **Give each work** a name and optional description
   - **Delete** existing works (removes from storage + database)

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── photographer.jpg       ← your portrait photo (add manually)
├── src/
│   ├── components/
│   │   ├── AdminLogin.jsx     ← Lock & key login modal
│   │   └── AdminPanel.jsx     ← Upload / delete works panel
│   ├── hooks/
│   │   └── useWorks.js        ← Fetch works from Supabase
│   ├── lib/
│   │   └── supabase.js        ← Supabase client
│   ├── App.jsx                ← Main app (hero, gallery, contact, footer)
│   ├── index.css              ← Global styles
│   └── main.jsx               ← React entry point
├── .env                       ← Your secrets (DO NOT COMMIT)
├── .env.example               ← Template for env vars
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to **Vercel**, **Netlify**, or any static host.

### Deploying to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all `.env` variables in **Vercel → Project → Settings → Environment Variables**
4. Deploy

### Deploying to Netlify

1. Push to GitHub
2. Import on [netlify.com](https://netlify.com)
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `dist`
5. Add env variables in **Site → Settings → Environment variables**

---

## 🎨 Customization

| What to change | Where |
|---|---|
| Photographer name | `src/App.jsx` → hero section |
| Email & phone | `src/App.jsx` → contact section |
| Social links | `src/App.jsx` → `socialLinks` array |
| Hero portrait | `public/photographer.jpg` |
| Site title & meta | `index.html` |
| Admin account | Supabase Dashboard → Authentication → Users |

---

## 📝 Notes

- Images are compressed client-side to **≤1MB** before uploading — no server needed
- Supported formats: **JPG, JPEG, PNG** only
- Admin session uses **Supabase Auth** (stored in `sessionStorage` for this tab)
- Public visitors only get the **anon key**; RLS blocks writes without a valid admin JWT
- See **SECURITY.md** if you were compromised or used the old open INSERT/DELETE policies

---

## 📄 License

MIT — free to use and modify.
