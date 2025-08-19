import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { ProductList, ProductListSkeleton } from "../components/product-list";

const LibraryView = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#f4f4f0] w-full border-b">
        <Link prefetch href="/" className="flex items-center gap-2">
          <ArrowLeftIcon />
          <span className="text font-medium">Continue Shoping</span>
        </Link>
      </nav>

      <header className="bg-[#f4f4f4]  py-6 border-b">
        <div className="mx-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-2">
          <h1 className="font-semibold text-[40px]">Library</h1>
          <p className="font-medium">Your Purchase and Review</p>
        </div>
      </header>
      <section className="mx-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />.
        </Suspense>
      </section>
    </div>
  );
};

export default LibraryView;
