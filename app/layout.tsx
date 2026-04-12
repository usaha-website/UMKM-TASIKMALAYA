import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = new URL('https://umkmtasikmalayageuwat.netlify.app/');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'UMKM Tasikmalaya GEUWAT',
    template: '%s | UMKM Tasikmalaya GEUWAT',
  },
  description:
    'Belanja produk lokal UMKM Tasikmalaya GEUWAT dengan alur pemesanan cepat via WhatsApp. Produk harian berkualitas dari pelaku usaha lokal.',
  alternates: {
    canonical: '/',
  },
  keywords: [
    'UMKM Tasikmalaya GEUWAT',
    'produk lokal Tasikmalaya',
    'singlet',
    'celana dalam',
    'celana training',
    'belanja via WhatsApp',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'UMKM Tasikmalaya GEUWAT',
    title: 'UMKM Tasikmalaya GEUWAT',
    description:
      'Belanja produk lokal UMKM Tasikmalaya GEUWAT dengan alur pemesanan cepat via WhatsApp. Produk harian berkualitas dari pelaku usaha lokal.',
    images: [
      {
        url: '/og-umkm-tasikmalaya.png',
        width: 1200,
        height: 630,
        alt: 'UMKM Tasikmalaya GEUWAT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UMKM Tasikmalaya GEUWAT',
    description:
      'Belanja produk lokal UMKM Tasikmalaya GEUWAT dengan alur pemesanan cepat via WhatsApp. Produk harian berkualitas dari pelaku usaha lokal.',
    images: ['/og-umkm-tasikmalaya.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}#localbusiness`,
      name: 'UMKM Tasikmalaya GEUWAT',
      url: siteUrl.toString(),
      image: `${siteUrl}LogoUMKM%20Tasikmalaya-Photoroom.png`,
      telephone: '+6282338792512',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Sule Setianegara, Setiaratu, Kec. Cibeureum',
        addressLocality: 'Tasikmalaya',
        addressRegion: 'Jawa Barat',
        postalCode: '46196',
        addressCountry: 'ID',
      },
      sameAs: [
        'https://www.instagram.com/umkm.tasikmalaya.geuwat',
        'https://www.facebook.com/profile.php?id=61571339783750',
        'https://www.tiktok.com/@umkm.tasikmalaya.geuwat',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      name: 'UMKM Tasikmalaya GEUWAT',
      url: siteUrl.toString(),
    },
  ];

  return (
    <html lang="id">
      <body className="antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PPKWBGPNVY"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PPKWBGPNVY');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
