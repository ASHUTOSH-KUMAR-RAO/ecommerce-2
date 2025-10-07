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
  ShieldCheckIcon,
  StoreIcon,
  TruckIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
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
  const [isCopied, setIsCopied] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
  };

  const handleShare = async () => {
    const shareData = {
      title: data.name,
      text: `Check out ${data.name} for ₹${data.price}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared Successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (isCopied) return; // Agar already copied hai to return kar do

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied to Clipboard!");

      // Copy icon ko check icon mein change karo
      setIsCopied(true);

      // 3 second baad wapas copy icon dikha do
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        <Card className="overflow-hidden shadow-lg">
          {/* Product Image */}
          <div className="relative aspect-[16/9] lg:aspect-[20/8] bg-gradient-to-br from-pink-50 to-purple-50">
            <Image
              src={data.images?.url || "/authpages.png"}
              alt={data.name}
              fill
              className="object-cover"
              priority
            />

            {/* Price & Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Badge className="bg-pink-600 text-white px-4 py-2 text-lg font-bold">
                ₹{data.price}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="elevated"
                  size="sm"
                  className={`bg-white ${
                    isWishlisted ? "text-red-500" : "text-gray-600"
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <HeartIcon
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  variant="elevated"
                  size="sm"
                  className="bg-white text-gray-600"
                  onClick={handleShare}
                >
                  <ShareIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stock Badge */}
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-green-500 text-white px-3 py-1 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                In Stock
              </Badge>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Main Content */}
              <div className="lg:col-span-3 p-8 lg:p-10">
                {/* Product Header */}
                <div className="mb-8">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {data.name}
                  </h1>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Link
                      href={generateTenantURL(tenantSlug)}
                      className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      {data.tenant.image?.url && (
                        <Image
                          src={data.tenant.image.url}
                          alt={data.tenant.name}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      )}
                      <StoreIcon className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-700">
                        {data.tenant.name}
                      </span>
                    </Link>

                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                      <StarRating
                        rating={data.reviewRating}
                        iconClassName="w-4 h-4"
                      />
                      <span className="font-bold text-gray-800">
                        {data.reviewRating}
                      </span>
                      <span className="text-gray-600">
                        ({data.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {data.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">
                      Product Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {data.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <ShieldCheckIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-800">
                          Money Back Guarantee
                        </p>
                        <p className="text-green-600 text-sm">
                          {data.reFundPolicy === "no_refund"
                            ? "No refund"
                            : `${data.reFundPolicy} refund`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <TruckIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-800">Fast Delivery</p>
                        <p className="text-blue-600 text-sm">
                          Quick & secure shipping
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 lg:border-l bg-gray-50">
                {/* Purchase Section */}
                <div className="p-6 border-b">
                  <div className="space-y-4">
                    <div className="text-center bg-white p-5 rounded-lg border">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ₹{data.price}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Best price guaranteed
                      </p>
                    </div>

                    <CartButton
                      isPurchase={data.isPurchase}
                      productId={productId}
                      tenantSlug={tenantSlug}
                    />

                    <Button
                      variant="elevated"
                      size="lg"
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                      onClick={handleCopyLink}
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <CheckIcon className="w-4 h-4 mr-2 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Ratings Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Customer Reviews
                    </h3>
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-current" />
                      {data.reviewRating}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <span className="font-semibold text-gray-700 text-sm">
                            {stars}
                          </span>
                          <StarIcon className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        <Progress
                          value={data.ratingDistribution[stars]}
                          className="h-2 flex-1"
                        />
                        <span className="font-semibold text-gray-700 text-sm min-w-[45px] text-right">
                          {data.ratingDistribution[stars]}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-purple-50 rounded-lg text-center">
                    <p className="font-bold text-gray-800">
                      {data.reviewCount} Reviews
                    </p>
                    <p className="text-gray-600 text-sm">
                      from verified buyers
                    </p>
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
