"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarSidebar } from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="elevated"
      className={cn(
        "bg-white/70 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-200 hover:border-purple-300 px-4 py-2 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg",
        isActive && "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-purple-500"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navrbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" 
             style={{animation: "blob 7s infinite"}}></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" 
             style={{animation: "blob 7s infinite 2s"}}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" 
             style={{animation: "blob 7s infinite 4s"}}></div>
      </div>

      <nav className="relative h-20 flex border-b justify-between font-medium bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 backdrop-blur-lg border-white/20 shadow-lg">
        <Link href="/" className="pl-6 flex items-center">
          <span className={cn(
            "text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent",
            poppins.className
          )}>
            FunRoad ✨
          </span>
        </Link>

        <NavbarSidebar
          items={navrbarItems}
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />

        <div className="items-center gap-4 lg:flex hidden">
          {navrbarItems.map((item) => (
            <NavbarItem
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.children}
            </NavbarItem>
          ))}
        </div>

        {session.data?.user ? (
          <div className="hidden lg:flex items-center pr-6">
            <Button
              asChild
              variant="elevated"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-none relative overflow-hidden group"
            >
              <Link href="/admin">
                <span className="relative z-10">🚀 Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-4 pr-6">
            <Button
              asChild
              variant="elevated"
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-200 hover:border-purple-300 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg text-gray-700 font-semibold"
            >
              <Link prefetch href="/sign-in">
                📧 Log In
              </Link>
            </Button>
            <Button
              asChild
              variant="elevated"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-none relative overflow-hidden group"
            >
              <Link prefetch href="/sign-up">
                <span className="relative z-10">🎉 Start Selling</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          </div>
        )}

        <div className="flex lg:hidden items-center justify-center pr-4">
          <Button
            variant="elevated"
            className="size-12 bg-white/70 backdrop-blur-sm hover:bg-white/90 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="text-purple-600" />
          </Button>
        </div>
      </nav>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};