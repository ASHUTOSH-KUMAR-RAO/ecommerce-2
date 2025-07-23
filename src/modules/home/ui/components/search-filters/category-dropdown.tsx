"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropdownPositon } from "./use-dropdown-position";
import { SubCategoryMenu } from "./subcategory-menu";
import Link from "next/link";
import { CategoriesDetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesDetManyOutput[1];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export const CategoryDropDown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsopen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPositon(dropDownRef);

  const onMouseEnter = () => {
    if (category.subCategorise) {
      setIsopen(true);
    }
  };

  const onMouseLeave = () => setIsopen(false);
  const dropdownPosition = getDropdownPosition();

  // const toggleDrop = () => {
  //   if (category.subcategorise?.docs?.length) {
  //     setIsopen(!isOpen);
  //   }
  // };

  return (
    <div
      className="relative"
      ref={dropDownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={toggleDrop}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:text-black hover:border-primary",
            isActive && !isNavigationHovered && "bg-white border-primary",
            isOpen &&
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] -translate-y-[4px] transition-all"
          )}
        >
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>

        {category.subCategorise && category.subCategorise.length > 0 && (
          <div
            className={cn(
              "absolute -bottom-2 left-1/2 -translate-x-1/2 transition-opacity duration-200",
              "w-4 h-2 bg-black clip-path-triangle",
              isOpen ? "opacity-100" : "opacity-0"
            )}
            style={{
              clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
            }}
          />
        )}
      </div>
      <SubCategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
