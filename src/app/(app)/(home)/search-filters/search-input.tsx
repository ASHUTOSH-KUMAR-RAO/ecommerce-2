"use client";


import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { CustomCategory } from "../types";
import { CategorySidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  data: CustomCategory[];
}
export const SearchInput = ({ disabled,data }: Props) => {
  const [isSidebarOpen,setIsSidebarOpen] = useState(false)
  return (
    <div className="flex items-center w-full gap-2">
      <CategorySidebar data={data} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
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
      className="size-12 flex shrink-0 lg:hidden"
      onClick={()=>setIsSidebarOpen(true)}
      >
          <ListFilterIcon className="size-4"/>
      </Button>
    </div>
  );
};
