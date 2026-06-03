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

#### b) Create the `works` table

In **Supabase Dashboard → SQL Editor**, run:

```sql
-- Create works table
CREATE TABLE works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read works (public gallery)
CREATE POLICY "Public can read works"
  ON works FOR SELECT
  USING (true);

-- Allow anonymous inserts (admin uses anon key)
CREATE POLICY "Allow insert"
  ON works FOR INSERT
  WITH CHECK (true);

-- Allow anonymous deletes
CREATE POLICY "Allow delete"
  ON works FOR DELETE
  USING (true);
```

#### c) Create the `works` Storage Bucket

In **Supabase Dashboard → Storage**:
1. Click **New Bucket**
2. Name it: `works`
3. Make it **Public**
4. Click **Create**

Then add Storage policies. Go to **Storage → Policies → works bucket**:

```sql
-- Allow public to view files
CREATE POLICY "Public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'works');

-- Allow upload
CREATE POLICY "Allow upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'works');

-- Allow delete
CREATE POLICY "Allow delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'works');
```

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
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin credentials (lock = username, key = password)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your-secure-password-here
```

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

1. Go to the website footer and click the **Admin** button (shield icon)
2. Enter your **Lock** (username) and **Key** (password) from `.env`
3. Once logged in, the Admin Panel opens where you can:
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
| Admin credentials | `.env` → `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` |

---

## 📝 Notes

- Images are compressed client-side to **≤1MB** before uploading — no server needed
- Supported formats: **JPG, JPEG, PNG** only
- The admin session is **in-memory only** — logging out or refreshing the page requires re-login
- This uses the Supabase **anon key** with RLS policies — suitable for personal portfolios. For production with sensitive data, use Supabase Auth instead.

---

## 📄 License

MIT — free to use and modify.
