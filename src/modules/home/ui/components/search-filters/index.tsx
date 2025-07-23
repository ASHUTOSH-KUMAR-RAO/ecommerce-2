"use client";

import { useTRPC } from "@/trpc/client";
import { Categories } from "./categorise";
import { SearchInput } from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_CATEGORY_COLOR } from "@/modules/home/constants";
import BreadcrumbsNavigation from "./breadcrumbs-navigation";

export const SearchFilter = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();
  const categoryParams = params.category as string | undefined;
  const activeCategory = categoryParams || "all";
  const activeCategoryIndex = data?.find((cat) => cat.slug === activeCategory);

  const activeCategoryColor = activeCategoryIndex?.color || DEFAULT_CATEGORY_COLOR;

  const activeCategoryName = activeCategoryIndex?.name || null;

  const activeSubCategory = params.subcategory as string | undefined;
  const activeSubCategoryName = activeCategoryIndex?.subcategorise?.find((sub) => sub.slug === activeSubCategory)?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col w-full gap-4"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbsNavigation
        activeCategoryName={activeCategoryName}
        activeSubCategoryName={activeSubCategoryName}
        activeCategory={activeCategory}
      />
    </div>
  );
};

export const SearchFiltersLoading = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col w-full gap-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
