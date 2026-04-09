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
        infoTitle="Yang akan Anda dapat"
        infoSteps={[
          {
            title: 'Data usaha lebih tertata',
            description: 'Admin lebih cepat memahami profil bisnis dan kebutuhan Anda.',
          },
          {
            title: 'Komunikasi lebih efisien',
            description: 'WhatsApp langsung berisi konteks yang lengkap, bukan chat kosong.',
          },
          {
            title: 'Lebih siap untuk dipromosikan',
            description: 'Profil yang rapi memudahkan langkah promosi dan pengembangan berikutnya.',
          },
        ]}
        infoNote="Isi datanya seperlunya tapi jelas. Semakin lengkap, semakin cepat admin menindaklanjuti."
      />

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <PartnerRegistrationForm waNumber={storeConfig.waNumber} />
      </main>
    </div>
  );
}
