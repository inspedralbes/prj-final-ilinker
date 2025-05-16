"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Building2Icon,
  LandmarkIcon,
  MessageSquareIcon,
  User,
  GraduationCap,
  FileEdit,
  Handshake,
  Bolt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/types/config";
import socket from "@/services/websockets/sockets";
import NotificationDropDown from "./NotificationDropDown";

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
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-[12px]">Ofertas</span>
                </Link>
                <Link
                  href="/publicacion"
                  className={`flex flex-col items-center ${
                    pathname === "/publicacion"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Handshake className="h-5 w-5" />
                  <span className="text-[12px]">Comunidad</span>
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

                <NotificationDropDown />
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
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-[12px]">Ofertas</span>
                </Link>
                <Link
                  href="/publicacion"
                  className={`flex flex-col items-center ${
                    pathname === "/publicacion"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Handshake className="h-5 w-5" />
                  <span className="text-[12px]">Comunidad</span>
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
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
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
function ProfileDropdown({ userData, logout }: { userData: any; logout: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Alterna el menú al hacer clic en la imagen
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: any) => {
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
            config.storageUrl +
              ((userData?.company && userData?.company?.logo) ||
                userData?.student?.photo_pic || (userData?.institution && userData?.institution?.logo)) || 
            "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
          }
          alt="Profile"
          width={40}
          height={40}
          className="rounded-sm cursor-pointer h-10 w-10 object-cover"
        />
      </div>
      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 z-10 mt-2 min-w-[180px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          {/* Opción "My Profile" */}
          {userData?.rol !== "company" && userData?.rol !== "institutions" && (
            <>
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
                <Link
                  href={`/profile/student/${userData?.student.uuid}`}
                  className="ml-2"
                >
                  <p className="font-medium">Mi perfil</p>
                </Link>
              </li>
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/settings`);
                }}
              >
                <Bolt className="w-5 h-5 text-slate-400" />
                <Link href={`/profile/settings`} className="ml-2">
                  <p className="font-medium">Configuración</p>
                </Link>
              </li>
            </>
          )}

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
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/settings`);
                }}
              >
                <Bolt className="w-5 h-5 text-slate-400" />
                <Link href={`/profile/settings`} className="ml-2">
                  <p className="font-medium">Configuración</p>
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

          {userData?.rol === "institutions" ? (
            <>
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  router.push(
                    `/profile/institution/${userData?.institution.slug}`
                  );
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
                  href={`/profile/institution/${userData?.institution.slug}`}
                  className="ml-2"
                >
                  <p className="font-medium">Mi institución</p>
                </Link>
              </li>
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/settings`);
                }}
              >
                <Bolt className="w-5 h-5 text-slate-400" />
                <Link href={`/profile/settings`} className="ml-2">
                  <p className="font-medium">Configuración</p>
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

          <hr className="my-2 border-slate-200" role="separator" />
          {/* Opción "Sign Out" */}
          <li
            role="menuitem"
            className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
            onClick={() => {
              logout();
              setIsOpen(false);
              socket.emit("logout");
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
