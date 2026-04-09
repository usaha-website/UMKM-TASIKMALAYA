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
  {
    value: 'name-asc',
    label: 'Dual Range Slider',
    description: 'Dual Range Slider',
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
                className={[
                  'rounded-2xl border px-4 py-3 text-left transition',
                  selectedCategoryId === 'all'
                    ? 'border-emerald-300/50 bg-emerald-300/10 text-slate-50'
                    : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900',
                ].join(' ')}
              >
                Semua Kategori
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(category.id);
                    onClose();
                  }}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left transition',
                    selectedCategoryId === category.id
                      ? 'border-emerald-300/50 bg-emerald-300/10 text-slate-50'
                      : 'border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-900',
                  ].join(' ')}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
              Rentang Harga
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <span>Min</span>
                  <span>Max</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-100">
                  <span>{formatIDR(priceRange.min)}</span>
                  <span>{formatIDR(priceRange.max)}</span>
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
                    className="w-full accent-emerald-300"
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
                    className="w-full accent-emerald-300"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Geser rentang untuk menyesuaikan harga produk.
              </p>
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
        </div>
      </aside>
    </div>
  );
}
