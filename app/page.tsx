import type { Metadata } from 'next';

import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: {
    absolute: 'UMKM Tasikmalaya GEUWAT',
  },
  description:
    'Belanja produk lokal UMKM Tasikmalaya GEUWAT dengan checkout via WhatsApp. Pilih singlet, celana, dan celana dalam berkualitas untuk kebutuhan harian.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
