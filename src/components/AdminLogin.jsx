import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, X, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabase";

export function AdminLogin({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("Invalid credentials. Please try again.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }

      onSuccess();
    } catch {
      setError("Could not sign in. Check your connection and try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-2xl ${
          shake ? "animate-shake" : ""
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/20 to-blue-500/20 shadow-lg shadow-fuchsia-500/10">
              <Lock className="h-7 w-7 text-fuchsia-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/20">
              <Key className="h-3 w-3 text-yellow-300" />
            </div>
          </div>
        </div>

        <h2 className="mb-1 text-center text-2xl font-semibold text-white">
          Admin Access
        </h2>
        <p className="mb-8 text-center text-sm text-white/40">
          Sign in with your Supabase admin account (only you have this login)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/40">
              Admin email
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-fuchsia-500/50 focus:bg-white/8 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/40">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-sm text-white placeholder-white/20 outline-none transition focus:border-fuchsia-500/50 focus:bg-white/8 focus:ring-2 focus:ring-fuchsia-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:from-fuchsia-500 hover:to-blue-500 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {loading ? "Signing in..." : "Unlock Admin Panel"}
          </button>
        </form>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
