"use client"

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewSidebar from "../components/review-sidebar";

interface Props {
  productId: string;
}

const ProductView = ({productId}:Props) => {
  const trpc = useTRPC()

    const {data} = useSuspenseQuery(trpc.library.getOne.queryOptions({productId}))
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#f4f4f0] w-full border-b">
        <Link prefetch href="/library" className="flex items-center gap-2">
          <ArrowLeftIcon />
          <span className="text font-medium">Back To Library</span>
        </Link>
      </nav>

      <header className="bg-[#f4f4f4]  py-6 border-b">
        <div className="mx-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 ">
          <h1 className="font-semibold text-[40px]">{data.name}</h1>
        </div>
      </header>
      <section className="mx-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-14">
        <div className="lg:col-span-2">

          <div className="p-4 bg-white rounded-md border gap-4">
        <ReviewSidebar productId={productId}/>
          </div>
        </div>
        <div className="lg:col-span-5">
          <p className="font-medium italic text-muted-foreground">No Special Content</p>
        </div>
          </div>
      </section>
    </div>
  );
};

export default ProductView;
