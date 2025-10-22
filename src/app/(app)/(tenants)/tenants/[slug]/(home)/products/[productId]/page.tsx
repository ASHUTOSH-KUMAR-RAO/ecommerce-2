import { ProductView } from "@/modules/products/ui/views/prodct-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId, slug } = await params;

  const queryCLient = getQueryClient();

  void queryCLient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryCLient)}>
      <Suspense fallback= {<p>Loading..</p>}>
        <ProductView
          key={`${productId}-${slug}`} // ✅ Unique key added
          productId={productId}
          tenantSlug={slug}
        />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
