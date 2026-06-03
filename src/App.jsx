import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  ImageOff,
} from "lucide-react";
import { AdminLogin } from "./components/AdminLogin";
import { AdminPanel } from "./components/AdminPanel";
import { useWorks } from "./hooks/useWorks";

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", mark: "F" },
  { name: "X / Twitter", href: "https://x.com", mark: "X" },
  { name: "Instagram", href: "https://instagram.com", mark: "IG" },
  { name: "TikTok", href: "https://tiktok.com", mark: "TT" },
  { name: "YouTube", href: "https://youtube.com", mark: "YT" },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

function App() {
  const [heroMissing, setHeroMissing] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { works, loading, error, refetch } = useWorks();

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080810] text-white">
      {/* Background aurora */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        {/* ── HERO ── */}
        <motion.section
          {...fadeUp}
          className="grid items-center gap-10 rounded-[2rem] border border-white/8 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl md:grid-cols-2 md:p-14"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/8 px-4 py-1.5 text-sm font-medium text-fuchsia-300"
            >
              <Camera className="h-3.5 w-3.5" />
              Md Sowkot Noor — Photographer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
            >
              Capturing stories{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                with light,
              </span>{" "}
              shadow, and soul.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg"
            >
              Professional photographer specializing in weddings, fashion,
              portraits, and cinematic lifestyle moments. Every frame is designed
              to feel timeless and editorial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a
                href="#works"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-lg shadow-white/10 transition hover:scale-105 hover:shadow-white/20"
              >
                View Works
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/35"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto h-[28rem] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-violet-500/10 to-blue-500/20 p-2 shadow-2xl shadow-fuchsia-900/30"
          >
            {/* Gloss reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-3xl bg-gradient-to-b from-white/8 to-transparent z-10" />
            <img
              src="/photographer.jpg"
              alt="Photographer portrait"
              className="h-full w-full rounded-2xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                setHeroMissing(true);
              }}
            />
            {heroMissing && (
              <div className="absolute inset-2 grid place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-900/40 to-blue-900/40 text-center">
                <div>
                  <Camera className="mx-auto mb-3 h-10 w-10 text-white/20" />
                  <span className="rounded-lg bg-black/50 px-3 py-1.5 text-xs text-white/50">
                    Add photographer.jpg to /public
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* ── WORKS ── */}
        <motion.section {...fadeUp} id="works" className="mt-20 md:mt-28">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-fuchsia-400/70">
              Portfolio
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Selected Works
            </h2>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center gap-3 text-white/40">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading works...</span>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-sm text-red-300/70">
              <p className="font-medium">Could not load works</p>
              <p className="mt-1 text-xs opacity-70">{error}</p>
              <p className="mt-2 text-xs opacity-50">
                Make sure Supabase is configured in your .env file.
              </p>
            </div>
          ) : works.length === 0 ? (
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] py-20 text-center backdrop-blur-xl">
              <Camera className="mx-auto mb-4 h-10 w-10 text-white/15" />
              <p className="text-sm text-white/30">No works published yet.</p>
              <p className="mt-1 text-xs text-white/20">
                Log in as admin to upload photography.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {works.map((work, index) => (
                <motion.article
                  key={work.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/20 hover:shadow-xl hover:shadow-fuchsia-900/20"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={work.image_url}
                      alt={work.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-108"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="absolute inset-0 hidden items-center justify-center bg-black/40"
                    >
                      <ImageOff className="h-8 w-8 text-white/20" />
                    </div>
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-white leading-tight">
                      {work.name}
                    </h3>
                    {work.description && (
                      <p className="mt-1 text-xs leading-relaxed text-white/45 line-clamp-2">
                        {work.description}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── CONTACT ── */}
        <motion.section
          {...fadeUp}
          id="contact"
          className="mt-20 rounded-[2rem] border border-white/8 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl md:mt-28 md:p-12"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-fuchsia-400/70">
                Get in Touch
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Let's Create Something Beautiful
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55 md:text-base">
                Available for destination weddings, premium portraits, brand
                shoots, and cinematic storytelling projects.
              </p>
              <div className="mt-8 space-y-4">
                <a
                  href="mailto:hello@yourstudio.com"
                  className="flex items-center gap-3 text-sm text-white/70 transition hover:text-fuchsia-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Mail className="h-4 w-4" />
                  </span>
                  161@gmail.com
                </a>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-3 text-sm text-white/70 transition hover:text-fuchsia-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Phone className="h-4 w-4" />
                  </span>
                  +880 61
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/30">
                Social Links
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/60 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-fuchsia-400/25 hover:bg-fuchsia-500/8 hover:text-white"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-white/15 bg-white/5 text-[9px] font-bold">
                      {s.mark}
                    </span>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/6 pt-8 text-xs text-white/25 sm:flex-row">
          <p>© {new Date().getFullYear()} Md Sowkot Noor. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#works" className="transition hover:text-white/50">Works</a>
            <a href="#contact" className="transition hover:text-white/50">Contact</a>

            {/* Admin Button */}
            <button
              onClick={() =>
                isAdmin ? setShowAdminPanel(true) : setShowAdminLogin(true)
              }
              className="group flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-white/30 backdrop-blur-sm transition hover:border-fuchsia-400/25 hover:bg-fuchsia-500/8 hover:text-fuchsia-300"
              title="Admin Panel"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAdmin ? "Admin Panel" : "Admin"}
            </button>
          </div>
        </footer>
      </main>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLogin
            onSuccess={handleAdminSuccess}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <AdminPanel
            works={works}
            onClose={() => setShowAdminPanel(false)}
            onLogout={handleLogout}
            onRefresh={refetch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
