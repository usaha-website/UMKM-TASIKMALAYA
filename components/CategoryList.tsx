'use client';

import Image from 'next/image';

import type { Category } from '@/types/store';

type CategoryListProps = {
  categories: Category[];
  selectedId: string;
  onSelect: (nextId: string) => void;
};

export default function CategoryList({
  categories,
  selectedId,
  onSelect,
}: CategoryListProps) {
  const singletCategory = categories.find((category) => category.id === 'singlet');

  if (!singletCategory) {
    return null;
  }

  const isActive = selectedId === singletCategory.id;

  return (
    <section className="flex">
      <button
        type="button"
        onClick={() => onSelect(singletCategory.id)}
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
            src={singletCategory.image}
            alt={singletCategory.label}
            width={96}
            height={96}
            className="h-14 w-14 object-contain drop-shadow-[0_16px_18px_rgba(0,0,0,0.3)]"
          />
        </div>
        <span className="text-sm font-bold text-slate-100">{singletCategory.label}</span>
      </button>
    </section>
  );
}
