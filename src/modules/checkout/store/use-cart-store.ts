
import { create } from "zustand"

import { createJSONStorage, persist } from "zustand/middleware"


// Aur pta hai ye hum isiliye bana rehe hai n ki kyuki ye whole cart ke product ko hold instead of 1 cart ke product ke place per
interface TenantCart {
    productIds: string[]
}

interface CartState {
    tenantCarts: Record<string, TenantCart>,
    addProduct: (tenantSlug: string, productId: string) => void
    removeProduct: (tenantSlug: string, productsId: string) => void
    clearCart: (tenantSlug: string) => void
    clearAllCarts: () => void;
    getCartByTenant: (tenantSlug: string) => string[]
}


export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            tenantCarts: {},
            addProduct: (tenantSlug, productId) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: [
                                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                                productId
                            ]
                        }
                    }
                })),
            removeProduct: (tenantSlug, productId) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: state.tenantCarts[tenantSlug]?.productIds.filter(
                                (id) => id !== productId
                            ) || []
                        }
                    }
                })),
            clearCart: (tenantSlug) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds:[]
                        }
                    }
                })),
            clearAllCarts: () =>
                set({
                    tenantCarts: {},

                }),

            getCartByTenant: (tenantSlug) =>
                get().tenantCarts[tenantSlug]?.productIds || []
        }),
        {
            name: "funroad-Cart",
            storage: createJSONStorage(() => localStorage) // todo=> and basically localStorage will come from :window.localStorage ,and we know that it's a global refrence
        }
    )
)