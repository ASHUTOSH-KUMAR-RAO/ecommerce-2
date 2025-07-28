"use client";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { ChangeEvent } from "react";

interface Props {
  maxPrice?: string | null;
  minPrice?: string | null;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
}

export const FormatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.-]+/g, "");

  const parts = numericValue.split(".");

  const fromatedValue = parts[0] + (parts[1] ? "." + parts[1].slice(0, 2) : "");

  if (!fromatedValue) return "";

  const numberValue = parseFloat(fromatedValue);

  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const PriceFilter = ({
  maxPrice,
  minPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.-]+/g, "");
    if (onMinPriceChange) {
      onMinPriceChange(numericValue);
    }
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.-]+/g, "");
    if (onMaxPriceChange) {
      onMaxPriceChange(numericValue);
    }
  };
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Min Price</Label>
        <Input
          type="text"
          placeholder="Enter min price"
          value={minPrice ? FormatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Max Price</Label>
        <Input
          type="text"
          placeholder="Enter max price"
          value={maxPrice ? FormatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
};
