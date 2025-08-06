
import Link from "next/link"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"


const poppins = Poppins({
    subsets:['latin'],
    weight:['700']
})
export const Footer = ()=>{
    return (
        <footer className=" border-t font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx- flex gap-2 h-full items-center px-4 py-5 lg:px-12"> {/* pta hai maine yeha per jo likha hai n max-w-(breakpoint-xl) iska mtlb max-w-screen lekin tailwind v-4 mein isko change kr diya gya hai */ }
            <p>Powerd By </p>
            <Link href="/">
            <span className={cn("text-2xl font-semibold ",poppins.className)}>Funroad</span>
            </Link>
            </div>

        </footer>
    )
}