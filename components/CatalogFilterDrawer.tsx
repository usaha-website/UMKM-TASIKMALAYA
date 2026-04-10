'use client';

import { useEffect } from 'react';

import { formatIDR } from '@/lib/currency';
import type { Category, ProductSortOption } from '@/types/store';

type CatalogFilterDrawerProps = {
  categories: Category[];
  selectedCategoryId: string;
  sortOption: ProductSortOption;
  priceBounds: { min: number; max: number };
  priceRange: { min: number; max: number };
  isOpen: boolean;
  onSelectCategory: (categoryId: string) => void;
  onSelectSort: (sortOption: ProductSortOption) => void;
  onPriceRangeChange: (nextRange: { min: number; max: number }) => void;
  onClose: () => void;
};

const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string; description: string }> = [
  {
    value: 'featured',
    label: 'Paling Relevan',
    description: 'Urutan default untuk melihat katalog secara umum.',
  },
  {
    value: 'price-asc',
    label: 'Harga Termurah',
    description: 'Tampilkan produk dari harga paling rendah ke paling tinggi.',
  },
  {
    value: 'price-desc',
    label: 'Harga Termahal',
    description: 'Tampilkan produk premium atau harga tertinggi lebih dulu.',
  },
];

export default function CatalogFilterDrawer({
  categories,
  selectedCategoryId,
  sortOption,
  priceBounds,
  priceRange,
  isOpen,
  onSelectCategory,
  onSelectSort,
  onPriceRangeChange,
  onClose,
}: CatalogFilterDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-slate-950/55 backdrop-blur-[2px]"
      onClick={onClose}
      aria-hidden="true"
    >
      <aside
        className="absolute left-0 top-0 flex h-full w-[min(24rem,92vw)] flex-col border-r border-slate-700/80 bg-slate-950/95 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
        aria-label="Filter katalog"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Filter Katalog
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-50">Kategori & Harga</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-200 transition hover:border-slate-500 hover:text-white"
            aria-label="Tutup filter"
          >
            <span className="text-lg">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              Pilih Kategori
            </p>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                aria-pressed={selectedCategoryId === 'all'}
                className={[
                  'rounded-2xl border px-4 py-3 text-left transition',
                  selectedCategoryId === 'all'
                    ? 'border-emerald-300/50 bg-emerald-300/10 text-slate-50'
                    : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>Semua Kategori</span>
                  {selectedCategoryId === 'all' ? (
                    <span className="text-sm font-semibold text-emerald-200">✓</span>
                  ) : (
                    <span className="text-sm text-slate-600">•</span>
                  )}
                </div>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(category.id);
                    onClose();
                  }}
                  aria-pressed={selectedCategoryId === category.id}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left transition',
                    selectedCategoryId === category.id
                      ? 'border-emerald-300/50 bg-emerald-300/10 text-slate-50'
                      : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{category.label}</span>
                    {selectedCategoryId === category.id ? (
                      <span className="text-sm font-semibold text-emerald-200">✓</span>
                    ) : (
                      <span className="text-sm text-slate-600">•</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              Urutkan Harga
            </p>
            <div className="mt-4 space-y-3">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelectSort(option.value);
                    onClose();
                  }}
                  className={[
                    'w-full rounded-2xl border px-4 py-3 text-left transition',
                    sortOption === option.value
                      ? 'border-emerald-300/50 bg-emerald-300/10'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900',
                  ].join(' ')}
                >
                  <p className="text-sm font-semibold text-slate-50">{option.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{option.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              Filter dari Rentang Harga
            </p>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-slate-100">
              <span>Min {formatIDR(priceBounds.min)}</span>
              <span>Max {formatIDR(priceBounds.max)}</span>
            </div>
            <div className="mt-4 space-y-3">
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={1000}
                value={priceRange.min}
                onChange={(event) => {
                  const nextMin = Math.min(Number(event.target.value), priceRange.max);
                  onPriceRangeChange({ min: nextMin, max: priceRange.max });
                }}
                className="range-slider w-full"
                aria-label="Rentang harga minimum"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step={1000}
                value={priceRange.max}
                onChange={(event) => {
                  const nextMax = Math.max(Number(event.target.value), priceRange.min);
                  onPriceRangeChange({ min: priceRange.min, max: nextMax });
                }}
                className="range-slider w-full"
                aria-label="Rentang harga maksimum"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Min {formatIDR(priceRange.min)}</span>
                <span>Max {formatIDR(priceRange.max)}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              Rentang awal otomatis mengikuti harga termurah dan termahal.
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
}
