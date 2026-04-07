import ProductCard from '@/components/ProductCard';
import type { Product, ProductVariant } from '@/types/store';

type ProductGridProps = {
  products: Product[];
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onCheckoutFocus: () => void;
};

export default function ProductGrid({ products, onAddToCart, onCheckoutFocus }: ProductGridProps) {
  return (
    <section id="produk" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Produk</h2>
        <p className="text-sm text-slate-300">
          Pilih kategori, lalu pilih ukuran yang kamu butuhkan.
        </p>
      </div>

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
    </section>
  );
}
