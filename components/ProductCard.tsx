'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { formatIDR } from '@/lib/currency';
import type { Product, ProductVariant } from '@/types/store';

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onCheckoutFocus: () => void;
};

type ProductColorOption = {
  id: string;
  label: string;
  swatch: string;
};

const COLOR_OPTIONS: ProductColorOption[] = [
  { id: 'hitam', label: 'Hitam', swatch: '#0f172a' },
  { id: 'putih', label: 'Putih', swatch: '#f8fafc' },
  { id: 'abu', label: 'Abu', swatch: '#94a3b8' },
  { id: 'navy', label: 'Navy', swatch: '#1e3a8a' },
  { id: 'maroon', label: 'Maroon', swatch: '#7f1d1d' },
];

function getDefaultVariantId(variants: ProductVariant[]): string {
  const medium = variants.find((variant) => variant.label.toLowerCase() === 'm');
  return medium?.id ?? variants[0]?.id ?? '';
}

export default function ProductCard({ product, onAddToCart, onCheckoutFocus }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() =>
    getDefaultVariantId(product.variants),
  );
  const [selectedColorId, setSelectedColorId] = useState<string>(() => COLOR_OPTIONS[0]?.id ?? '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const canUseDom = typeof document !== 'undefined';
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0],
    [product.variants, selectedVariantId],
  );

  const selectedColor = useMemo(() => {
    return COLOR_OPTIONS.find((color) => color.id === selectedColorId) ?? COLOR_OPTIONS[0];
  }, [selectedColorId]);

  const galleryImages = useMemo(() => {
    return Array.from({ length: 5 }, () => product.image);
  }, [product.image]);

  const minPrice = useMemo(() => {
    if (product.variants.length === 0) {
      return 0;
    }

    return product.variants.reduce((min, v) => Math.min(min, v.price), product.variants[0].price);
  }, [product.variants]);

  function scrollCarouselTo(index: number) {
    const el = carouselRef.current;
    if (!el) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(galleryImages.length - 1, index));
    el.scrollTo({ left: safeIndex * el.clientWidth, behavior: 'smooth' });
    setActiveImageIndex(safeIndex);
  }

  function handleCarouselScroll() {
    const el = carouselRef.current;
    if (!el) {
      return;
    }

    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const nextIndex = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setActiveImageIndex(Math.max(0, Math.min(galleryImages.length - 1, nextIndex)));
    });
  }

  function addSelectedToCart(multiplier: number) {
    if (!selectedVariant) {
      return;
    }

    const decoratedVariant: ProductVariant = selectedColor
      ? {
          ...selectedVariant,
          id: `${selectedVariant.id}::${selectedColor.id}`,
          label: `${selectedVariant.label} / ${selectedColor.label}`,
        }
      : selectedVariant;

    const count = Math.max(1, Math.floor(multiplier));
    for (let i = 0; i < count; i += 1) {
      onAddToCart(product, decoratedVariant);
    }
  }

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setPreviewOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [previewOpen]);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-700/80 bg-slate-900/55 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-slate-900/70">
      <div className="mb-4 overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/70 p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={180}
          className="mx-auto h-40 w-40 object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.32)] transition group-hover:scale-[1.02]"
        />
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-base font-bold text-slate-100">{product.name}</h3>
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            Mulai dari
          </p>
          <p className="text-lg font-bold text-emerald-200">{formatIDR(minPrice)} / pcs</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setQty(1);
          setActiveImageIndex(0);
          setSelectedColorId(COLOR_OPTIONS[0]?.id ?? '');
          setPreviewOpen(true);
        }}
        className="mt-5 w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
      >
        Lihat Detail
      </button>

      {previewOpen && canUseDom
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Preview ${product.name}`}
              className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4 overscroll-contain"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setPreviewOpen(false);
                }
              }}
            >
              <div className="mx-auto my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-700/80 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-700/70 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                      Detail Produk
                    </p>
                    <h4 className="truncate text-base font-bold text-slate-50 md:text-lg">
                      {product.name}
                    </h4>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="rounded-2xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900"
                  >
                    Tutup
                  </button>
                </div>

                <div className="grid flex-1 gap-0 overflow-y-auto overscroll-contain md:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-slate-700/70 bg-slate-900/30 p-5 md:border-b-0 md:border-r">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/40">
                      <div
                        ref={carouselRef}
                        onScroll={handleCarouselScroll}
                        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x"
                      >
                        {galleryImages.map((src, index) => (
                          <div
                            key={`${product.id}-gallery-${index}`}
                            className="min-w-full snap-center p-6"
                          >
                            <Image
                              src={src}
                              alt={`${product.name} - foto ${index + 1}`}
                              width={720}
                              height={720}
                              className="mx-auto h-80 w-80 object-contain drop-shadow-[0_26px_36px_rgba(0,0,0,0.42)] md:h-[420px] md:w-[420px]"
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => scrollCarouselTo(activeImageIndex - 1)}
                        disabled={activeImageIndex === 0}
                        className={[
                          'absolute left-4 top-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-sm font-bold text-slate-100 shadow-lg shadow-black/30 backdrop-blur transition',
                          activeImageIndex === 0
                            ? 'cursor-not-allowed opacity-35'
                            : 'hover:bg-slate-950/80',
                        ].join(' ')}
                        aria-label="Foto sebelumnya"
                      >
                        &#8249;
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollCarouselTo(activeImageIndex + 1)}
                        disabled={activeImageIndex >= galleryImages.length - 1}
                        className={[
                          'absolute right-4 top-1/2 -translate-y-1/2 rounded-2xl border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-sm font-bold text-slate-100 shadow-lg shadow-black/30 backdrop-blur transition',
                          activeImageIndex >= galleryImages.length - 1
                            ? 'cursor-not-allowed opacity-35'
                            : 'hover:bg-slate-950/80',
                        ].join(' ')}
                        aria-label="Foto berikutnya"
                      >
                        &#8250;
                      </button>

                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur">
                        <span className="tabular-nums">
                          {activeImageIndex + 1}/{galleryImages.length}
                        </span>
                        <span className="h-3 w-px bg-slate-700/80" aria-hidden="true" />
                        <div className="flex items-center gap-1">
                          {galleryImages.map((_, index) => (
                            <button
                              key={`${product.id}-dot-${index}`}
                              type="button"
                              onClick={() => scrollCarouselTo(index)}
                              className={[
                                'h-1.5 w-1.5 rounded-full transition',
                                index === activeImageIndex ? 'bg-emerald-300' : 'bg-slate-500/70',
                              ].join(' ')}
                              aria-label={`Buka foto ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 touch-pan-y">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                      Harga per pcs
                    </p>
                    <p className="font-display mt-2 text-3xl font-semibold text-emerald-200 md:text-4xl">
                      {selectedVariant ? `${formatIDR(selectedVariant.price)} / pcs` : '-'}
                    </p>

                    <p className="mt-4 text-sm text-slate-200/80">{product.description}</p>

                    {product.details?.length ? (
                      <div className="mt-5 rounded-3xl border border-slate-700/70 bg-slate-900/35 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          Keterangan Produk
                        </p>
                        <dl className="mt-3 space-y-3">
                          {product.details.map((detail) => (
                            <div
                              key={`${product.id}-${detail.label}`}
                              className="grid gap-1 sm:grid-cols-[120px_1fr] sm:gap-3"
                            >
                              <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                                {detail.label}
                              </dt>
                              <dd className="text-sm font-semibold text-slate-100">
                                {detail.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                        Variasi (Ukuran)
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {product.variants.map((variant) => {
                          const isActive = variant.id === selectedVariantId;

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() => setSelectedVariantId(variant.id)}
                              aria-pressed={isActive}
                              className={[
                                'rounded-2xl border px-3 py-2 text-left transition',
                                isActive
                                  ? 'border-emerald-300/60 bg-emerald-300/10'
                                  : 'border-slate-700 bg-slate-950/20 hover:border-slate-600 hover:bg-slate-950/35',
                              ].join(' ')}
                            >
                              <p className="text-sm font-bold text-slate-100">{variant.label}</p>
                              <p className="mt-0.5 text-[11px] font-semibold text-slate-300">
                                {formatIDR(variant.price)} / pcs
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                        Warna
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map((color) => {
                          const isActive = color.id === selectedColorId;

                          return (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => setSelectedColorId(color.id)}
                              aria-pressed={isActive}
                              className={[
                                'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition',
                                isActive
                                  ? 'border-emerald-300/60 bg-emerald-300/10 text-slate-50'
                                  : 'border-slate-700 bg-slate-950/20 text-slate-100 hover:border-slate-600 hover:bg-slate-950/35',
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  'h-5 w-5 rounded-full border',
                                  color.id === 'putih' ? 'border-slate-400' : 'border-white/10',
                                ].join(' ')}
                                style={{ backgroundColor: color.swatch }}
                                aria-hidden="true"
                              />
                              <span>{color.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3 rounded-3xl border border-slate-700/70 bg-slate-900/35 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          Jumlah
                        </p>
                        <p className="text-sm font-semibold text-slate-100">
                          Total: {formatIDR((selectedVariant?.price ?? 0) * qty)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty((current) => Math.max(1, current - 1))}
                          className="h-10 w-10 rounded-2xl border border-slate-700 bg-slate-950/30 text-lg font-bold text-slate-100 transition hover:bg-slate-900"
                          aria-label="Kurangi jumlah"
                        >
                          -
                        </button>
                        <span className="min-w-10 text-center text-base font-bold text-slate-100">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty((current) => Math.min(99, current + 1))}
                          className="h-10 w-10 rounded-2xl border border-slate-700 bg-slate-950/30 text-lg font-bold text-slate-100 transition hover:bg-slate-900"
                          aria-label="Tambah jumlah"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          addSelectedToCart(qty);
                          setPreviewOpen(false);
                        }}
                        className="rounded-2xl border border-emerald-300/50 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
                      >
                        Tambah ke Keranjang
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addSelectedToCart(qty);
                          setPreviewOpen(false);
                          onCheckoutFocus();
                        }}
                        className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                      >
                        Beli Sekarang
                      </button>
                    </div>

                    <p className="mt-4 text-xs text-slate-300">
                      Tips: Klik &quot;Beli Sekarang&quot; untuk lanjut isi data dan kirim via
                      WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </article>
  );
}
