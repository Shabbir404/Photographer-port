const GATE_KEY = "portfolio_admin_gate";

export function isAdminGateUnlocked() {
  return sessionStorage.getItem(GATE_KEY) === "1";
}

export function unlockAdminGate() {
  sessionStorage.setItem(GATE_KEY, "1");
}

/** Optional: visit /?gate=YOUR_SECRET once (set VITE_ADMIN_GATE_SECRET in .env) */
export function tryUnlockFromUrl() {
  const secret = import.meta.env.VITE_ADMIN_GATE_SECRET;
  if (!secret) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("gate") === secret) {
    unlockAdminGate();
    const clean = window.location.pathname + window.location.hash;
    window.history.replaceState({}, "", clean);
  }
}
