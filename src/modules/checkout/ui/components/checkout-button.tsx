import { useCart } from "../../hook/use-cart";

import { Button } from "@/components/ui/button";

import { cn, generateTenantURL } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  className?: string;
  hideIfEmpty?: boolean;
  tenant: string;
}

export const CheckoutButton = ({ className, hideIfEmpty, tenant }: Props) => {
  const { totalItems } = useCart(tenant);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button asChild variant="elevated" className={cn("bg-white", className)}>
      <Link href={`${generateTenantURL(tenant)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};
