import ProductCard from '@/components/ProductCard';
import type { Product, ProductSortOption, ProductVariant } from '@/types/store';

type ProductGridProps = {
  products: Product[];
  totalProducts: number;
  searchQuery: string;
  activeCategoryLabel: string;
  sortOption: ProductSortOption;
  currentPage: number;
  totalPages: number;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onCheckoutFocus: () => void;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onPageChange: (page: number) => void;
};

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M4 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function getSortLabel(sortOption: ProductSortOption) {
  switch (sortOption) {
    case 'price-asc':
      return 'Harga Termurah';
    case 'price-desc':
      return 'Harga Termahal';
    case 'name-asc':
      return 'Nama A-Z';
    default:
      return 'Paling Relevan';
  }
}

export default function ProductGrid({
  products,
  totalProducts,
  searchQuery,
  activeCategoryLabel,
  sortOption,
  currentPage,
  totalPages,
  onAddToCart,
  onCheckoutFocus,
  onSearchChange,
  onOpenFilters,
  onPageChange,
}: ProductGridProps) {
  const startIndex = totalProducts === 0 ? 0 : (currentPage - 1) * 6 + 1;
  const endIndex = totalProducts === 0 ? 0 : startIndex + products.length - 1;

  return (
    <section id="produk" className="space-y-4">
      <div className="rounded-[2rem] border border-slate-700/70 bg-slate-900/45 p-4 shadow-xl shadow-black/20 backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Produk</h2>
            <p className="mt-1 text-sm text-slate-300">
              Cari produk lebih cepat, lalu buka filter kiri untuk sortir kategori dan harga.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="block sm:min-w-[320px]">
              <span className="sr-only">Cari produk</span>
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Cari nama produk atau deskripsi..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
              />
            </label>

            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-600/80 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:bg-slate-900"
            >
              <FilterIcon />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            Menampilkan {startIndex}-{endIndex} dari {totalProducts} produk
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-3 py-1">
              Kategori: {activeCategoryLabel}
            </span>
            <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-3 py-1">
              Urutan: {getSortLabel(sortOption)}
            </span>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onCheckoutFocus={onCheckoutFocus}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-700/80 bg-slate-900/35 px-5 py-10 text-center">
          <p className="text-lg font-semibold text-slate-100">Produk tidak ditemukan</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Coba ganti kata pencarian, pilih kategori lain, atau ubah sortir dari panel kiri.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-700/70 bg-slate-900/35 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-300">
          Halaman {currentPage} dari {totalPages}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-pressed={isActive}
                className={[
                  'h-10 min-w-10 rounded-2xl border px-3 text-sm font-bold transition',
                  isActive
                    ? 'border-emerald-300/60 bg-emerald-300/10 text-slate-50'
                    : 'border-slate-700 bg-slate-950/50 text-slate-100 hover:bg-slate-900',
                ].join(' ')}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </section>
  );
}
