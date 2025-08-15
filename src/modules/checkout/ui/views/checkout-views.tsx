"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hook/use-cart";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { generateTenantURL } from "@/lib/utils";
import CheckoutItem from "../components/checkout-item";
import CheckoutSidebar from "../components/checkout-sidebar";
import { 
  InboxIcon, 
  LoaderIcon, 
  ShoppingBag, 
  Trash2, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Package
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface Props {
  tenantSlug: string;
}

const CheckoutViews = ({ tenantSlug }: Props) => {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const queryClient = useQueryClient();
  
  const trpc = useTRPC();
  const { data, error, isLoading, refetch } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  // Memoized calculations
  const cartStats = useMemo(() => {
    if (!data?.docs) return { itemCount: 0, uniqueTenants: 0 };
    
    const uniqueTenants = new Set(data.docs.map(p => p.tenant.slug)).size;
    return {
      itemCount: data.docs.length,
      uniqueTenants
    };
  }, [data?.docs]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.error("Some products were removed or unavailable. Cart has been cleared.", {
        icon: <AlertCircle className="h-4 w-4" />
      });
    }
  }, [error, clearAllCarts]);

  // Enhanced remove function with animation
  const handleRemoveProduct = async (productId: string) => {
    setRemovingItems(prev => new Set([...prev, productId]));
    
    setTimeout(() => {
      removeProduct(productId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      
      toast.success("Item removed from cart", {
        icon: <CheckCircle2 className="h-4 w-4" />
      });
    }, 300);
  };

  // Clear all cart with confirmation
  const handleClearAllCart = () => {
    if (showClearConfirm) {
      clearAllCarts();
      setShowClearConfirm(false);
      toast.success("Cart cleared successfully", {
        icon: <CheckCircle2 className="h-4 w-4" />
      });
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  // Enhanced checkout handler
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Add your checkout logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      toast.success("Redirecting to checkout...", {
        icon: <CheckCircle2 className="h-4 w-4" />
      });
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-gray-300 flex items-center justify-center p-12 flex-col gap-y-4 bg-white w-full rounded-xl"
        >
          <LoaderIcon className="h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </motion.div>
      </div>
    );
  }

  // Empty cart state
  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed border-gray-300 flex items-center justify-center p-12 flex-col gap-y-6 bg-white w-full rounded-xl"
        >
          <div className="relative">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1"
            >
              <InboxIcon className="h-6 w-6 text-gray-400" />
            </motion.div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Your cart is empty</h3>
            <p className="text-gray-500">Add some products to get started</p>
          </div>

          <Link 
            href={generateTenantURL(tenantSlug)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      {/* Cart Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="h-8 w-8" />
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {cartStats.itemCount} {cartStats.itemCount === 1 ? 'item' : 'items'} from {cartStats.uniqueTenants} {cartStats.uniqueTenants === 1 ? 'store' : 'stores'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={generateTenantURL(tenantSlug)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            
            {data?.docs && data.docs.length > 0 && (
              <button
                onClick={handleClearAllCart}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  showClearConfirm 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {showClearConfirm ? 'Confirm Clear' : 'Clear All'}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-16">
        {/* Cart Items */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4"
        >
          <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <AnimatePresence mode="popLayout">
              {data?.docs.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: -100,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckoutItem
                    isLast={index === data.docs.length - 1}
                    imageUrl={product.images?.url}
                    name={product.name}
                    productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                    tenantUrl={generateTenantURL(product.tenant.slug)}
                    tenantName={product.tenant.name}
                    price={product.price}
                    onRemove={() => handleRemoveProduct(product.id)}
                    isRemoving={removingItems.has(product.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => refetch()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Refresh Cart
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </motion.div>
        </motion.div>

        {/* Checkout Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <CheckoutSidebar
            total={data?.totalPrice}
            onCheckout={handleCheckout}
            isCanceled={false}
            isPending={isCheckingOut}
            itemCount={cartStats.itemCount}
            uniqueTenants={cartStats.uniqueTenants}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutViews;