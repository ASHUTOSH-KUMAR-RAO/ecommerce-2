

import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {

    const { addProduct, getCartByTenant, removeProduct, clearAllCarts, clearCart, } = useCartStore()

    const productIds = getCartByTenant(tenantSlug)


    const toggleProduct = (productId: string) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId)
        }
        else {
            addProduct(tenantSlug, productId)
        }
    }


    const isProductCart = (productId: string) => {
        return productIds.includes(productId)
    }


    const clearTenantCart = () => {
        clearCart(tenantSlug)
    }


    return {
        productIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => addProduct(tenantSlug, productId),

        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductCart,
        totalItems: productIds.length
    };
};