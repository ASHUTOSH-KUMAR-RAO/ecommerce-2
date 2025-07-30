import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { LoadProductsFilter } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

const page = async ({ params, searchParams }: Props) => {
  // Here you can fetch products based on the category
  const { category } = await params;

  const filters = await LoadProductsFilter(searchParams);

  console.log(JSON.stringify(filters), "THIS IS FROM RSC");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};

export default page;
