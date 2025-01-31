"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BriefcaseIcon, SearchIcon, BellIcon, MessageCircleIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <BriefcaseIcon className="h-6 w-6" />
                        <span className="font-bold">ILinker</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-6">
                        <Link href="/feed" className={pathname === "/feed" ? "text-foreground" : "text-muted-foreground"}>
                            <SearchIcon className="h-5 w-5" />
                        </Link>
                        <Link href="/messages" className={pathname === "/messages" ? "text-foreground" : "text-muted-foreground"}>
                            <MessageCircleIcon className="h-5 w-5" />
                        </Link>
                        <Link href="/notifications" className={pathname === "/notifications" ? "text-foreground" : "text-muted-foreground"}>
                            <BellIcon className="h-5 w-5" />
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Register</Link>
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}