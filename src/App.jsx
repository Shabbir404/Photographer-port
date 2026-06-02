import { motion } from "framer-motion";
import { useState } from "react";
import { Camera, Mail, Phone } from "lucide-react";

const works = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Sample Work ${index + 1}`,
  src: `/works/img${index + 1}.jpg`,
}));

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", mark: "f" },
  { name: "X", href: "https://x.com", mark: "x" },
  { name: "Instagram", href: "https://instagram.com", mark: "ig" },
  { name: "TikTok", href: "https://tiktok.com", mark: "tt" },
  { name: "YouTube", href: "https://youtube.com", mark: "yt" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" },
};

function App() {
  const [photographerMissing, setPhotographerMissing] = useState(false);
  const [missingWorkImages, setMissingWorkImages] = useState({});

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.2),transparent_40%),radial-gradient(circle_at_left,_rgba(59,130,246,0.2),transparent_35%)]" />

      <main className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <motion.section
          {...fadeUp}
          className="grid items-center gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:grid-cols-2 md:p-12"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-4 py-1 text-sm text-fuchsia-200">
              <Camera className="h-4 w-4" />
              Stylish Modern Photography Portfolio
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Capturing stories with light, shadow, and soul.
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
              Professional photographer specializing in weddings, fashion, portraits, and cinematic lifestyle moments.
              Every frame is designed to feel timeless and editorial.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#works"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
              >
                View Works
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Me
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto h-[26rem] w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-fuchsia-500/30 to-blue-500/30 p-2 shadow-2xl"
          >
            <img
              src="/photographer.jpg"
              alt="Photographer portrait"
              className="h-full w-full rounded-xl object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                setPhotographerMissing(true);
              }}
            />
            {photographerMissing && (
              <div className="absolute inset-0 grid place-items-center rounded-xl bg-black/40 text-center text-sm text-white/80">
                <span className="rounded-lg bg-black/60 px-3 py-2">Place your photographer image at public/photographer.jpg</span>
              </div>
            )}
          </motion.div>
        </motion.section>

        <motion.section {...fadeUp} id="works" className="mt-16 md:mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-fuchsia-200/80">Portfolio</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Sample Works</h2>
            </div>
            <p className="text-sm text-white/70">Mapped as img1.jpg to img10.jpg from public/works</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {works.map((work, index) => (
              <motion.article
                key={work.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={work.src}
                    alt={work.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      setMissingWorkImages((prev) => ({ ...prev, [work.id]: true }));
                    }}
                  />
                  {missingWorkImages[work.id] && (
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-transparent via-black/20 to-black/60 text-center text-white/80">
                      <span className="rounded-lg border border-white/30 bg-black/40 px-3 py-1 text-sm">{`works/img${work.id}.jpg`}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{work.title}</h3>
                  <p className="mt-1 text-sm text-white/60">Editorial style composition and natural mood lighting.</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...fadeUp}
          id="contact"
          className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:mt-20 md:p-10"
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl">Let's Create Something Beautiful</h2>
              <p className="mt-4 text-white/75">
                Available for destination weddings, premium portraits, brand shoots, and cinematic storytelling projects.
              </p>

              <div className="mt-7 space-y-4 text-sm md:text-base">
                <a href="mailto:hello@yourstudio.com" className="flex items-center gap-3 text-white/90 hover:text-fuchsia-200">
                  <Mail className="h-5 w-5" /> hello@yourstudio.com
                </a>
                <a href="tel:+8801700000000" className="flex items-center gap-3 text-white/90 hover:text-fuchsia-200">
                  <Phone className="h-5 w-5" /> +880 1700-000000
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">Social Links</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm transition hover:-translate-y-1 hover:border-fuchsia-300/50 hover:bg-fuchsia-500/20"
                    >
                      <span className="inline-grid h-6 w-6 place-items-center rounded-full border border-white/30 text-[10px] uppercase">
                        {social.mark}
                      </span>
                      {social.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default App;
