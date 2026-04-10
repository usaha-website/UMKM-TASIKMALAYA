type StoreMapSectionProps = {
  storeName: string;
  embedUrl: string;
  mapUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};

export default function StoreMapSection({
  storeName,
  embedUrl,
  mapUrl,
  socialLinks,
}: StoreMapSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-xl shadow-black/20 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-100 md:text-xl">Lokasi Toko</h2>
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-md border border-amber-400/50 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/10"
        >
          Buka di Google Maps
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <iframe
          title={`Lokasi ${storeName}`}
          src={embedUrl}
          width="100%"
          height="280"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Ikuti Kami
        </p>
        <div className="flex items-center gap-2">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:border-emerald-300/50 hover:text-emerald-200"
            aria-label="Instagram UMKM Tasikmalaya GEUWAT"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17" cy="7" r="1.2" fill="currentColor" />
            </svg>
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:border-emerald-300/50 hover:text-emerald-200"
            aria-label="Facebook UMKM Tasikmalaya GEUWAT"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v5h3v-5h3l1-3h-4V9c0-.6.4-1 1-1z" />
            </svg>
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:border-emerald-300/50 hover:text-emerald-200"
            aria-label="TikTok UMKM Tasikmalaya GEUWAT"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M15 3c.5 2.2 2.3 3.9 4.5 4.3V10c-1.7 0-3.3-.5-4.5-1.5V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v2.7c-.3-.1-.7-.2-1-.2a2.2 2.2 0 1 0 2.2 2.2V3h2.8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
