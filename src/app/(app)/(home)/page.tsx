import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { LoadProductsFilter } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  searchParams: Promise<SearchParams>;
}

const page = async ({  searchParams }: Props) => {
  // Here you can fetch products based on the category

  const filters = await LoadProductsFilter(searchParams);

  console.log(JSON.stringify(filters), "THIS IS FROM RSC");

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit:DEFAULT_LIMIT
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView  />
    </HydrationBoundary>
  );
};

export default page;
