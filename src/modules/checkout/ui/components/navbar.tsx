"use client";

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import Link from "next/link";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx- flex justify-between h-full items-center px-4 lg:px-12">
        <p className="text-xl">Checkout</p>
        <Button variant="elevated" asChild>
          <Link href={generateTenantURL(slug)}>Continue Shoping</Link>
        </Button>
      </div>
    </nav>
  );
};
