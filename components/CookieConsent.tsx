'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'umkm_cookie_consent';

type ConsentChoice = 'accepted' | 'declined';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function handleChoice(choice: ConsentChoice) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, choice);
    }
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[140] mx-auto max-w-3xl rounded-3xl border border-amber-300/40 bg-slate-950/90 p-4 shadow-2xl shadow-black/40 backdrop-blur batik-surface">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">Izin Penggunaan Cookies</p>
          <p className="mt-1 text-xs text-slate-300 batik-subtle">
            Kami memakai cookies untuk membantu performa situs, analitik sederhana, dan pengalaman
            belanja yang lebih nyaman. Anda bisa menyetujui atau menolak.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleChoice('declined')}
            className="rounded-2xl border border-slate-600/80 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-300/60 hover:bg-slate-900 batik-outline"
          >
            Tolak
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="rounded-2xl bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 batik-accent"
          >
            Setuju
          </button>
        </div>
      </div>
    </div>
  );
}
