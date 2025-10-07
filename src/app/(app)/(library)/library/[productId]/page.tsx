import LibraryView from "@/modules/library/ui/view/library-view";
import ProductView from "@/modules/library/ui/view/product-views";
import { useTRPC } from "@/trpc/client";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";

interface Props {
  params: Promise<{
    productId: string;
  }>;
}
const page = async ({ params }: Props) => {
  const { productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );
  return;
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ProductView productId={productId} />
  </HydrationBoundary>;
};

export default page;
