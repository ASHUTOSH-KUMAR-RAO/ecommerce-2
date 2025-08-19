"use client";


import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategorySidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
}
export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen,setIsSidebarOpen] = useState(false)
  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions());
  return (
    <div className="flex items-center w-full gap-2">
      <CategorySidebar  open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
      <div className="relative w-full gap-x-2 ">
        <SearchIcon className="absolute  left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          className="pl-10"
          placeholder="Search Products"
          disabled={disabled}
        />
      </div>
      <Button
      variant="elevated"
      className="size-12 border-none bg-[#f5f5f4] flex shrink-0 lg:hidden"
      onClick={()=>setIsSidebarOpen(true)}
      >
          <ListFilterIcon className="size-4"/>
      </Button>
      {session.data?.user &&(
          <Button
          asChild
          variant="elevated"
          className="border-none bg-[#f5f5f4]"
          >
              <Link prefetch href="/library">
                <BookmarkCheckIcon />
                Library
              </Link>
          </Button>
      )}
    </div>
  );
};
