export type ProductVariant = {
  id: string;
  label: string;
  price: number;
};

export type ProductDetail = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  label: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  details?: ProductDetail[];
  image: string;
  categoryId: string;
  variants: ProductVariant[];
};

export type CartItem = {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

export type BuyerLocation = {
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
  lat?: number;
  lng?: number;
  mapsUrl?: string;
  manualUrl?: string;
};

export type StoreConfig = {
  storeName: string;
  waNumber: string;
  storeMapUrl: string;
  storeMapEmbedUrl: string;
  shippingNote: string;
};
