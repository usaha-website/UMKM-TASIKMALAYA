'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import CartDrawer from '@/components/CartDrawer';
import CatalogFilterDrawer from '@/components/CatalogFilterDrawer';
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
import type {
  BuyerLocation,
  CartItem,
  CustomerInfo,
  Product,
  ProductSortOption,
  ProductVariant,
} from '@/types/store';

const PHONE_ALLOWED = /^[0-9+\-()\s]+$/;
const PRODUCTS_PER_PAGE = 6;

function getProductBasePrice(product: Product) {
  if (product.variants.length === 0) {
    return 0;
  }

  return product.variants.reduce(
    (min, variant) => Math.min(min, variant.price),
    product.variants[0].price,
  );
}

export default function HomePageClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<ProductSortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const baseProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategoryId === 'all' ? true : product.categoryId === activeCategoryId;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const detailText =
        product.details?.map((detail) => `${detail.label} ${detail.value}`).join(' ') ?? '';
      const searchableText = `${product.name} ${product.description} ${detailText}`.toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeCategoryId, searchQuery]);

  const priceBounds = useMemo(() => {
    const prices = baseProducts.flatMap((product) => product.variants.map((variant) => variant.price));
    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [baseProducts]);

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });

  useEffect(() => {
    setPriceRange({
      min: priceBounds.min,
      max: priceBounds.max,
    });
  }, [priceBounds.max, priceBounds.min]);

  const filteredProducts = useMemo(() => {
    const nextProducts = baseProducts.filter((product) => {
      if (product.variants.length === 0) {
        return false;
      }

      return product.variants.some(
        (variant) => variant.price >= priceRange.min && variant.price <= priceRange.max,
      );
    });

    if (sortOption === 'price-asc') {
      return [...nextProducts].sort(
        (left, right) => getProductBasePrice(left) - getProductBasePrice(right),
      );
    }

    if (sortOption === 'price-desc') {
      return [...nextProducts].sort(
        (left, right) => getProductBasePrice(right) - getProductBasePrice(left),
      );
    }

    if (sortOption === 'name-asc') {
      return [...nextProducts].sort((left, right) => left.name.localeCompare(right.name, 'id'));
    }

    return nextProducts;
  }, [baseProducts, priceRange.max, priceRange.min, sortOption]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  }, [filteredProducts.length]);

  const resolvedCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (resolvedCurrentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, resolvedCurrentPage]);

  const activeCategoryLabel = useMemo(() => {
    if (activeCategoryId === 'all') {
      return 'Semua';
    }

    return CATEGORIES.find((category) => category.id === activeCategoryId)?.label ?? 'Singlet';
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

  function handleCategorySelect(nextCategoryId: string) {
    setActiveCategoryId(nextCategoryId);
    setCurrentPage(1);
  }

  function handleSearchChange(nextQuery: string) {
    setSearchQuery(nextQuery);
    setCurrentPage(1);
  }

  function handleSortChange(nextSortOption: ProductSortOption) {
    setSortOption(nextSortOption);
    setCurrentPage(1);
  }

  function handlePageChange(nextPage: number) {
    setCurrentPage(Math.max(1, Math.min(totalPages, nextPage)));
  }

  const headerChatUrl = useMemo(() => {
    return buildWhatsAppUrl(
      storeConfig.waNumber,
      `Halo admin ${storeConfig.storeName}, saya mau tanya produk lokal yang tersedia.`,
    );
  }, []);

  const floatingChatUrl = useMemo(() => {
    return buildWhatsAppUrl(
      storeConfig.waNumber,
      `Halo admin ${storeConfig.storeName}, saya ingin tanya produk.`,
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StoreHeader
        storeName={storeConfig.storeName}
        chatUrl={headerChatUrl}
        mapUrl={storeConfig.storeMapUrl}
        description="Belanja produk lokal jadi lebih gampang: pilih kategori, masukkan ke keranjang, lalu kirim rekap pesanan ke WhatsApp dalam beberapa langkah yang ringkas."
      />

      <CatalogFilterDrawer
        categories={CATEGORIES}
        selectedCategoryId={activeCategoryId}
        sortOption={sortOption}
        priceBounds={priceBounds}
        priceRange={priceRange}
        isOpen={isFilterDrawerOpen}
        onSelectCategory={handleCategorySelect}
        onSelectSort={handleSortChange}
        onPriceRangeChange={setPriceRange}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <section id="produk" className="scroll-mt-24">
              <ProductGrid
                products={paginatedProducts}
                totalProducts={filteredProducts.length}
                searchQuery={searchQuery}
                activeCategoryLabel={activeCategoryLabel}
                sortOption={sortOption}
                currentPage={resolvedCurrentPage}
                totalPages={totalPages}
                onAddToCart={handleAddToCart}
                onCheckoutFocus={handleCheckoutFocus}
                onSearchChange={handleSearchChange}
                onOpenFilters={() => setIsFilterDrawerOpen(true)}
                onPageChange={handlePageChange}
              />
            </section>

            <div id="checkout" ref={checkoutRef} className="scroll-mt-24">
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

          <div className="hidden lg:block">
            <CartDrawer
              cart={cart}
              onIncrease={handleQtyChange}
              onDecrease={handleQtyChange}
              onRemove={handleRemoveItem}
              onClear={handleClearCart}
              onCheckoutFocus={handleCheckoutFocus}
            />
          </div>
        </div>

        <StoreMapSection
          storeName={storeConfig.storeName}
          embedUrl={storeConfig.storeMapEmbedUrl}
          mapUrl={storeConfig.storeMapUrl}
          socialLinks={storeConfig.socialLinks}
        />
      </main>

      {toast ? <ToastNotice message={toast} /> : null}

      {isCartOpen ? (
        <div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        >
          <div
            className="w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
            aria-label="Keranjang belanja"
          >
            <CartDrawer
              cart={cart}
              onIncrease={handleQtyChange}
              onDecrease={handleQtyChange}
              onRemove={handleRemoveItem}
              onClear={handleClearCart}
              onCheckoutFocus={handleCheckoutFocus}
              variant="modal"
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 left-1/2 z-[90] inline-flex -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/20 px-5 py-3 text-sm font-semibold text-emerald-100 shadow-lg shadow-black/30 backdrop-blur transition hover:bg-emerald-300/30 lg:hidden"
        aria-label="Buka keranjang"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M6 7h14l-1.5 8.5a2 2 0 0 1-2 1.5H9a2 2 0 0 1-2-1.5L5 4H3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.6" fill="currentColor" />
          <circle cx="17" cy="20" r="1.6" fill="currentColor" />
        </svg>
        Keranjang
        {cart.length > 0 ? (
          <span className="ml-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-slate-950">
            {cart.reduce((sum, item) => sum + item.qty, 0)}
          </span>
        ) : null}
      </button>

      <a
        href={floatingChatUrl}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[90] inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-black/30 transition hover:bg-emerald-400"
        aria-label="Chat WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M20.5 11.8a8.5 8.5 0 1 0-15.7 4.8L4 21l4.5-1.2a8.5 8.5 0 0 0 12-8z" />
          <path
            d="M9.1 7.8c.2-.4.4-.4.6-.4h.5c.1 0 .3 0 .4.3.2.4.6 1.3.7 1.4.1.1.1.3 0 .4-.1.1-.2.3-.3.4-.1.1-.2.2-.1.4.1.2.5.9 1.1 1.5.7.7 1.3 1 1.5 1.1.2.1.3 0 .4-.1.1-.1.3-.3.4-.4.1-.1.2-.1.4 0 .1.1 1 .5 1.4.7.3.1.3.2.3.4 0 .2 0 .7-.3 1-.3.3-.8.4-1.1.3-.3 0-1.1-.3-2.1-.9-1.2-.7-2-1.6-2.3-2-.3-.4-.8-1.1-.9-2.1-.1-.5.1-1 .3-1.2z"
            fill="#0f172a"
          />
        </svg>
      </a>
    </div>
  );
}
