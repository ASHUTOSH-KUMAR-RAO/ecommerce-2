import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilter, SearchFiltersLoading } from "./search-filters";

import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* HydrationBoundary ko tRPC ke saath use karne ka reason hai ki yeh server-side rendering (SSR) aur client-side hydration ko smooth tareeke se handle karta hai, especially jab @tanstack/react-query ke saath kaam kar rahe ho */}
        <Suspense fallback={<SearchFiltersLoading/>}>
          {/* <Suspense> React ka ek feature hai jo asynchronous data (jaise API calls ya lazy-loaded components) ke liye fallback UI show karta hai jab tak data ready nahi hota. */}
          <SearchFilter />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#f0f0f1]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
