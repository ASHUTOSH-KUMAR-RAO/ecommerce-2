import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hook/use-cart";
import { ShoppingCartIcon } from "lucide-react";

interface Props {
  tenantSlug: string;
  productId:string
}

export const CartButton = ({ tenantSlug,productId }: Props) => {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant="elevated"
      size="lg"
      className={cn("w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",cart.isProductCart(productId)&& "bg-white text-black")}
      onClick={()=>cart.toggleProduct(productId)}
    >
      <ShoppingCartIcon className="w-5 h-5 mr-3" />
      {cart.isProductCart(productId)?"Remove From Cart":"Add to Cart"}
    </Button>
  );
};
