"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );
  return (
    <div>
      <h1>Product List: {JSON.stringify(data, null, 2)}</h1>
      {/* Product items will be rendered here */}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div>
      <h1>Loading Products...</h1>
      {/* Skeleton or loading state can be rendered here */}
    </div>
  );
};
