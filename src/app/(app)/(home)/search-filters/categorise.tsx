"use client";

import { CategoryDropDown } from "./category-dropdown";
import { CustomCategory } from "../types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategorySidebar } from "./categories-sidebar";

interface Props {
  data: CustomCategory[];
}

export const Categories = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data?.length || 0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeCategory = "all";

  const activeCategoryIndex =
    data?.findIndex((cat) => cat.slug === activeCategory) || -1;
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No categories available
      </div>
    );
  }

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllButtonWidth = 120; // Approximate width of View All button
      const availableWidth = containerWidth - viewAllButtonWidth - 32; // Extra margin

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width + 8; // Add gap

        if (totalWidth + width > availableWidth) {
          break;
        }
        totalWidth += width;
        visible++;
      }

      // Force show View All if we have more items
      const finalVisible = Math.min(visible, data.length - 1);

      setVisibleCount(finalVisible);
    };

    // Multiple attempts to ensure calculation works
    const timer1 = setTimeout(calculateVisible, 100);
    const timer2 = setTimeout(calculateVisible, 500);

    // ResizeObserver for window resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateVisible, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
    };
  }, [data?.length]);

  return (
    <div className="relative w-full">
      <CategorySidebar
        data={data}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      {/* Hidden measurement container */}
      <div
        ref={measureRef}
        className="absolute pointer-events-none opacity-0 whitespace-nowrap"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          zIndex: -1,
        }}
      >
        {data.map((category) => (
          <div key={category.id} className="inline-block">
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>

      {/* Visible items container */}
      <div
        className="flex flex-nowrap items-center gap-1"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        {/* Show View All button only if there are hidden items */}
        {visibleCount < data.length && (
          <div className="shrink-0 ml-2" ref={viewAllRef}>
            <Button
              className={cn(
                "h-11 px-4 rounded-full transition-all duration-200",
                // Default subtle state - always visible but subtle
                "bg-gray-100 text-gray-600 border border-gray-200",
                // Hover state - more prominent
                "hover:bg-white hover:text-black hover:border-primary hover:shadow-lg",
                // Active state when active category is hidden
                isActiveCategoryHidden &&
                  "bg-primary text-white border-primary shadow-md"
              )}
              onClick={() => setIsSidebarOpen(true)}
            >
              View All
              <ListFilterIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
