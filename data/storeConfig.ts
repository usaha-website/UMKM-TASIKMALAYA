import type { StoreConfig } from '@/types/store';

const STORE_ADDRESS = 'M64J+WP7, Setiaratu, Cibeureum, Tasikmalaya Regency, West Java 46196';

export const storeConfig: StoreConfig = {
  storeName: 'UMKM-Tasikmalaya',
  waNumber: '082338792512',
  storeMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`,
  storeMapEmbedUrl: `https://www.google.com/maps?output=embed&q=${encodeURIComponent(STORE_ADDRESS)}`,
  shippingNote: 'Ongkir disesuaikan sebelum pembayaran saat pemesanan via WhatsApp.',
};
