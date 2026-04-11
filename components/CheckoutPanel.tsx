import type { BuyerLocation, CustomerInfo } from '@/types/store';

type CheckoutPanelProps = {
  customer: CustomerInfo;
  onCustomerChange: (field: keyof CustomerInfo, value: string) => void;
  rememberData: boolean;
  onRememberDataChange: (value: boolean) => void;
  buyerLocation: BuyerLocation;
  manualLocationInput: string;
  onManualLocationChange: (value: string) => void;
  onManualLocationApply: () => void;
  onGetLocation: () => void;
  isCheckingLocation: boolean;
  shippingNote: string;
  canCheckout: boolean;
  validationMessage: string | null;
  onCheckoutWhatsApp: () => void;
};

function getLocationStatusText(location: BuyerLocation): string {
  switch (location.status) {
    case 'loading':
      return 'Mengambil lokasi...';
    case 'granted':
      if (location.mapsUrl) {
        return 'Lokasi otomatis tersimpan.';
      }
      if (location.manualUrl) {
        return 'Lokasi manual tersimpan.';
      }
      return 'Lokasi berhasil diambil.';
    case 'denied':
      return 'Izin lokasi ditolak. Gunakan link lokasi manual.';
    case 'error':
      return 'Gagal mengambil lokasi. Gunakan link lokasi manual.';
    default:
      if (location.manualUrl) {
        return 'Lokasi manual tersimpan.';
      }
      return 'Lokasi belum diisi.';
  }
}

export default function CheckoutPanel({
  customer,
  onCustomerChange,
  rememberData,
  onRememberDataChange,
  buyerLocation,
  manualLocationInput,
  onManualLocationChange,
  onManualLocationApply,
  onGetLocation,
  isCheckingLocation,
  shippingNote,
  canCheckout,
  validationMessage,
  onCheckoutWhatsApp,
}: CheckoutPanelProps) {
  const statusText = getLocationStatusText(buyerLocation);
  const locationUrl = buyerLocation.mapsUrl || buyerLocation.manualUrl;

  return (
    <section
      id="checkout"
      className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl shadow-black/20 batik-surface"
    >
      <h2 className="text-xl font-bold text-slate-100">Checkout</h2>
      <p className="mt-1 text-sm text-slate-300 batik-subtle">
        Isi data pembeli lalu kirim pesanan via WhatsApp.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-200 batik-subtle">
          Nama
          <input
            value={customer.name}
            onChange={(event) => onCustomerChange('name', event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-amber-300/80 transition focus:ring batik-outline"
            placeholder="Nama lengkap"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-200 batik-subtle">
          No HP
          <input
            value={customer.phone}
            onChange={(event) => onCustomerChange('phone', event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-amber-300/80 transition focus:ring batik-outline"
            placeholder="08xxxxxxxxxx"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1 text-sm text-slate-200 batik-subtle">
        Alamat
        <textarea
          value={customer.address}
          onChange={(event) => onCustomerChange('address', event.target.value)}
          className="min-h-[90px] rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-amber-300/80 transition focus:ring batik-outline"
          placeholder="Alamat lengkap pengiriman"
        />
      </label>

      <label className="mt-3 flex items-center gap-2 text-sm text-slate-200 batik-subtle">
        <input
          type="checkbox"
          checked={rememberData}
          onChange={(event) => onRememberDataChange(event.target.checked)}
          className="h-4 w-4 rounded border border-slate-500 bg-slate-900 text-amber-300 focus:ring-amber-300/60"
        />
        <span>Ingat data saya untuk kunjungan berikutnya.</span>
      </label>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/70 p-3 batik-card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">
          Lokasi Pembeli (Opsional)
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onGetLocation}
            disabled={isCheckingLocation}
            className="rounded-lg border border-amber-300/60 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingLocation ? 'Memproses...' : 'Ambil Lokasi Saya'}
          </button>
          <span className="text-xs text-slate-300 batik-subtle">{statusText}</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Klik tombol <span className="font-semibold text-emerald-200">Ambil Lokasi Saya</span> untuk
          mengisi lokasi otomatis.
        </p>

        {locationUrl ? (
          <p className="mt-2 break-all text-xs text-emerald-200 batik-gold">
            Lokasi aktif: {locationUrl}
          </p>
        ) : null}

        {(buyerLocation.status === 'denied' ||
          buyerLocation.status === 'error' ||
          !locationUrl) && (
          <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              value={manualLocationInput}
              onChange={(event) => onManualLocationChange(event.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-amber-300/80 transition focus:ring batik-outline"
              placeholder="Tempel link Google Maps lokasi pembeli"
            />
            <button
              type="button"
              onClick={onManualLocationApply}
              className="rounded-lg border border-slate-500 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 batik-outline"
            >
              Gunakan Link
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100 batik-card">
        {shippingNote}
      </p>

      {validationMessage ? <p className="mt-3 text-sm text-rose-300">{validationMessage}</p> : null}

      <button
        type="button"
        onClick={onCheckoutWhatsApp}
        disabled={!canCheckout}
        className={[
          'mt-4 w-full rounded-lg bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/25 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-300/50 disabled:text-slate-900/80 disabled:opacity-80 batik-accent',
          canCheckout ? 'ring-2 ring-amber-200/70 shadow-amber-300/40' : '',
        ].join(' ')}
      >
        Pesan via WhatsApp
      </button>
    </section>
  );
}
