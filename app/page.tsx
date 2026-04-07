'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import CartDrawer from '@/components/CartDrawer';
import CategoryList from '@/components/CategoryList';
import CheckoutPanel from '@/components/CheckoutPanel';
import ProductGrid from '@/components/ProductGrid';
import StoreHeader from '@/components/StoreHeader';
import StoreMapSection from '@/components/StoreMapSection';
import ToastNotice from '@/components/ToastNotice';
import { CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import { storeConfig } from '@/data/storeConfig';
import { addItem, clearCart, computeCartTotals, removeItem, updateQty } from '@/lib/cart';
import { requestBuyerLocation } from '@/lib/geo';
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import type { BuyerLocation, CartItem, CustomerInfo, Product, ProductVariant } from '@/types/store';

const PHONE_ALLOWED = /^[0-9+\-()\s]+$/;

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
  });
  const [buyerLocation, setBuyerLocation] = useState<BuyerLocation>({ status: 'idle' });
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [toast, setToast] = useState('');

  const checkoutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast('');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const totals = useMemo(() => computeCartTotals(cart), [cart]);

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === 'all') {
      return PRODUCTS;
    }

    return PRODUCTS.filter((product) => product.categoryId === activeCategoryId);
  }, [activeCategoryId]);

  const cleanPhoneDigits = customer.phone.replace(/\D/g, '');
  const phoneValid = PHONE_ALLOWED.test(customer.phone) && cleanPhoneDigits.length >= 9;
  const hasRequiredCustomer =
    customer.name.trim().length > 0 &&
    customer.address.trim().length > 0 &&
    customer.phone.trim().length > 0;

  const activeLocationUrl = buyerLocation.mapsUrl || buyerLocation.manualUrl;

  const canCheckout =
    cart.length > 0 && hasRequiredCustomer && phoneValid && Boolean(activeLocationUrl);

  const validationMessage = useMemo(() => {
    if (cart.length === 0) {
      return 'Keranjang masih kosong.';
    }

    if (!customer.name.trim()) {
      return 'Nama wajib diisi.';
    }

    if (!customer.phone.trim()) {
      return 'No HP wajib diisi.';
    }

    if (!phoneValid) {
      return 'Format No HP belum valid (minimal 9 digit angka).';
    }

    if (!customer.address.trim()) {
      return 'Alamat wajib diisi.';
    }

    if (!activeLocationUrl) {
      return 'Lokasi pembeli wajib diisi (otomatis atau link manual).';
    }

    return null;
  }, [activeLocationUrl, cart.length, customer.address, customer.name, customer.phone, phoneValid]);

  function handleAddToCart(product: Product, variant: ProductVariant) {
    setCart((current) => addItem(current, product, variant));
    setToast(`${product.name} (${variant.label}) ditambahkan ke keranjang.`);
  }

  function handleQtyChange(key: string, nextQty: number) {
    setCart((current) => updateQty(current, key, nextQty));
  }

  function handleRemoveItem(key: string) {
    setCart((current) => removeItem(current, key));
  }

  function handleClearCart() {
    setCart(clearCart());
  }

  function handleCustomerChange(field: keyof CustomerInfo, value: string) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleGetLocation() {
    setBuyerLocation({ status: 'loading' });

    const location = await requestBuyerLocation();
    setBuyerLocation(location);

    if (location.status === 'granted') {
      setToast('Lokasi berhasil diambil.');
    } else if (location.status === 'denied') {
      setToast('Izin lokasi ditolak. Silakan isi link lokasi manual.');
    } else if (location.status === 'error') {
      setToast('Gagal ambil lokasi. Silakan isi link lokasi manual.');
    }
  }

  function handleManualLocationApply() {
    const value = manualLocationInput.trim();
    if (!value) {
      setToast('Link Google Maps manual belum diisi.');
      return;
    }

    setBuyerLocation((current) => ({
      ...current,
      status: current.status === 'granted' ? 'granted' : 'error',
      manualUrl: value,
    }));

    setToast('Link lokasi manual digunakan.');
  }

  function handleCheckoutWhatsApp() {
    if (!canCheckout) {
      return;
    }

    const message = buildOrderMessage({
      store: storeConfig,
      customer,
      location: buyerLocation,
      cart,
      totals,
    });

    const waUrl = buildWhatsAppUrl(storeConfig.waNumber, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  function handleCheckoutFocus() {
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const headerChatUrl = useMemo(() => {
    return buildWhatsAppUrl(
      storeConfig.waNumber,
      `Halo admin ${storeConfig.storeName}, saya mau tanya produk.`,
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StoreHeader
        storeName={storeConfig.storeName}
        chatUrl={headerChatUrl}
        mapUrl={storeConfig.storeMapUrl}
      />

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <CategoryList
              categories={CATEGORIES}
              selectedId={activeCategoryId}
              onSelect={setActiveCategoryId}
            />

            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onCheckoutFocus={handleCheckoutFocus}
            />

            <div ref={checkoutRef}>
              <CheckoutPanel
                customer={customer}
                onCustomerChange={handleCustomerChange}
                buyerLocation={buyerLocation}
                manualLocationInput={manualLocationInput}
                onManualLocationChange={setManualLocationInput}
                onManualLocationApply={handleManualLocationApply}
                onGetLocation={handleGetLocation}
                isCheckingLocation={buyerLocation.status === 'loading'}
                shippingNote={storeConfig.shippingNote}
                canCheckout={canCheckout}
                validationMessage={validationMessage}
                onCheckoutWhatsApp={handleCheckoutWhatsApp}
              />
            </div>
          </div>

          <CartDrawer
            cart={cart}
            onIncrease={handleQtyChange}
            onDecrease={handleQtyChange}
            onRemove={handleRemoveItem}
            onClear={handleClearCart}
            onCheckoutFocus={handleCheckoutFocus}
          />
        </div>

        <StoreMapSection
          storeName={storeConfig.storeName}
          embedUrl={storeConfig.storeMapEmbedUrl}
          mapUrl={storeConfig.storeMapUrl}
        />
      </main>

      {toast ? <ToastNotice message={toast} /> : null}
    </div>
  );
}
