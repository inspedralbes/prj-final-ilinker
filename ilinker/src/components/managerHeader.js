"use client"

import { usePathname } from "next/navigation";
import SearchHeader from "@/components/searchHeader";
import HeaderDefault from "@/components/headerDefault";
export default function ManagerHeader(){
    const pathname = usePathname(); // Ahora funciona porque es cliente
    return <HeaderDefault />;

}