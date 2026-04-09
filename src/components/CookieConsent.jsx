import { useEffect, useState } from 'react';

const KEY = 'cookie_consent_mode_v1';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem(KEY);
    setOpen(!val);
  }, []);

  function choose(mode) {
    localStorage.setItem(KEY, mode);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(94vw,700px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
      <p className="text-sm text-slate-700">We use essential cookies for login/session. You can also opt into full cookies for richer analytics.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => choose('essential')} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">Essential only</button>
        <button onClick={() => choose('full')} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Full cookies</button>
      </div>
    </div>
  );
}
