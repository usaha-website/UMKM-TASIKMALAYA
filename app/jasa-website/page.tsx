import type { Metadata } from 'next';

import StoreHeader from '@/components/StoreHeader';
import WebsitePackageCarousel from '@/components/WebsitePackageCarousel';
import { WEBSITE_SERVICE_ADDONS, WEBSITE_SERVICE_PACKAGES } from '@/data/websiteServices';
import { storeConfig } from '@/data/storeConfig';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Jasa Website UMKM',
  description:
    'Solusi website profesional untuk UMKM. Paket landing page toko online dengan biaya transparan, cepat diakses, dan mudah dikelola.',
  alternates: {
    canonical: '/jasa-website',
  },
};

export default function JasaWebsitePage() {
  const consultationUrl = buildWhatsAppUrl(
    storeConfig.waNumber,
    'Halo admin UMKM-Tasikmalaya, saya ingin konsultasi tentang jasa pembuatan website untuk toko saya.',
  );

  return (
    <div className="min-h-screen text-slate-100">
      <StoreHeader
        storeName={storeConfig.storeName}
        chatUrl={consultationUrl}
        mapUrl={storeConfig.storeMapUrl}
        eyebrow="Jasa Website"
        title="Landing page toko yang tidak cuma bagus tapi benar benar bantu closing"
        description="Kami rancang halaman jualan yang ringan, jelas, dan diarahkan untuk mendorong klik WhatsApp. Cocok untuk UMKM yang ingin tampil profesional tanpa bikin calon pembeli bingung."
        primaryAction={{
          href: '#paket-jasa',
          label: 'Lihat Paket',
        }}
        secondaryAction={{
          href: consultationUrl,
          label: 'Konsultasi Gratis',
          external: true,
        }}
        infoTitle="Solusi Website Profesional, Pilih Paket Website Usahamu"
        infoSteps={[
          {
            title: 'Layanan pembuatan website personal/toko online',
            description:
              'Bagi UMKM yang ingin memiliki identitas digital mandiri.',
          },
          {
            title: 'Fokus pada kemudahan pengelolaan dan kecepatan akses',
            description:
              'Dirancang agar operasional harian tetap ringan dan mudah diurus.',
          },
          {
            title: 'Biaya operasional transparan',
            description:
              'Tanpa biaya tersembunyi, jadi Anda bisa mengatur pengeluaran dengan tenang.',
          },
        ]}
        infoNote="Solusi ini dibuat untuk UMKM yang ingin tampil profesional tanpa beban biaya yang membingungkan."
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
        <section
          id="paket-jasa"
          className="rounded-[2rem] border border-slate-700/70 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-7"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/85">
              Paket Utama
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-slate-50 md:text-4xl">
              Pilih paket sesuai tahap bisnis Anda hari ini.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200/80 md:text-base">
              Semakin matang alur penjualan yang Anda butuhkan, semakin lengkap fitur yang kami
              siapkan. Detail paket kami tampilkan terbuka supaya Anda bisa menilai dengan tenang
              sebelum chat admin.
            </p>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Konsultasi Dulu via WhatsApp
            </a>
          </div>

          <div className="mt-6">
            <WebsitePackageCarousel
              packages={WEBSITE_SERVICE_PACKAGES}
              waNumber={storeConfig.waNumber}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-700/70 bg-slate-900/55 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/85">
            Layanan Tambahan
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-slate-50 md:text-4xl">
            Add-on yang bisa dipilih terpisah dari paket utama.
          </h2>
          <div className="mt-6 space-y-4">
            {WEBSITE_SERVICE_ADDONS.map((item) => (
              <div
                key={item.name}
                className="rounded-[1.5rem] border border-slate-700/60 bg-slate-950/45 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                  <span className="rounded-full border border-slate-700/80 px-3 py-1 text-sm font-semibold text-emerald-200">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
