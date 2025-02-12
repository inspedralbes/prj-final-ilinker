"use client"

import {Button} from "@/components/ui/button"
import {ModeToggle} from "@/components/mode-toggle"
import {BriefcaseIcon, SearchIcon, BellIcon, MessageCircleIcon, Building2Icon, User, LandmarkIcon} from "lucide-react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import Image from "next/image"
import {AuthContext} from "@/contexts/AuthContext";
import {useContext, useEffect, useRef, useState} from "react";

export default function HeaderDefault() {
    const pathname = usePathname();
    const {loggedIn, userData, logout} = useContext(AuthContext);

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto px-4 py-8 max-w-7xl">
                <div className="mr-4 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/images/logo.svg" alt="logo" width={35} height={35}/>
                        <span className="font-bold">iLinker</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center space-x-6">
                        {loggedIn ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <Link href="/search"
                                      className={`flex flex-col items-center ${pathname === "/feed" ? "text-foreground flex flex-col items-center" : "text-muted-foreground flex flex-col items-center"}`}>
                                    <Building2Icon className="h-4 w-4"/>
                                    <span className="text-[12px]">Empresas</span>
                                </Link>
                                <Link href="/people"
                                      className={`flex flex-col items-center ${pathname === "/messages" ? "text-foreground" : "text-muted-foreground"}`}>
                                    <User className="h-4 w-4"/>
                                    <span className="text-[12px]">Personas</span>
                                </Link>
                                <Link href="/institutions"
                                      className={`flex flex-col items-center ${pathname === "/notifications" ? "text-foreground" : "text-muted-foreground"}`}>
                                    <LandmarkIcon className="h-4 w-4"/>
                                    <span className="text-[12px]">Personas</span>
                                </Link>
                            </>
                        )}
                    </nav>
                    <div className="flex items-center space-x-2">
                        {loggedIn ? (
                            <ProfileDropdown userData={userData} logout={logout}/>
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
                        <ModeToggle/>
                    </div>
                </div>
            </div>
        </header>

    )
}

// Componente para el menú desplegable del perfil
function ProfileDropdown({userData, logout}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Alterna el menú al hacer clic en la imagen
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Cierra el menú si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={toggleDropdown}>
                <Image
                    src={userData?.profilePic || "/default-profile.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                />
            </div>
            {isOpen && (
                <ul
                    role="menu"
                    className="absolute right-0 z-10 mt-2 min-w-[180px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                    {/* Opción "My Profile" */}
                    <li
                        role="menuitem"
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-5 h-5 text-slate-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <Link href="/profile" className="ml-2">
                            <p className="font-medium">My Profile</p>
                        </Link>
                    </li>
                    {/* Opción "Edit Profile" */}
                    <li
                        role="menuitem"
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-5 h-5 text-slate-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652A1 1 0 0 1 11.18 19H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <Link href="/profile/edit" className="ml-2">
                            <p className="font-medium">Edit Profile</p>
                        </Link>
                    </li>
                    {/* Opción "Inbox" */}
                    <li
                        role="menuitem"
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-5 h-5 text-slate-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 0 1 5.273 3h9.454a2.75 2.75 0 0 1 2.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3.73Z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M3.068 5.418A1.25 1.25 0 0 1 5.273 4.5h9.454a1.25 1.25 0 0 1 1.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 0 0-.86.49l-.606 1.02a1 1 0 0 1-.86.49H8.236a1 1 0 0 1-.894-.553l-.448-.894A1 1 0 0 0 6 11H2.53l.015-.062 1.523-5.52Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <Link href="/inbox" className="ml-2">
                            <p className="font-medium">Inbox</p>
                        </Link>
                    </li>
                    {/* Opción "Help" */}
                    <li
                        role="menuitem"
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-5 h-5 text-slate-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <Link href="/help" className="ml-2">
                            <p className="font-medium">Help</p>
                        </Link>
                    </li>
                    <hr className="my-2 border-slate-200" role="separator"/>
                    {/* Opción "Sign Out" */}
                    <li
                        role="menuitem"
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-5 h-5 text-slate-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="font-medium ml-2">Sign Out</p>
                    </li>
                </ul>
            )}
        </div>
    );
}