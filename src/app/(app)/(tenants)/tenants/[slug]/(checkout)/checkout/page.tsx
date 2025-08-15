import CheckoutViews from "@/modules/checkout/ui/views/checkout-views";

interface Props {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return <CheckoutViews tenantSlug={slug}/>;
};

export default page;
