'use client';

import Image from 'next/image';

import type { Category } from '@/types/store';

type CategoryListProps = {
  categories: Category[];
  selectedId: string;
  onSelect: (nextId: string) => void;
};

export default function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-50">Pilih Kategori</h2>
          <p className="mt-1 text-sm text-slate-200/80">
            Klik kategori untuk memfilter produk. Pilih “Semua” untuk melihat semuanya.
          </p>
        </div>
      </div>

      <div className="sm:hidden">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Kategori
        </label>
        <select
          value={selectedId}
          onChange={(event) => onSelect(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-amber-400 transition focus:ring"
        >
          <option value="all">Semua</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden gap-3 overflow-x-auto pb-1 sm:flex">
        <button
          type="button"
          onClick={() => onSelect('all')}
          aria-pressed={selectedId === 'all'}
          className={[
            'flex min-w-[150px] flex-col items-center justify-center gap-2 rounded-3xl border p-4 text-left transition',
            selectedId === 'all'
              ? 'border-emerald-300/60 bg-emerald-300/10'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60',
          ].join(' ')}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
            Semua
          </span>
        </button>

        {categories.map((category) => {
          const isActive = selectedId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              aria-pressed={isActive}
              className={[
                'flex min-w-[150px] flex-col items-center justify-center gap-2 rounded-3xl border p-4 text-left transition',
                isActive
                  ? 'border-emerald-300/60 bg-emerald-300/10'
                  : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60',
              ].join(' ')}
            >
              <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/60">
                <Image
                  src={category.image}
                  alt={category.label}
                  width={96}
                  height={96}
                  className="h-14 w-14 object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.3)]"
                />
              </div>
              <span className="text-sm font-bold text-slate-100">{category.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
