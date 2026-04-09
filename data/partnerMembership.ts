import type { FormOption } from '@/types/partner';

export const PAYMENT_METHODS: FormOption[] = [
  {
    value: 'Transfer Bank',
    label: 'Transfer Bank',
    description: 'Pilih ini jika ingin mengirim detail rekening bank untuk pembayaran.',
  },
  {
    value: 'E-Wallet',
    label: 'E-Wallet',
    description: 'Pilih ini jika ingin memakai GoPay, OVO, DANA, atau e-wallet lain.',
  },
];
