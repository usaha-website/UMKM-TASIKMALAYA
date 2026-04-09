import type { ServiceAddon, ServicePackage } from '@/types/services';

export const WEBSITE_SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'hemat',
    name: 'Paket Hemat',
    price: 'Rp450.000',
    summary: 'Solusi cepat untuk toko yang ingin mulai jualan online dengan alur direct WhatsApp.',
    features: [
      'Landing page 1 halaman dengan maksimal 10 produk',
      'Klik produk langsung chat ke WhatsApp',
      'Ikon link sosial media: Instagram, TikTok, dan Facebook',
      'Tombol WhatsApp melayang agar pembeli mudah menghubungi Anda',
    ],
    ctaLabel: 'Daftar Paket Hemat',
  },
  {
    id: 'populer',
    name: 'Paket Populer',
    price: 'Rp850.000',
    badge: 'Paling Banyak Dipilih',
    summary:
      'Pilihan terbaik untuk toko yang ingin terlihat profesional dan bisa dikelola sendiri.',
    features: [
      'Fitur keranjang belanja untuk pilih banyak produk sekaligus',
      'Detail produk dengan foto tambahan dan deskripsi lengkap',
      'Guest checkout dengan rekap belanja otomatis ke WhatsApp',
      'Dashboard admin untuk tambah, hapus, atau ubah harga produk sendiri',
      'Link sosial media melayang agar testimoni mudah dicek pengunjung',
      'Google Analytics untuk melihat jumlah pengunjung',
    ],
    ctaLabel: 'Daftar Paket Populer',
  },
  {
    id: 'pro',
    name: 'Paket Pro (Marketing)',
    price: 'Rp1.500.000',
    summary:
      'Untuk bisnis yang ingin alur pemesanan, promosi, dan pelacakan berjalan lebih otomatis.',
    features: [
      'Semua fitur Paket Populer',
      'Pemasangan TikTok Pixel dan Meta Pixel untuk kebutuhan iklan',
      'Variasi produk seperti ukuran atau warna dengan harga berbeda',
    ],
    ctaLabel: 'Daftar Paket Pro',
  },
];

export const WEBSITE_SERVICE_ADDONS: ServiceAddon[] = [
  {
    name: 'Setup Google Maps (Google Business)',
    price: 'Rp100.000 - Rp150.000',
    description: 'Daftar titik lokasi usaha dan jam buka agar bisnis Anda lebih mudah ditemukan.',
  },
  {
    name: 'Poles Foto Produk',
    price: 'Rp5.000 - Rp10.000 / foto',
    description: 'Hapus background dan pertajam foto supaya katalog terlihat lebih meyakinkan.',
  },
  {
    name: 'Setup Custom Domain',
    price: 'Rp150.000 - Rp200.000',
    description:
      'Sudah termasuk bantuan pengaturan domain `.com` atau `.id` untuk brand yang lebih profesional.',
  },
];

export const WEBSITE_SERVICE_BENEFITS = [
  'Tanpa login, jadi pembeli bisa langsung belanja tanpa hambatan.',
  'Copywriting difokuskan untuk mempercepat keputusan beli dan klik WhatsApp.',
  'Tampilan dibuat tetap nyaman di mobile karena mayoritas traffic UMKM datang dari HP.',
];
