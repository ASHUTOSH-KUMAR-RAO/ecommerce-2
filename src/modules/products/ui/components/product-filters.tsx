"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductsFilter } from "../../hooks/use-products-filter";
import { TagsFilter } from "./tags-filter";

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
  const [filters, setFilters] = useProductsFilter();

  const hasManyFilters = Object.entries(filters).some(([key,value]) => {
    if (key == "sort") return false; // Skip sort filter{

    if (Array.isArray(value)) {
      return value.length >0
    }

    if (typeof value === "string") {
      return value !== "";
    }
    return value != null;
  });

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  // Clear all filters function
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-lg font-semibold">Filters</h1>
        {hasManyFilters && (
          <button
            className="underline text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => onClear()} // Fixed: Added proper function
            type="button"
          >
            Clear All
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
