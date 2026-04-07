import type { BuyerLocation, CartItem, CustomerInfo, StoreConfig } from '@/types/store';
import { formatIDR } from '@/lib/currency';

type BuildOrderMessageInput = {
  store: StoreConfig;
  customer: CustomerInfo;
  location: BuyerLocation;
  cart: CartItem[];
  totals: {
    totalPrice: number;
  };
};

export function buildOrderMessage(input: BuildOrderMessageInput): string {
  const { store, customer, location, cart, totals } = input;

  const itemsText = cart
    .map((item, index) => {
      const subtotal = item.unitPrice * item.qty;
      return `${index + 1}) ${item.productName} - ${item.variantLabel} x${item.qty} = ${formatIDR(subtotal)}`;
    })
    .join('\n');

  const locationLine =
    location.mapsUrl || location.manualUrl || 'Lokasi tidak tersedia, mohon kirim manual via chat.';

  return [
    `Pesanan - ${store.storeName}`,
    '',
    `Nama: ${customer.name}`,
    `No HP: ${customer.phone}`,
    `Alamat: ${customer.address}`,
    '',
    `Lokasi Pembeli: ${locationLine}`,
    '',
    'Daftar Pesanan:',
    itemsText,
    '',
    `Total Produk: ${formatIDR(totals.totalPrice)}`,
    `Catatan: ${store.shippingNote}`,
  ].join('\n');
}

function normalizeWhatsAppNumber(input: string): string {
  const digits = input.replace(/[^\d]/g, '');

  if (!digits) {
    return '';
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith('62')) {
    return digits;
  }

  if (digits.startsWith('8')) {
    return `62${digits}`;
  }

  return digits;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
