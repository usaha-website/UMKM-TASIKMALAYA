import StoreHeader from '@/components/StoreHeader';
import { WEBSITE_SERVICE_ADDONS, WEBSITE_SERVICE_PACKAGES } from '@/data/websiteServices';
import { storeConfig } from '@/data/storeConfig';
import { buildWebsiteServiceInquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

export default function JasaWebsitePage() {
  const consultationUrl = buildWhatsAppUrl(
    storeConfig.waNumber,
    'Halo admin UMKM-Tasikmalaya, saya ingin konsultasi tentang jasa pembuatan website untuk toko saya.',
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StoreHeader
        storeName={storeConfig.storeName}
        chatUrl={consultationUrl}
        mapUrl={storeConfig.storeMapUrl}
        eyebrow="Jasa Website"
        title="Landing page toko yang tidak cuma bagus, tapi benar-benar bantu closing."
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
        infoTitle="Fokus layanan ini"
        infoSteps={[
          {
            title: 'Copywriting yang menjual',
            description:
              'Kalimat dibuat untuk membantu pengunjung cepat paham dan cepat bertindak.',
          },
          {
            title: 'Tampilan nyaman di HP',
            description: 'Struktur halaman diutamakan untuk pembeli mobile yang dominan di UMKM.',
          },
          {
            title: 'Alur chat lebih cepat',
            description:
              'CTA diarahkan agar calon pembeli langsung masuk ke percakapan yang relevan.',
          },
        ]}
        infoNote="Geser paket di HP untuk melihat semua pilihan, lalu buka detail yang paling sesuai dengan kebutuhan toko Anda."
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

          <div className="mt-6 -mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="flex gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 xl:grid-cols-3">
              {WEBSITE_SERVICE_PACKAGES.map((item) => {
                const inquiryUrl = buildWhatsAppUrl(
                  storeConfig.waNumber,
                  buildWebsiteServiceInquiryMessage(item.name),
                );

                return (
                  <details
                    key={item.id}
                    className="group min-w-[85vw] snap-start rounded-[1.75rem] border border-slate-700/70 bg-slate-950/50 p-5 open:border-emerald-300/35 open:bg-slate-950/75 sm:min-w-[24rem] md:min-w-0"
                  >
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-slate-50">{item.name}</h3>
                            {item.badge ? (
                              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                                {item.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-3 text-3xl font-bold text-emerald-300">{item.price}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                        </div>

                        <span className="rounded-full border border-slate-700/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition group-open:border-emerald-300/50 group-open:text-emerald-200">
                          Lihat Detail
                        </span>
                      </div>
                    </summary>

                    <div className="mt-5 space-y-5 border-t border-slate-800 pt-5">
                      <div>
                        <p className="text-sm font-semibold text-slate-50">Fitur utama</p>
                        <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-200/90">
                          {item.features.map((feature) => (
                            <li key={feature} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.limitations?.length ? (
                        <div>
                          <p className="text-sm font-semibold text-slate-50">Catatan batas paket</p>
                          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                            {item.limitations.map((limitation) => (
                              <li key={limitation} className="flex gap-3">
                                <span className="mt-2 h-2 w-2 rounded-full bg-amber-300" />
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <a
                        href={inquiryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                      >
                        {item.ctaLabel}
                      </a>
                    </div>
                  </details>
                );
              })}
            </div>
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
