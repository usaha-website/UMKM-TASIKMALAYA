import PartnerRegistrationForm from '@/components/PartnerRegistrationForm';
import StoreHeader from '@/components/StoreHeader';
import { storeConfig } from '@/data/storeConfig';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function PartnerUmkmPage() {
  const consultationUrl = buildWhatsAppUrl(
    storeConfig.waNumber,
    'Halo admin UMKM-Tasikmalaya, saya ingin konsultasi tentang program Partner UMKM.',
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StoreHeader
        storeName={storeConfig.storeName}
        chatUrl={consultationUrl}
        mapUrl={storeConfig.storeMapUrl}
        eyebrow="Partner UMKM"
        title="Gabung sebagai partner UMKM dan buat usaha Anda lebih siap naik kelas."
        description="Kami bantu rapikan data usaha, komunikasi awal, dan pilihan pembayaran supaya proses gabung terasa jelas, cepat, dan profesional sejak kontak pertama."
        primaryAction={{
          href: '#form-partner',
          label: 'Isi Form Pendaftaran',
        }}
        secondaryAction={{
          href: consultationUrl,
          label: 'Konsultasi via WhatsApp',
          external: true,
        }}
        infoTitle="Partner UMKM: Tumbuh Bersama Secara Digital"
        infoSteps={[
          {
            title: 'Etalase Digital Gratis',
            description:
              'Fasilitas untuk memajang produk agar bisa diakses oleh pasar yang lebih luas secara online.',
          },
          {
            title: 'Sistem Adil & Transparan',
            description:
              'Penggunaan fitur bersifat gratis selama kapasitas server mencukupi, dengan komitmen iuran gotong royong hanya jika diperlukan untuk upgrade sistem.',
          },
          {
            title: 'Fokus pada Pertumbuhan',
            description:
              'Dirancang khusus untuk usaha mikro yang ingin profesional namun memiliki keterbatasan informasi tentang digitalisasi.',
          },
          {
            title: 'Prinsip Gotong Royong',
            description:
              'Keanggotaan berbasis pemeliharaan bersama, di mana kontribusi (jika ada di masa depan) dihitung secara adil berdasarkan skala penggunaan (per produk).',
          },
        ]}
        infoNote="Partner UMKM adalah wadah khusus bagi para pelaku usaha lokal untuk mendigitalisasi produk mereka tanpa beban biaya di awal. Di bagian ini, UMKM bukan sekadar pengguna, melainkan mitra yang saling mendukung dalam menjaga keberlangsungan platform."
      />

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <PartnerRegistrationForm waNumber={storeConfig.waNumber} />
      </main>
    </div>
  );
}
