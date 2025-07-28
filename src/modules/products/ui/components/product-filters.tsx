"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductsFilter } from "../../hooks/use-products-filter";

interface ProductFiltersProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const ProductFilter = ({ title, children, className }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 flex border-b flex-col gap-2", className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h1 className="text-lg font-semibold">{title}</h1>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>

      {isOpen && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
};

export const ProductFilters = () => {
  const { minPrice, setMinPrice, maxPrice, setMaxPrice } = useProductsFilter();
  
  // Clear all filters function
  const clearAllFilters = () => {
    setMinPrice(null);
    setMaxPrice(null);
  };

  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-lg font-semibold">Filters</h1>
        <button
          className="underline text-blue-500 hover:text-blue-700 cursor-pointer"
          onClick={clearAllFilters} // Fixed: Added proper function
          type="button"
        >
          Clear All
        </button>
      </div>
      <ProductFilter title="price">
        <PriceFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />
      </ProductFilter>
    </div>
  );
};