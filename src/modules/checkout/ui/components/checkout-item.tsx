import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  Trash2, 
  ExternalLink, 
  Heart, 
  Star,
  Shield,
  Truck,
  Plus,
  Minus,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  originalPrice?: number; // For showing discounts
  currency?: string;
  quantity?: number;
  onRemove: () => void;
  onQuantityChange?: (quantity: number) => void;
  onSaveForLater?: () => void;
  isRemoving?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  estimatedDelivery?: string;
  returnPolicy?: string;
}

const CheckoutItem = ({
  isLast,
  imageUrl,
  name,
  price,
  originalPrice,
  productUrl,
  onRemove,
  tenantName,
  tenantUrl,
  currency = "$",
  quantity = 1,
  onQuantityChange,
  onSaveForLater,
  isRemoving = false,
  stock,
  rating,
  reviewCount,
  isOnSale = false,
  estimatedDelivery,
  returnPolicy,
}: Props) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const totalPrice = price * quantity;
  const totalOriginalPrice = originalPrice ? originalPrice * quantity : null;
  const savings = totalOriginalPrice ? totalOriginalPrice - totalPrice : 0;
  const isLowStock = stock && stock <= 5;
  const isOutOfStock = stock === 0;

  useEffect(() => {
    if (imageUrl) {
      setIsImageLoading(true);
      setImageError(false);
    }
  }, [imageUrl]);

  const handleSaveForLater = async () => {
    if (!onSaveForLater) return;
    
    setIsSaving(true);
    setTimeout(() => {
      onSaveForLater();
      setIsSaving(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!onQuantityChange) return;
    
    // Prevent quantity from going below 1 or above stock
    const clampedQuantity = Math.max(1, Math.min(newQuantity, stock || Infinity));
    onQuantityChange(clampedQuantity);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        x: -300, 
        transition: { duration: 0.3 } 
      }}
      className={cn(
        "group relative grid grid-cols-[9rem_1fr_auto] gap-4 py-6 px-4 transition-all duration-300",
        !isLast && "border-b border-gray-200",
        isRemoving && "opacity-50 pointer-events-none",
        isOutOfStock && "bg-red-50",
        "hover:bg-gray-50"
      )}
    >
      {/* Sale Badge */}
      <AnimatePresence>
        {isOnSale && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
          >
            SALE
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
        <div className="relative aspect-square h-full bg-gray-100">
          {!imageError ? (
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={name}
              fill
              className={cn(
                "object-cover transition-all duration-300",
                isImageLoading && "blur-sm",
                "group-hover:scale-110"
              )}
              sizes="(max-width: 768px) 9rem, 9rem"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <motion.button
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            onClick={() => setShowDetails(!showDetails)}
            className="bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-4 w-4 text-gray-700" />
          </motion.button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between min-w-0 space-y-3">
        <div className="space-y-2">
          {/* Product Name & Rating */}
          <div>
            <Link 
              href={productUrl}
              className="group/link block"
            >
              <h4 className="font-semibold text-gray-900 line-clamp-2 text-lg group-hover/link:text-blue-600 transition-colors">
                {name}
                <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </h4>
            </Link>
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {rating.toFixed(1)} {reviewCount && `(${reviewCount})`}
                </span>
              </div>
            )}
          </div>
          
          {/* Tenant */}
          <Link 
            href={tenantUrl}
            className="group/tenant inline-block"
          >
            <p className="text-sm text-gray-600 font-medium group-hover/tenant:text-blue-600 transition-colors">
              by {tenantName}
              <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover/tenant:opacity-100 transition-opacity" />
            </p>
          </Link>

          {/* Stock Status */}
          {stock !== undefined && (
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  Only {stock} left
                </span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  In Stock ({stock})
                </span>
              )}
            </div>
          )}

          {/* Delivery Info */}
          {estimatedDelivery && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Truck className="h-4 w-4" />
              <span>Delivery: {estimatedDelivery}</span>
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        {onQuantityChange && !isOutOfStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1 || isRemoving}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 bg-gray-50 border-x-2 border-gray-300 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRemoving || (stock && quantity >= stock)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {stock && quantity >= stock && (
              <span className="text-xs text-orange-600">Max quantity reached</span>
            )}
          </div>
        )}

        {/* Additional Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t border-gray-200"
            >
              {returnPolicy && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4" />
                  <span>{returnPolicy}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Buyer Protection Guarantee</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price and Actions */}
      <div className="flex flex-col justify-between items-end text-right space-y-3">
        <div className="space-y-2">
          {/* Price Display */}
          <div className="space-y-1">
            {quantity > 1 && (
              <p className="text-xs text-gray-500">
                {currency}{price.toFixed(2)} × {quantity}
              </p>
            )}
            
            <div className="space-y-1">
              {originalPrice && originalPrice > price && (
                <p className="text-sm text-gray-400 line-through">
                  {currency}{totalOriginalPrice?.toFixed(2)}
                </p>
              )}
              <p className="font-bold text-xl text-gray-900">
                {currency}{totalPrice.toFixed(2)}
              </p>
            </div>

            {savings > 0 && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full"
              >
                Save {currency}{savings.toFixed(2)}
              </motion.p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Save for Later */}
          {onSaveForLater && (
            <button
              onClick={handleSaveForLater}
              disabled={isSaving || isRemoving}
              className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart className={cn("h-4 w-4", isSaving && "animate-pulse")} />
              {isSaving ? "Saving..." : "Save for Later"}
            </button>
          )}
          
          {/* Remove Button */}
          <button
            onClick={onRemove}
            type="button"
            disabled={isRemoving}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className={cn("h-4 w-4", isRemoving && "animate-spin")} />
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isRemoving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20"
          >
            <div className="flex items-center gap-2 text-gray-600">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
              />
              <span className="font-medium">Removing item...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CheckoutItem;