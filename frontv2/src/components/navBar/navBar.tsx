"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Building2Icon,
  LandmarkIcon,
  MessageSquareIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const { loggedIn, userData, logout } = useContext(AuthContext);
  const router = useRouter();
  if (pathname === "/") {
    return null;
  }
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
            {loggedIn ? (
              <>
                <Link
                  href="/search"
                  className={`flex flex-col items-center ${
                    pathname === "/search"
                      ? "text-foreground flex flex-col items-center"
                      : "text-muted-foreground flex flex-col items-center"
                  }`}
                >
                  <Building2Icon className="h-5 w-5" />
                  <span className="text-[12px]">Empresas</span>
                </Link>
                <Link
                  href="/people"
                  className={`flex flex-col items-center ${
                    pathname === "/people"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-[12px]">Personas</span>
                </Link>
                <Link
                  href="/institutions"
                  className={`flex flex-col items-center ${
                    pathname === "/institutions"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <LandmarkIcon className="h-5 w-5" />
                  <span className="text-[12px]">Personas</span>
                </Link>
                <Link
                  href="/messages"
                  className={`flex flex-col items-center ${
                    pathname === "/messages"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <MessageSquareIcon className="h-5 w-5" />
                  <span className="text-[12px]">Mensajes</span>
                </Link>
                <Link
                  href="/notifications"
                  className={`flex flex-col items-center ${
                    pathname === "/notifications"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="text-[12px]">Notificaciones</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/search"
                  className={`flex flex-col items-center ${
                    pathname === "/search"
                      ? "text-foreground flex flex-col items-center"
                      : "text-muted-foreground flex flex-col items-center"
                  }`}
                >
                  <Building2Icon className="h-5 w-5" />
                  <span className="text-[12px]">Empresas</span>
                </Link>
                <Link
                  href="/people"
                  className={`flex flex-col items-center ${
                    pathname === "/people"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-[12px]">Personas</span>
                </Link>
                <Link
                  href="/institutions"
                  className={`flex flex-col items-center ${
                    pathname === "/institutions"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <LandmarkIcon className="h-5 w-5" />
                  <span className="text-[12px]">Institutos</span>
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            {loggedIn ? (
              <ProfileDropdown userData={userData} logout={logout} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
            {/*<ModeToggle/>*/}
          </div>
        </div>
      </div>
    </header>
  );
}

// Componente para el menú desplegable del perfil
function ProfileDropdown({ userData, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
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
    <div className="relative mx-2" ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        <Image
          src={
            userData?.photo_pic ||
            "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
          }
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
            <Link href={`/profile/student/${userData.slug}`} className="ml-2">
              <p className="font-medium">Mi perfil</p>
            </Link>
          </li>
          {/* Opción "My Profile" */}
          {userData?.rol === "company" ? (
            <>
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/company/${userData?.company.slug}`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21v-3.75C3 14.56 4.56 13 6.75 13h10.5C19.44 13 21 14.56 21 17.25V21m-18 0h18M4.5 7h15m-15 4.5h15M9 3h6v4.5H9V3z"
                  />
                </svg>
                <Link
                  href={`/profile/company/${userData?.company.slug}`}
                  className="ml-2"
                >
                  <p className="font-medium">Mi compañia</p>
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

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
              <p className="font-medium">Ayuda</p>
            </Link>
          </li>
          <hr className="my-2 border-slate-200" role="separator" />
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
