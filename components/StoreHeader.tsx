'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { SITE_NAVIGATION } from '@/data/site-navigation';

type HeaderAction = {
  href: string;
  label: string;
  external?: boolean;
};

type HeaderInfoStep = {
  title: string;
  description: string;
};

type StoreHeaderProps = {
  storeName: string;
  chatUrl: string;
  mapUrl: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: HeaderAction;
  secondaryAction?: HeaderAction;
  infoTitle?: string;
  infoSteps?: HeaderInfoStep[];
  infoNote?: string;
};

function HeaderLink({
  action,
  variant = 'solid',
}: {
  action: HeaderAction;
  variant?: 'solid' | 'outline';
}) {
  const className =
    variant === 'solid'
      ? 'inline-flex items-center justify-center rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white'
      : 'inline-flex items-center justify-center rounded-xl border border-amber-300/35 bg-[rgba(28,20,12,0.6)] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-[rgba(32,22,13,0.8)]';

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={className}>
        {action.label}
      </a>
    );
  }

  if (action.href.startsWith('#')) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function StoreHeader({
  storeName,
  chatUrl,
  mapUrl,
  eyebrow = 'Produk Lokal Tasikmalaya',
  title = 'Bangga Produk Sendiri Nyaman Dipakai Buatan Tasikmalaya',
  description = 'Setiap pembelian produk lokal berarti kamu ikut menghidupkan UMKM Tasikmalaya GEUWAT. Kualitas kami jaga, harga tetap masuk akal, dan uangnya berputar kembali untuk warga sendiri.',
  primaryAction = {
    href: '#produk',
    label: 'Mulai Belanja',
  },
  secondaryAction,
  infoTitle = 'Cara pesan',
  infoSteps = [
    {
      title: 'Pilih kategori dan ukuran produk.',
      description: 'Cari varian yang paling pas untuk kebutuhan Anda.',
    },
    {
      title: 'Masukkan ke keranjang, lalu isi data & lokasi.',
      description: 'Semua rekap pesanan disusun otomatis agar lebih cepat diproses.',
    },
    {
      title: 'Kirim pesanan via WhatsApp untuk konfirmasi.',
      description: 'Admin tinggal cek detail dan melanjutkan proses order Anda.',
    },
  ],
  infoNote = 'Ongkir disesuaikan sebelum pembayaran saat pemesanan via WhatsApp.',
}: StoreHeaderProps) {
  const storeLabel = storeName.replace(/[-_]+/g, ' ').trim();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <header className="batik-hero relative overflow-hidden border-b border-amber-300/25 bg-[rgba(20,15,10,0.9)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,178,123,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(199,155,91,0.16),transparent_55%)]" />
      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-40 bg-[rgba(20,15,10,0.65)] backdrop-blur-[2px]"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="site-menu"
            className="absolute right-4 top-1/2 w-[min(22rem,calc(100vw-2rem))] -translate-y-1/2 rounded-[2rem] border border-amber-300/25 bg-[rgba(20,15,10,0.95)] p-5 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Navigasi
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-50">
                  {storeLabel || 'UMKM Tasikmalaya GEUWAT'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/25 bg-[rgba(28,20,12,0.7)] text-slate-200 transition hover:border-amber-300/60 hover:text-white"
                aria-label="Tutup menu"
              >
                <span className="text-lg">x</span>
              </button>
            </div>

            <nav className="mt-5 space-y-2">
              {SITE_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-amber-300/20 bg-[rgba(28,20,12,0.7)] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-amber-300/50 hover:bg-[rgba(32,22,13,0.8)]"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-500">-></span>
                </Link>
              ))}
            </nav>

            <div className="mt-5 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-sm font-semibold text-emerald-100">
                Mau tanya cepat dulu sebelum pilih halaman?
              </p>
              <a
                href={chatUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                <Image
                  src="/whatsapp-logo.svg"
                  alt="WhatsApp"
                  width={22}
                  height={22}
                  className="h-5 w-5"
                />
                <span className="sr-only">Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-amber-300/25 bg-[rgba(28,20,12,0.7)] p-2 shadow-lg shadow-black/20 md:h-[72px] md:w-[72px]">
              <Image
                src="/LogoUMKM%20Tasikmalaya-Photoroom.png"
                alt="Logo UMKM Tasikmalaya GEUWAT"
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
              <h1 className="break-words text-lg font-bold leading-tight text-slate-100 sm:text-xl md:text-2xl">
                {storeLabel || 'UMKM Tasikmalaya GEUWAT'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl border border-amber-300/35 bg-[rgba(28,20,12,0.6)] px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-amber-300/60 hover:bg-[rgba(32,22,13,0.8)] sm:text-sm"
            >
              Lihat Map
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-2xl border border-amber-300/35 bg-[rgba(28,20,12,0.6)] transition hover:border-amber-300/60 hover:bg-[rgba(32,22,13,0.8)]"
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              aria-label="Buka menu navigasi"
            >
              <span className="h-0.5 w-5 rounded-full bg-slate-100" />
              <span className="h-0.5 w-5 rounded-full bg-slate-100" />
              <span className="h-0.5 w-5 rounded-full bg-slate-100" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              {eyebrow}
            </span>
            <h2 className="font-display mt-4 text-4xl font-semibold leading-[1.04] text-slate-50 md:text-6xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-slate-200/85 md:text-base">{description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <HeaderLink action={primaryAction} />
              {secondaryAction ? <HeaderLink action={secondaryAction} variant="outline" /> : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/45 p-5 shadow-xl shadow-black/25 backdrop-blur batik-surface">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 batik-subtle">
              {infoTitle}
            </p>
            <ol className="mt-3 space-y-3 text-sm text-slate-100">
              {infoSteps.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-100 batik-pill">
                    {index + 1}
                  </span>
                  <span>
                    <strong className="font-semibold text-slate-50">{item.title}</strong>{' '}
                    <span className="text-slate-300 batik-subtle">{item.description}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-50/90 batik-card batik-subtle">
              {infoNote}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}



