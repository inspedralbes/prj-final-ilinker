"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Building2Icon,
  LandmarkIcon,
  MessageSquareIcon,
  User,
  GraduationCap,
  Menu,
  X,
  Handshake,
  Bolt,
  FileEdit
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import config from "@/types/config";
import socket from "@/services/websockets/sockets";
import NotificationDropDown from "./NotificationDropDown";

export default function NavBar() {
  const pathname = usePathname();
  const { loggedIn, userData, logout } = useContext(AuthContext);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // No mostrar la barra de navegación en la página de inicio
  if (pathname === "/") return null;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
          {/* Logo y avatar (solo móvil) */}
          <div className="flex items-center space-x-4 ">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.svg" alt="logo" width={35} height={35} />
              <span className="font-bold">iLinker</span>
            </Link>

          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center space-x-6">
              {loggedIn ? (
                <>
                  <NavLink href="/search" icon={<GraduationCap />} label="Ofertas" active={pathname === "/search"} />
                  <NavLink href="/publicacion" icon={<Handshake />} label="Comunidad" active={pathname === "/publicacion"} />
                  <NavLink href="/messages" icon={<MessageSquareIcon />} label="Mensajes" active={pathname === "/messages"} />
                </>
              ) : (
                <>
                  <NavLink href="/search" icon={<GraduationCap />} label="Ofertas" active={pathname === "/search"} />
                  <NavLink href="/publicacion" icon={<Handshake />} label="Comunidad" active={pathname === "/publicacion"} />
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {loggedIn ? (
                <>
                  <NotificationDropDown />
                  <ProfileDropdown userData={userData} logout={logout} />
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Botón de notificaciones y menú */}
          <div className="md:hidden flex items-center space-x-4">
            {loggedIn && <NotificationDropDown />}
            <button onClick={() => setSidebarOpen(true)} className="p-1">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar (en lugar de drawer) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Menú</h2>
          <button onClick={() => setSidebarOpen(false)} className="p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Navegación</h3>
            <nav className="flex flex-col space-y-3">
              {loggedIn ? (
                <>
                  <SidebarLink href="/search" icon={<GraduationCap className="h-5 w-5" />} label="Ofertas" onClick={() => setSidebarOpen(false)} />
                  <SidebarLink href="/publicacion" icon={<Handshake className="h-5 w-5" />} label="Comunidad" onClick={() => setSidebarOpen(false)} />
                  <SidebarLink href="/messages" icon={<MessageSquareIcon className="h-5 w-5" />} label="Mensajes" onClick={() => setSidebarOpen(false)} />
                </>
              ) : (
                <>
                  <SidebarLink href="/search" icon={<GraduationCap className="h-5 w-5" />} label="Ofertas" onClick={() => setSidebarOpen(false)} />
                  <SidebarLink href="/publicacion" icon={<Handshake className="h-5 w-5" />} label="Comunidad" onClick={() => setSidebarOpen(false)} />
                </>
              )}
            </nav>
          </div>

          {loggedIn && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Mi cuenta</h3>
              <nav className="flex flex-col space-y-3">
                {userData?.rol !== "company" && userData?.rol !== "institutions" && (
                  <SidebarLink
                    href={`/profile/student/${userData?.student?.uuid}`}
                    icon={<User className="h-5 w-5" />}
                    label="Mi perfil"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {userData?.rol === "company" && (
                  <SidebarLink
                    href={`/profile/company/${userData?.company?.slug}`}
                    icon={<Building2Icon className="h-5 w-5" />}
                    label="Mi compañía"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {userData?.rol === "institutions" && (
                  <SidebarLink
                    href={`/profile/institution/${userData?.institution?.slug}`}
                    icon={<LandmarkIcon className="h-5 w-5" />}
                    label="Mi institución"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                {userData?.rol === "admin" && (
                  <SidebarLink
                    href="/admin"
                    icon={<FileEdit className="h-5 w-5" />}
                    label="Panel de administrador"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                <SidebarLink
                  href="/profile/settings"
                  icon={<Bolt className="h-5 w-5" />}
                  label="Configuración"
                  onClick={() => setSidebarOpen(false)}
                />
              </nav>
            </div>
          )}

          {!loggedIn ? (
            <div className="space-y-2 pt-4">
              <Button className="w-full" asChild>
                <Link href="/auth/login" onClick={() => setSidebarOpen(false)}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/register" onClick={() => setSidebarOpen(false)}>
                  Registrarse
                </Link>
              </Button>
            </div>
          ) : (
            <button
              className="w-full mt-8 flex items-center justify-center space-x-2 text-red-600 rounded-md p-2 hover:bg-red-50"
              onClick={() => {
                logout();
                setSidebarOpen(false);
                socket.emit("logout");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="w-5 h-5"
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
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

// Desktop nav item
function NavLink({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center ${active ? "text-foreground" : "text-muted-foreground"
        }`}
    >
      {icon}
      <span className="text-[12px]">{label}</span>
    </Link>
  );
}

// Sidebar link with icon
function SidebarLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 p-2 rounded-md transition-colors
        ${isActive
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

// ProfileDropdown para el avatar y sus opciones
function ProfileDropdown({ userData, logout }: { userData: any; logout: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
            "default.jpg"
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
          {userData?.rol == "student" && (
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

          {/* Opción "My Company" */}
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

          {/* Opción "My Institution" */}
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

          {/* Opción "Admin Panel" */}
          {userData?.rol === "admin" && (
            <li
              role="menuitem"
              className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100"
              onClick={() => {
                setIsOpen(false);
                router.push(`/admin`);
              }}
            >
              <FileEdit className="w-5 h-5 text-slate-400" />
              <Link href={`/admin`} className="ml-2">
                <p className="font-medium">Panel de administrador</p>
              </Link>
            </li>
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
            <p className="font-medium ml-2">Cerrar sesión</p>
          </li>
        </ul>
      )}
    </div>
  );
}