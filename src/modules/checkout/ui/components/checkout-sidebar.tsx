import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  ShoppingCart, 
  Store, 
  Shield, 
  Truck,
  LoaderIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  total?: number;
  onPurchase: () => void;
  isPending?: boolean;
  isCanceled?: boolean;
  itemCount?: number;
  uniqueTenants?: number;
  currency?: string;
}

const CheckoutSidebar = ({
  total = 0,
  onPurchase,
  isPending = false,
  isCanceled = false,
  itemCount = 0,
  uniqueTenants = 0,
  currency = "$",
}: Props) => {
  const estimatedTax = total * 0.08; // 8% tax estimate
  const shipping = total > 50 ? 0 : 5.99; // Free shipping over $50
  const finalTotal = total + estimatedTax + shipping;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4"
    >
      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Order Summary</h3>
          </div>
          
          {/* Cart Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingCart className="h-4 w-4" />
              <span>{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Store className="h-4 w-4" />
              <span>{uniqueTenants} {uniqueTenants === 1 ? 'Store' : 'Stores'}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{currency}{total.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Tax</span>
              <span className="font-medium">{currency}{estimatedTax.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Shipping</span>
                {shipping === 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                )}
              </div>
              <span className="font-medium">
                {shipping === 0 ? 'FREE' : `${currency}${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{currency}{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Free Shipping Progress */}
          {shipping > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                <Truck className="h-4 w-4" />
                <span>Add {currency}{(50 - total).toFixed(2)} more for FREE shipping!</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((total / 50) * 100, 100)}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Checkout Button */}
        <div className="p-6 pt-0">
          <Button
            onClick={onPurchase}
            disabled={isPending || isCanceled || itemCount === 0}
            size="lg"
            className="w-full text-base font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <LoaderIcon className="h-4 w-4 animate-spin" />
                Processing...
              </motion.div>
            ) : isCanceled ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Order Canceled
              </div>
            ) : itemCount === 0 ? (
              "Cart is Empty"
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Proceed to Checkout
              </div>
            )}
          </Button>

          {/* Security Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500"
          >
            <Shield className="h-3 w-3" />
            <span>Secure checkout powered by SSL encryption</span>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-xs text-center">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-gray-600">Money Back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded">
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Need Help?</p>
            <p className="text-blue-700">
              Contact our support team for assistance with your order.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutSidebar;