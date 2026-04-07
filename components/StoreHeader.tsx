import Image from 'next/image';

type StoreHeaderProps = {
  storeName: string;
  chatUrl: string;
  mapUrl: string;
};

export default function StoreHeader({ storeName, chatUrl, mapUrl }: StoreHeaderProps) {
  const storeLabel = storeName
    .replace(/^UMKM[-\s]*/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  return (
    <header className="relative overflow-hidden border-b border-slate-700/70 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-slate-700/70 bg-slate-900/50 p-2 shadow-lg shadow-black/20 md:h-[72px] md:w-[72px]">
              <Image
                src="/LogoUMKM%20Tasikmalaya-Photoroom.png"
                alt="Logo UMKM Tasikmalaya"
                width={80}
                height={80}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                UMKM
              </p>
              <h1 className="truncate text-xl font-bold text-slate-100 md:text-2xl">
                {storeLabel || 'Tasikmalaya'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-xl border border-slate-600/80 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/70 md:inline-flex"
            >
              Lihat Lokasi
            </a>
            <a
              href={chatUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Produk Lokal Tasikmalaya
            </span>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.04] text-slate-50 md:text-6xl">
              Bangga Produk Sendiri. Nyaman Dipakai, Buatan Tasikmalaya.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-slate-200/85 md:text-base">
              Setiap pembelian produk lokal berarti kamu ikut menghidupkan UMKM Tasikmalaya.
              Kualitas kami jaga, harga tetap masuk akal, dan uangnya berputar kembali untuk warga
              sendiri.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#produk"
                className="inline-flex items-center justify-center rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                Mulai Belanja
              </a>
              <a
                href="#checkout"
                className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-900/30 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900/60"
              >
                Langsung Checkout
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/45 p-5 shadow-xl shadow-black/25 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              Cara pesan
            </p>
            <ol className="mt-3 space-y-3 text-sm text-slate-100">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-100">
                  1
                </span>
                <span>Pilih kategori dan ukuran produk.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-100">
                  2
                </span>
                <span>Masukkan ke keranjang, lalu isi data & lokasi.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-100">
                  3
                </span>
                <span>Kirim pesanan via WhatsApp untuk konfirmasi.</span>
              </li>
            </ol>

            <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50/90">
              Ongkir disesuaikan dengan aplikasi Gojek.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
