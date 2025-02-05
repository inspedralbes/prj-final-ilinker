"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {BriefcaseIcon, SearchIcon, BellIcon, MessageCircleIcon, Search, MapPin} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {Input} from "@/components/ui/input";
import { useState } from 'react';

export default function SearchHeader() {
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto px-4 py-8 max-w-7xl">
                <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/images/logo.svg" alt="logo" width={35} height={35} />
                        <span className="font-bold">iLinker</span>
                    </Link>

                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-6">

                        <Link href="/feed"
                              className={pathname === "/feed" ? "text-foreground" : "text-muted-foreground"}>
                            <SearchIcon className="h-5 w-5"/>
                        </Link>
                        <Link href="/messages"
                              className={pathname === "/messages" ? "text-foreground" : "text-muted-foreground"}>
                            <MessageCircleIcon className="h-5 w-5"/>
                        </Link>
                        <Link href="/notifications"
                              className={pathname === "/notifications" ? "text-foreground" : "text-muted-foreground"}>
                            <BellIcon className="h-5 w-5"/>
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Register</Link>
                        </Button>
                        <ModeToggle/>
                    </div>
                </div>
            </div>
        </header>
    )
}