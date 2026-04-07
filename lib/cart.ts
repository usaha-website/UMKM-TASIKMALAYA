import type { CartItem, Product, ProductVariant } from '@/types/store';

export function getCartItemKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

export function addItem(
  cart: CartItem[],
  product: Product,
  variant: ProductVariant,
  qty: number = 1,
): CartItem[] {
  const safeQty = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
  const key = getCartItemKey(product.id, variant.id);
  const foundIndex = cart.findIndex(
    (item) => getCartItemKey(item.productId, item.variantId) === key,
  );

  if (foundIndex === -1) {
    return [
      ...cart,
      {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantLabel: variant.label,
        unitPrice: variant.price,
        qty: safeQty,
      },
    ];
  }

  return cart.map((item, index) =>
    index === foundIndex
      ? {
          ...item,
          qty: item.qty + safeQty,
        }
      : item,
  );
}

export function updateQty(cart: CartItem[], key: string, nextQty: number): CartItem[] {
  if (nextQty <= 0) {
    return removeItem(cart, key);
  }

  return cart.map((item) =>
    getCartItemKey(item.productId, item.variantId) === key ? { ...item, qty: nextQty } : item,
  );
}

export function removeItem(cart: CartItem[], key: string): CartItem[] {
  return cart.filter((item) => getCartItemKey(item.productId, item.variantId) !== key);
}

export function clearCart(): CartItem[] {
  return [];
}

export function computeCartTotals(cart: CartItem[]): { totalQty: number; totalPrice: number } {
  return cart.reduce(
    (acc, item) => {
      acc.totalQty += item.qty;
      acc.totalPrice += item.unitPrice * item.qty;
      return acc;
    },
    { totalQty: 0, totalPrice: 0 },
  );
}
