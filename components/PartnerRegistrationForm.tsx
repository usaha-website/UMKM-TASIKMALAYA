'use client';

import { useMemo, useState } from 'react';

import { PAYMENT_METHODS } from '@/data/partnerMembership';
import { buildPartnerRegistrationMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import type { PartnerRegistrationForm as PartnerRegistrationFormValues } from '@/types/partner';

const DEFAULT_FORM: PartnerRegistrationFormValues = {
  fullName: '',
  nickName: '',
  whatsapp: '',
  email: '',
  businessName: '',
  businessField: '',
  businessLocation: '',
  socialMedia: '',
  paymentMethod: PAYMENT_METHODS[0]?.value ?? '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountHolder: '',
  ewalletName: '',
  ewalletPhone: '',
  ewalletAccountHolder: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PartnerRegistrationFormProps = {
  waNumber: string;
};

type FieldName = keyof PartnerRegistrationFormValues;

function FieldError({
  field,
  errors,
  submitted,
}: {
  field: FieldName;
  errors: Partial<Record<FieldName, string>>;
  submitted: boolean;
}) {
  if (!submitted || !errors[field]) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-300">{errors[field]}</p>;
}

export default function PartnerRegistrationForm({ waNumber }: PartnerRegistrationFormProps) {
  const [form, setForm] = useState<PartnerRegistrationFormValues>(DEFAULT_FORM);
  const [submitted, setSubmitted] = useState(false);

  const isTransferBank = form.paymentMethod === 'Transfer Bank';
  const isEwallet = form.paymentMethod === 'E-Wallet';

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<FieldName, string>> = {};
    const cleanPhoneDigits = form.whatsapp.replace(/\D/g, '');
    const cleanEwalletDigits = form.ewalletPhone.replace(/\D/g, '');

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi.';
    }

    if (!form.whatsapp.trim()) {
      nextErrors.whatsapp = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanPhoneDigits.length < 9) {
      nextErrors.whatsapp = 'Nomor WhatsApp minimal 9 digit.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = 'Format email belum valid.';
    }

    if (!form.businessName.trim()) {
      nextErrors.businessName = 'Nama usaha wajib diisi.';
    }

    if (!form.businessField.trim()) {
      nextErrors.businessField = 'Bidang usaha wajib diisi.';
    }

    if (!form.businessLocation.trim()) {
      nextErrors.businessLocation = 'Lokasi usaha wajib diisi.';
    }

    if (!form.socialMedia.trim()) {
      nextErrors.socialMedia = 'Media sosial usaha wajib diisi.';
    }

    if (!form.paymentMethod.trim()) {
      nextErrors.paymentMethod = 'Silakan pilih metode pembayaran.';
    }

    if (isTransferBank) {
      if (!form.bankName.trim()) {
        nextErrors.bankName = 'Nama bank wajib diisi.';
      }

      if (!form.bankAccountNumber.trim()) {
        nextErrors.bankAccountNumber = 'Nomor rekening wajib diisi.';
      }

      if (!form.bankAccountHolder.trim()) {
        nextErrors.bankAccountHolder = 'Atas nama rekening wajib diisi.';
      }
    }

    if (isEwallet) {
      if (!form.ewalletName.trim()) {
        nextErrors.ewalletName = 'Nama e-wallet wajib diisi.';
      }

      if (!form.ewalletPhone.trim()) {
        nextErrors.ewalletPhone = 'Nomor HP e-wallet wajib diisi.';
      } else if (cleanEwalletDigits.length < 9) {
        nextErrors.ewalletPhone = 'Nomor HP e-wallet minimal 9 digit.';
      }

      if (!form.ewalletAccountHolder.trim()) {
        nextErrors.ewalletAccountHolder = 'Atas nama e-wallet wajib diisi.';
      }
    }

    return nextErrors;
  }, [form, isEwallet, isTransferBank]);

  const isValid = Object.keys(errors).length === 0;

  function handleChange(field: FieldName, value: string) {
    setForm((current) => {
      const nextState = {
        ...current,
        [field]: value,
      };

      if (field === 'paymentMethod' && value === 'Transfer Bank') {
        nextState.ewalletName = '';
        nextState.ewalletPhone = '';
        nextState.ewalletAccountHolder = '';
      }

      if (field === 'paymentMethod' && value === 'E-Wallet') {
        nextState.bankName = '';
        nextState.bankAccountNumber = '';
        nextState.bankAccountHolder = '';
      }

      return nextState;
    });
  }

  function handleSubmit() {
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    const message = buildPartnerRegistrationMessage(form);
    const waUrl = buildWhatsAppUrl(waNumber, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <section
      id="form-partner"
      className="rounded-[2rem] border border-slate-700/70 bg-slate-900/55 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-5 md:p-7"
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/85">
            Form Pendaftaran
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-slate-50 md:text-4xl">
            Isi data singkat, lalu lanjut kirim ke WhatsApp.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/80 md:text-base">
            Kami buat form ini sesingkat mungkin agar admin langsung menerima data usaha dan pilihan
            pembayaran yang sesuai.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/45 p-4">
            <p className="text-sm font-semibold text-slate-50">1. Data Personal (Pemilik)</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Nama Lengkap</span>
                <input
                  value={form.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  placeholder="Sesuai KTP"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="fullName" errors={errors} submitted={submitted} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Nama Panggilan</span>
                <input
                  value={form.nickName}
                  onChange={(event) => handleChange('nickName', event.target.value)}
                  placeholder="Opsional"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Nomor WhatsApp</span>
                <input
                  value={form.whatsapp}
                  onChange={(event) => handleChange('whatsapp', event.target.value)}
                  placeholder="Contoh: 0812xxxx atau +62812xxxx"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="whatsapp" errors={errors} submitted={submitted} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Email</span>
                <input
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="nama@email.com"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="email" errors={errors} submitted={submitted} />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/45 p-4">
            <p className="text-sm font-semibold text-slate-50">2. Profil Usaha (UMKM)</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-200">Nama Usaha / Brand</span>
                <input
                  value={form.businessName}
                  onChange={(event) => handleChange('businessName', event.target.value)}
                  placeholder="Nama brand atau toko"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="businessName" errors={errors} submitted={submitted} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-200">Bidang Usaha</span>
                <input
                  value={form.businessField}
                  onChange={(event) => handleChange('businessField', event.target.value)}
                  placeholder="Contoh: Kuliner, Fashion, Jasa"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="businessField" errors={errors} submitted={submitted} />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Alamat / Lokasi Usaha</span>
                <input
                  value={form.businessLocation}
                  onChange={(event) => handleChange('businessLocation', event.target.value)}
                  placeholder="Minimal kota atau kecamatan"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="businessLocation" errors={errors} submitted={submitted} />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Media Sosial Usaha</span>
                <input
                  value={form.socialMedia}
                  onChange={(event) => handleChange('socialMedia', event.target.value)}
                  placeholder="Instagram / TikTok / Facebook"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                />
                <FieldError field="socialMedia" errors={errors} submitted={submitted} />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-950/45 p-4">
            <p className="text-sm font-semibold text-slate-50">3. Metode Pembayaran</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Pilih cara pembayaran terlebih dulu. Setelah itu, form akan menampilkan detail yang
              perlu Anda isi sesuai metode yang dipilih.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-200">Pilih Pembayaran</span>
                <select
                  value={form.paymentMethod}
                  onChange={(event) => handleChange('paymentMethod', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                >
                  {PAYMENT_METHODS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-400">
                  {PAYMENT_METHODS.find((item) => item.value === form.paymentMethod)?.description}
                </p>
                <FieldError field="paymentMethod" errors={errors} submitted={submitted} />
              </label>

              {isTransferBank ? (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">Nama Bank</span>
                    <input
                      value={form.bankName}
                      onChange={(event) => handleChange('bankName', event.target.value)}
                      placeholder="Contoh: BCA, BRI, Mandiri"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError field="bankName" errors={errors} submitted={submitted} />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">Nomor Rekening</span>
                    <input
                      value={form.bankAccountNumber}
                      onChange={(event) => handleChange('bankAccountNumber', event.target.value)}
                      placeholder="Masukkan nomor rekening"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError field="bankAccountNumber" errors={errors} submitted={submitted} />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-200">Atas Nama</span>
                    <input
                      value={form.bankAccountHolder}
                      onChange={(event) => handleChange('bankAccountHolder', event.target.value)}
                      placeholder="Nama pemilik rekening"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError field="bankAccountHolder" errors={errors} submitted={submitted} />
                  </label>
                </>
              ) : null}

              {isEwallet ? (
                <>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">Nama E-Wallet</span>
                    <input
                      value={form.ewalletName}
                      onChange={(event) => handleChange('ewalletName', event.target.value)}
                      placeholder="Contoh: GoPay, OVO, DANA"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError field="ewalletName" errors={errors} submitted={submitted} />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">Nomor HP E-Wallet</span>
                    <input
                      value={form.ewalletPhone}
                      onChange={(event) => handleChange('ewalletPhone', event.target.value)}
                      placeholder="Nomor yang terdaftar di e-wallet"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError field="ewalletPhone" errors={errors} submitted={submitted} />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-200">Atas Nama</span>
                    <input
                      value={form.ewalletAccountHolder}
                      onChange={(event) => handleChange('ewalletAccountHolder', event.target.value)}
                      placeholder="Nama pemilik akun e-wallet"
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
                    />
                    <FieldError
                      field="ewalletAccountHolder"
                      errors={errors}
                      submitted={submitted}
                    />
                  </label>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-700/70 bg-slate-950/55 p-5">
          <p className="text-sm font-semibold text-slate-50">Siap kirim pendaftaran?</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Saat tombol ditekan, WhatsApp akan terbuka dengan ringkasan data usaha dan detail
            pembayaran yang sudah Anda pilih.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            Daftar Sekarang via WhatsApp
          </button>
          {!isValid && submitted ? (
            <p className="mt-3 text-sm text-amber-200">
              Lengkapi field yang masih kosong agar data yang terkirim ke admin sudah siap diproses.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
