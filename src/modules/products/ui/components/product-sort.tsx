"use client";


import { Button } from "@/components/ui/button";
import { useProductsFilter } from "../../hooks/use-products-filter";
import { cn } from "@/lib/utils";

export const ProductSort = () => {
  const [filters, setFilters] = useProductsFilter();

  return (
    <div className="flex items-center agp-2">
      <Button
        size="sm"
        className={cn(
          "bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
          filters.sort !== "curated" &&
            "bg-transparent border-transparent hover:border-b hover:bg-transparent"
        )}
        variant="elevated"
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        size="sm"
        className={cn(
          "bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
          filters.sort !== "trending" &&
            "bg-transparent border-transparent hover:border-b hover:bg-transparent"
        )}
        variant="elevated"
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size="sm"
        className={cn(
          "bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
          filters.sort !== "hot_and_new" &&
            "bg-transparent border-transparent hover:border-b hover:bg-transparent"
        )}
        variant="elevated"
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        Hot & New
      </Button>
    </div>
  );
};
