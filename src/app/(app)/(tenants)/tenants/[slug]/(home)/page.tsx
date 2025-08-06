import type { SearchParams } from "nuqs/server";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { LoadProductsFilter } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


interface Props {
    searchParams: Promise<SearchParams>;
    params: Promise<{ slug: string }>;
}


const Page = async({ searchParams, params }: Props) => {

    const {slug} = await params;
    const filters = await LoadProductsFilter(searchParams);
     const queryClient = getQueryClient();
      void queryClient.prefetchInfiniteQuery(
        trpc.products.getMany.infiniteQueryOptions({
          ...filters,
          tenantSlug:slug,
          limit:DEFAULT_LIMIT
        })
      );
    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narowView/>
    </HydrationBoundary>
  );
}
 
export default Page;