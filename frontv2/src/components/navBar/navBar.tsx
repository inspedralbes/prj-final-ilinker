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
  X
} from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";

export default function NavBar() {
  const pathname = usePathname();
  const { loggedIn, userData, logout } = useContext(AuthContext);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (pathname === "/") return null;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.svg" alt="logo" width={35} height={35} />
              <span className="font-bold">iLinker</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-2 items-center justify-between space-x-6">
            <div className="flex items-center space-x-6">
              {loggedIn ? (
                <>
                  <NavLink href="/search" icon={<GraduationCap />} label="Ofertas" active={pathname === "/search"} />
                  <NavLink href="/publicacion" icon={<Building2Icon />} label="Publicaciones" active={pathname === "/publicacion"} />
                  <NavLink href="/messages" icon={<MessageSquareIcon />} label="Mensajes" active={pathname === "/messages"} />
                  <NavLink href="/notifications" icon={<Bell />} label="Notificaciones" active={pathname === "/notifications"} />
                </>
              ) : (
                <>
                  <NavLink href="/search" icon={<Building2Icon />} label="Empresas" active={pathname === "/search"} />
                  <NavLink href="/people" icon={<User />} label="Personas" active={pathname === "/people"} />
                  <NavLink href="/institutions" icon={<LandmarkIcon />} label="Institutos" active={pathname === "/institutions"} />
                </>
              )}
            </div>
            {loggedIn ? (
              <ProfileDropdown userData={userData} logout={logout} />
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {loggedIn && <ProfileDropdown userData={userData} logout={logout} />}
            <button onClick={() => setDrawerOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer (right side) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">Menú</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <nav className="space-y-2">
            {loggedIn ? (
              <>
                <MobileLink href="/search" label="Ofertas" onClick={() => setDrawerOpen(false)} />
                <MobileLink href="/messages" label="Mensajes" onClick={() => setDrawerOpen(false)} />
                <MobileLink href="/notifications" label="Notificaciones" onClick={() => setDrawerOpen(false)} />
              </>
            ) : (
              <>
                <MobileLink href="/search" label="Empresas" onClick={() => setDrawerOpen(false)} />
                <MobileLink href="/people" label="Personas" onClick={() => setDrawerOpen(false)} />
                <MobileLink href="/institutions" label="Instituciones" onClick={() => setDrawerOpen(false)} />
              </>
            )}
          </nav>
          {!loggedIn && (
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/auth/login" onClick={() => setDrawerOpen(false)}>
                  Iniciar sesión
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/register" onClick={() => setDrawerOpen(false)}>
                  Registrarse
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setDrawerOpen(false)}
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
      className={`flex flex-col items-center ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[12px]">{label}</span>
    </Link>
  );
}

// Mobile drawer link
function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full text-left text-sm font-medium text-gray-800 hover:text-black"
    >
      {label}
    </Link>
  );
}

// Reutilizamos tu ProfileDropdown
function ProfileDropdown({ userData, logout }: { userData: any; logout: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

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
    <div className="relative" ref={dropdownRef}>
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
          className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          <DropdownItem label="Mi perfil" onClick={() => router.push(`/profile/student/${userData.slug}`)} />
          {userData?.rol === "institutions" && (
            <DropdownItem label="Mi institución" onClick={() => router.push(`/profile/institution/${userData.institutions.slug}`)} />
          )}
          {userData?.rol === "company" && (
            <DropdownItem label="Mi compañía" onClick={() => router.push(`/profile/company/${userData.company.slug}`)} />
          )}
          {userData?.rol === "admin" && (
            <DropdownItem label="Panel de administrador" onClick={() => router.push(`/admin`)} />
          )}
          <DropdownItem label="Ayuda" onClick={() => router.push(`/help`)} />
          <hr className="my-2 border-slate-200" />
          <li
            className="cursor-pointer text-red-600 px-3 py-2 text-sm hover:bg-gray-100 rounded"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            Cerrar sesión
          </li>
        </ul>
      )}
    </div>
  );
}

function DropdownItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li
      className="cursor-pointer text-slate-800 px-3 py-2 text-sm hover:bg-gray-100 rounded"
      onClick={onClick}
    >
      {label}
    </li>
  );
}
