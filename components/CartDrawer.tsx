import { computeCartTotals, getCartItemKey } from '@/lib/cart';
import { formatIDR } from '@/lib/currency';
import type { CartItem } from '@/types/store';

type CartDrawerProps = {
  cart: CartItem[];
  onIncrease: (key: string, nextQty: number) => void;
  onDecrease: (key: string, nextQty: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onCheckoutFocus: () => void;
  variant?: 'panel' | 'modal';
  onClose?: () => void;
};

export default function CartDrawer({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckoutFocus,
  variant = 'panel',
  onClose,
}: CartDrawerProps) {
  const totals = computeCartTotals(cart);
  const isModal = variant === 'modal';

  return (
    <aside
      className={
        isModal
          ? 'w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl shadow-black/40 batik-surface'
          : 'sticky top-4 h-fit rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl shadow-black/25 batik-surface'
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-100">Keranjang</h2>
        <div className="flex items-center gap-2">
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 batik-pill">
          {totals.totalQty} item
        </span>
          {isModal && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Tutup
            </button>
          ) : null}
        </div>
      </div>

      {cart.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400 batik-card">
          Keranjang masih kosong.
        </p>
      ) : (
        <ul className="space-y-3">
          {cart.map((item) => {
            const key = getCartItemKey(item.productId, item.variantId);
            const subtotal = item.unitPrice * item.qty;

            return (
              <li key={key} className="rounded-xl border border-slate-700 bg-slate-800/80 p-3 batik-card">
                <p className="text-sm font-semibold text-slate-100">{item.productName}</p>
                <p className="text-xs text-slate-300 batik-subtle">{item.variantLabel}</p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDecrease(key, item.qty - 1)}
                      className="h-7 w-7 rounded border border-slate-600 text-sm text-slate-100 transition hover:bg-slate-700 batik-outline"
                      aria-label={`Kurangi qty ${item.productName}`}
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold text-slate-100">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onIncrease(key, item.qty + 1)}
                      className="h-7 w-7 rounded border border-slate-600 text-sm text-slate-100 transition hover:bg-slate-700 batik-outline"
                      aria-label={`Tambah qty ${item.productName}`}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400 batik-subtle">Subtotal</p>
                    <p className="text-sm font-semibold text-amber-300 batik-gold">
                      {formatIDR(subtotal)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(key)}
                  className="mt-2 text-xs font-semibold text-rose-300 transition hover:text-rose-200"
                >
                  Hapus
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 border-t border-slate-700 pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300 batik-subtle">Total Produk</span>
          <span className="font-bold text-amber-300 batik-gold">{formatIDR(totals.totalPrice)}</span>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={onCheckoutFocus}
            disabled={cart.length === 0}
            className="rounded-lg bg-[rgba(214,178,123,0.95)] px-3 py-2 text-sm font-bold text-[#23170b] transition hover:bg-[rgba(214,178,123,1)] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            Lanjut Checkout
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={cart.length === 0}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 batik-outline"
          >
            Kosongkan Keranjang
          </button>
        </div>
      </div>
    </aside>
  );
}
