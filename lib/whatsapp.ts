import type { BuyerLocation, CartItem, CustomerInfo, StoreConfig } from '@/types/store';
import type { PartnerRegistrationForm } from '@/types/partner';
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

export function buildPartnerRegistrationMessage(form: PartnerRegistrationForm): string {
  const paymentDetails =
    form.paymentMethod === 'Transfer Bank'
      ? [
          `Nama Bank: ${form.bankName}`,
          `Nomor Rekening: ${form.bankAccountNumber}`,
          `Atas Nama: ${form.bankAccountHolder}`,
        ]
      : [
          `Nama E-Wallet: ${form.ewalletName}`,
          `Nomor HP E-Wallet: ${form.ewalletPhone}`,
          `Atas Nama: ${form.ewalletAccountHolder}`,
        ];

  return [
    'Halo admin UMKM-Tasikmalaya, saya ingin daftar Partner UMKM.',
    '',
    'Data Personal:',
    `Nama Lengkap: ${form.fullName}`,
    `Nama Panggilan: ${form.nickName || '-'}`,
    `Nomor WhatsApp: ${form.whatsapp}`,
    `Email: ${form.email}`,
    '',
    'Profil Usaha:',
    `Nama Usaha/Brand: ${form.businessName}`,
    `Bidang Usaha: ${form.businessField}`,
    `Alamat/Lokasi Usaha: ${form.businessLocation}`,
    `Media Sosial Usaha: ${form.socialMedia}`,
    '',
    'Detail Pembayaran:',
    `Metode Pembayaran: ${form.paymentMethod}`,
    ...paymentDetails,
  ].join('\n');
}

export function buildWebsiteServiceInquiryMessage(packageName: string): string {
  return [
    'Halo admin UMKM-Tasikmalaya, saya tertarik dengan jasa pembuatan website.',
    `Paket yang saya minati: ${packageName}`,
    '',
    'Saya ingin konsultasi lebih lanjut untuk kebutuhan toko saya.',
  ].join('\n');
}
