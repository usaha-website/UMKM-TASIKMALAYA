import type { Product } from '@/types/store';

function createSizeVariants(prefix: string, basePrice: number) {
  return [
    { id: `${prefix}-s`, label: 'S', price: basePrice },
    { id: `${prefix}-m`, label: 'M', price: basePrice },
    { id: `${prefix}-l`, label: 'L', price: basePrice },
  ];
}

export const PRODUCTS: Product[] = [
  {
    id: 'celana-training',
    name: 'Celana Training',
    description:
      'Celana training untuk aktivitas harian. Ringan, nyaman, dan fleksibel untuk gerak.',
    details: [
      { label: 'Bahan', value: 'Poly-cotton (ringan, tidak mudah kusut)' },
      { label: 'Model', value: 'Regular fit' },
      { label: 'Kantong', value: '2 kantong samping' },
      { label: 'Perawatan', value: 'Cuci terbalik, hindari pemutih' },
    ],
    image: '/celana.webp',
    categoryId: 'celana',
    variants: createSizeVariants('celana-training', 79000),
  },
  {
    id: 'celana-dalam-classic',
    name: 'Celana Dalam Classic',
    description: 'Celana dalam basic yang lembut dan nyaman untuk dipakai harian.',
    details: [
      { label: 'Bahan', value: 'Cotton (adem & menyerap keringat)' },
      { label: 'Pinggang', value: 'Karet elastis' },
      { label: 'Jahitan', value: 'Rapi dan nyaman di kulit' },
      { label: 'Perawatan', value: 'Cuci dengan air dingin, jemur teduh' },
    ],
    image: '/CelanaDalam1.webp',
    categoryId: 'celana-dalam',
    variants: createSizeVariants('celana-dalam-classic', 39000),
  },
  {
    id: 'celana-dalam-premium',
    name: 'Celana Dalam Premium',
    description:
      'Versi premium dengan bahan lebih tebal dan finishing lebih rapi untuk kenyamanan maksimal.',
    details: [
      { label: 'Bahan', value: 'Cotton premium (lebih tebal & lembut)' },
      { label: 'Pinggang', value: 'Karet kuat, tidak mudah melar' },
      { label: 'Kenyamanan', value: 'Jahitan halus, nyaman untuk dipakai lama' },
      { label: 'Perawatan', value: 'Jangan setrika pada bagian karet' },
    ],
    image: '/CelanaDalam2.webp',
    categoryId: 'celana-dalam',
    variants: createSizeVariants('celana-dalam-premium', 45000),
  },
  {
    id: 'singlet-cotton',
    name: 'Singlet Cotton',
    description: 'Singlet basic yang adem dan ringan, cocok untuk inner atau santai di rumah.',
    details: [
      { label: 'Bahan', value: 'Cotton combed (halus & adem)' },
      { label: 'Model', value: 'Regular fit' },
      { label: 'Kenyamanan', value: 'Ringan, nyaman untuk aktivitas santai' },
      { label: 'Perawatan', value: 'Cuci lembut, hindari mesin pengering panas' },
    ],
    image: '/Singlet.webp',
    categoryId: 'singlet',
    variants: createSizeVariants('singlet-cotton', 35000),
  },
];
