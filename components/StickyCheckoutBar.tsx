import { formatIDR } from '@/lib/currency';

type StickyCheckoutBarProps = {
  totalQty: number;
  totalPrice: number;
  canCheckout: boolean;
  onCheckoutFocus: () => void;
  onCheckoutWhatsApp: () => void;
};

export default function StickyCheckoutBar({
  totalQty,
  totalPrice,
  canCheckout,
  onCheckoutFocus,
  onCheckoutWhatsApp,
}: StickyCheckoutBarProps) {
  const hasItems = totalQty > 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-3 shadow-2xl shadow-black/35 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            Keranjang
          </p>
          <p className="truncate text-sm font-bold text-slate-100">
            {hasItems ? `${totalQty} item • ${formatIDR(totalPrice)}` : 'Masih kosong'}
          </p>
        </div>

        <button
          type="button"
          onClick={canCheckout ? onCheckoutWhatsApp : onCheckoutFocus}
          disabled={!hasItems}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {canCheckout ? 'Kirim via WA' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
}
