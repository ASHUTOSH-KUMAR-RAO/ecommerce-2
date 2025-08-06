"use client";

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx- flex justify-between h-full items-center px-4 lg:px-12">
        {" "}
        {/* pta hai maine yeha per jo likha hai n max-w-(breakpoint-xl) iska mtlb max-w-screen lekin tailwind v-4 mein isko change kr diya gya hai */}
        <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
        {data.image?.url && (
            <Image src={data.image.url} width={32} height={32} className="rounded-full border shrink-0 size-[32px]" alt={slug}/>
        )}
        <p className="text-xl">{data.name}</p>
        </Link>
      </div>
    </nav>
  );
};

export const NavbarSkelton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx- flex justify-between h-full items-center px-4 lg:px-12">
        <div />
      </div>
    </nav>
  );
};
