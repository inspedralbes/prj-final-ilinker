"use client"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchIcon, BellIcon, MessageCircleIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/authContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const { userData, loading, logout } = useAuth()

    const getInitials = (name) => {
        if (!name) return "U"
        return name.split(" ").map(n => n[0]).join("").toUpperCase()
    }

    console.log("Usuario", userData);
    

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
                    {userData && (
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
                    )}
                    <div className="flex items-center space-x-2">
                        {!loading && (
                            <>
                                {userData.status == 'success' ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center space-x-2">
                                            <Avatar>
                                                <AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{userData?.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push("/profile")}>
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Perfil</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Cerrar sesión</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/register">Register</Link>
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
