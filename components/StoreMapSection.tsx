type StoreMapSectionProps = {
  storeName: string;
  embedUrl: string;
  mapUrl: string;
};

export default function StoreMapSection({ storeName, embedUrl, mapUrl }: StoreMapSectionProps) {
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
    </section>
  );
}
