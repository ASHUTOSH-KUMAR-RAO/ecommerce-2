import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const { 
    addProduct, 
    getCartByTenant, 
    removeProduct, 
    clearAllCarts, 
    clearCart 
  } = useCartStore();

  // Safe productIds with fallback
  const productIds: string[] = getCartByTenant(tenantSlug) || [];

  const toggleProduct = (productId: string) => {
    if (!productId) return;
    
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  const isProductCart = (productId: string) => {
    if (!productId) return false;
    return productIds.includes(productId);
  };

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  // Safe wrapper functions
  const safeAddProduct = (productId: string) => {
    if (!productId || !tenantSlug) return;
    addProduct(tenantSlug, productId);
  };

  const safeRemoveProduct = (productId: string) => {
    if (!productId || !tenantSlug) return;
    removeProduct(tenantSlug, productId);
  };

  return {
    productIds,
    addProduct: safeAddProduct,
    removeProduct: safeRemoveProduct, // ✅ FIXED - ab sahi removeProduct call hoga
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProduct,
    isProductCart,
    totalItems: productIds.length
  };
};