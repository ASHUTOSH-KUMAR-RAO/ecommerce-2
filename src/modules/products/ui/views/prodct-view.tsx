"use client";

import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  StarIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  StoreIcon,
  TruckIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon,
  CopyIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CartButton } from "../components/cart-button";

interface Props {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  const [isWishlisted, setIsWishlisted] = useState(false);
  const averageRating = 4.2;
  const totalRatings = 156;
  const ratingDistribution = [65, 20, 10, 3, 2];

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success("💖 Added to Wishlist!", {
        description: `${data.name} has been added to your wishlist`,
        action: {
          label: "View Wishlist",
          onClick: () => toast.info("Opening wishlist..."),
        },
        duration: 3000,
      });
    } else {
      toast.info("💔 Removed from Wishlist", {
        description: `${data.name} has been removed from your wishlist`,
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: data.name,
      text: `Check out this amazing product: ${data.name} for just ${data.price}!`,
      url: window.location.href,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("🚀 Shared Successfully!", {
          description: "Product has been shared successfully",
          duration: 2000,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          // Fallback to clipboard if native sharing fails
          handleCopyLink();
        }
      }
    } else {
      // Fallback to clipboard for browsers that don't support native sharing
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("🔗 Link Copied!", {
        description: "Product link has been copied to clipboard",
        action: {
          label: "Share via WhatsApp",
          onClick: () => {
            const whatsappUrl = `https://wa.me/?text=Check out this product: ${encodeURIComponent(data.name)} - ${window.location.href}`;
            window.open(whatsappUrl, "_blank");
            toast.success("📱 Opening WhatsApp...");
          },
        },
        duration: 4000,
      });
    } catch (err) {
      toast.error("❌ Failed to copy link", {
        description: "Please try again or copy the URL manually",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        {/* Main Product Card */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          {/* Hero Image Section with Enhanced Styling */}
          <div className="relative aspect-[16/9] lg:aspect-[20/8] bg-gradient-to-br from-pink-100 via-purple-50 to-amber-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
            <Image
              src={data.images?.url || "/authpages.png"}
              alt={data.name}
              fill
              className="object-cover transition-all duration-700 hover:scale-110"
              priority
            />

            {/* Floating Elements */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
              <Badge className="bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white px-6 py-3 text-xl font-bold shadow-2xl border-0 animate-pulse">
                ${data.price}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="elevated"
                  size="sm"
                  className={`bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 ${
                    isWishlisted
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-600 hover:text-red-400"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <HeartIcon
                    className={`w-4 h-4 transition-all duration-300 ${
                      isWishlisted
                        ? "fill-current scale-110"
                        : "hover:scale-110"
                    }`}
                  />
                </Button>
                <Button
                  variant="elevated"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-blue-500 transition-all duration-300"
                  onClick={handleShare}
                >
                  <ShareIcon className="w-4 h-4 transition-transform hover:scale-110" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="absolute bottom-6 left-6 z-20">
              <Badge className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                In Stock
              </Badge>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Main Content Area */}
              <div className="lg:col-span-3 p-8 lg:p-12">
                {/* Product Header */}
                <div className="space-y-6 mb-10">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight mb-4">
                      {data.name}
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap">
                    <Link
                      href={generateTenantURL(tenantSlug)}
                      className="flex items-center gap-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-pink-50 px-4 py-3 rounded-xl transition-all duration-300 group border border-transparent hover:border-pink-200"
                    >
                      {data.tenant.image?.url && (
                        <Image
                          src={data.tenant.image.url}
                          alt={data.tenant.name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-gray-200 group-hover:border-pink-300 transition-all duration-300 group-hover:scale-110"
                        />
                      )}
                      <StoreIcon className="w-5 h-5 text-gray-500 group-hover:text-pink-600 transition-colors" />
                      <span className="font-semibold text-gray-700 group-hover:text-pink-700 transition-colors">
                        {data.tenant.name}
                      </span>
                    </Link>

                    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3 rounded-xl border border-amber-200">
                      <StarRating
                        rating={averageRating}
                        iconClassName="w-5 h-5"
                      />
                      <span className="font-bold text-gray-800 text-lg">
                        {averageRating}
                      </span>
                      <span className="text-gray-600 font-medium">
                        ({totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Description */}
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    📖 Product Details
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border border-gray-200/50">
                    {data.description ? (
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {data.description}
                      </p>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg">
                          No description provided by the seller
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800 text-lg">
                          Money Back Guarantee
                        </p>
                        <p className="text-green-600 font-medium">
                          {data.reFundPolicy === "no_refund"
                            ? "No refund policy"
                            : `${data.reFundPolicy} refund policy`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <TruckIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-800 text-lg">
                          Fast Delivery
                        </p>
                        <p className="text-blue-600 font-medium">
                          Quick & secure shipping
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-2 lg:border-l bg-gradient-to-b from-gray-50/80 via-white/50 to-purple-50/30">
                {/* Purchase Section */}
                <div className="p-8 border-b border-gray-200/50">
                  <div className="space-y-6">
                    <div className="text-center bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200/30">
                      <div className="text-4xl font-black text-gray-800 mb-2">
                        ${data.price}
                      </div>
                      <p className="text-gray-600 font-semibold">
                        ✨ Best price guaranteed
                      </p>
                    </div>

                    <div className="space-y-3">
                      <CartButton
                        isPurchase={data.isPurchase}
                        productId={productId}
                        tenantSlug={tenantSlug}
                      />

                      <Button
                        variant="elevated"
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-200 to-yellow-200 hover:from-amber-300 hover:to-yellow-300 text-gray-800 font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        onClick={handleCopyLink}
                      >
                        <CopyIcon className="w-5 h-5 mr-3" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Ratings Section */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Customer Reviews
                    </h3>
                    <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                      <div className="flex items-center gap-2">
                        <StarIcon className="w-5 h-5 fill-current" />
                        <span className="text-lg">{averageRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* ✅ MAIN FIX: Added unique keys for rating distribution mapping */}
                    {[5, 4, 3, 2, 1].map((stars, index) => (
                      <div key={`rating-${stars}-${index}`} className="group">
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50/50 transition-colors">
                          <div className="flex items-center gap-2 min-w-[90px]">
                            <span className="font-bold text-gray-700">
                              {stars}
                            </span>
                            <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <Progress
                              value={ratingDistribution[index]}
                              className="h-3 bg-gray-200 group-hover:bg-gray-300 transition-colors"
                            />
                          </div>
                          <span className="font-bold text-gray-700 min-w-[50px] text-right">
                            {ratingDistribution[index]}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl border border-purple-200/30">
                    <div className="text-center">
                      <div className="text-3xl mb-2">⭐</div>
                      <p className="font-bold text-gray-800 text-lg">
                        {totalRatings} Happy Customers
                      </p>
                      <p className="text-gray-600 mt-1">
                        have reviewed this product
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
