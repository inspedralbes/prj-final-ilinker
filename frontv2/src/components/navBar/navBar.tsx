"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Building2Icon,
  GraduationCap,
  LandmarkIcon,
  Menu,
  MessageSquareIcon,
  User,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import config from "@/types/config";

interface UserData {
  rol: string;
  slug: string;
  photo_pic?: string;
  student?: { photo_pic?: string };
  company?: { slug: string; logo?: string };
}

export default function NavBar() {
  const pathname = usePathname();
  const { loggedIn, userData, logout } = useContext(AuthContext);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cierra con Esc
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between h-14">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.svg" alt="logo" width={35} height={35} />
            <span className="font-bold">iLinker</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {loggedIn ? (
              <>
                <LinkNav href="/search" label="Ofertas" Icon={GraduationCap} active={pathname === "/search"} />
                <LinkNav href="/messages" label="Mensajes" Icon={MessageSquareIcon} active={pathname === "/messages"} />
                <LinkNav href="/notifications" label="Notificaciones" Icon={Bell} active={pathname === "/notifications"} />
                {userData?.rol === "admin" && (
                  <LinkNav href="/admin" label="Admin" Icon={ShieldCheck} active={pathname === "/admin"} />
                )}
              </>
            ) : (
              <>
                <LinkNav href="/search" label="Empresas" Icon={Building2Icon} active={pathname === "/search"} />
                <LinkNav href="/people" label="Personas" Icon={User} active={pathname === "/people"} />
                <LinkNav href="/institutions" label="Institutos" Icon={LandmarkIcon} active={pathname === "/institutions"} />
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
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Side drawer menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            {loggedIn ? (
              <>
                <LinkNav href="/search" label="Ofertas" Icon={GraduationCap} active={pathname === "/search"} />
                <LinkNav href="/messages" label="Mensajes" Icon={MessageSquareIcon} active={pathname === "/messages"} />
                <LinkNav href="/notifications" label="Notificaciones" Icon={Bell} active={pathname === "/notifications"} />
                {userData?.rol === "admin" && (
                  <LinkNav href="/admin" label="Admin" Icon={ShieldCheck} active={pathname === "/admin"} />
                )}
              </>
            ) : (
              <>
                <LinkNav href="/search" label="Empresas" Icon={Building2Icon} active={pathname === "/search"} />
                <LinkNav href="/people" label="Personas" Icon={User} active={pathname === "/people"} />
                <LinkNav href="/institutions" label="Institutos" Icon={LandmarkIcon} active={pathname === "/institutions"} />
              </>
            )}
          </nav>

          <div className="pt-4 border-t space-y-2">
            {loggedIn ? (
              <ProfileDropdown userData={userData} logout={() => { logout(); setMobileMenuOpen(false); }} />
            ) : (
              <>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface LinkNavProps {
  href: string;
  label: string;
  Icon: React.ElementType;
  active: boolean;
}

function LinkNav({ href, label, Icon, active }: LinkNavProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 text-sm ${
        active ? "text-foreground font-semibold" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

interface ProfileDropdownProps {
  userData: UserData;
  logout: () => void;
}

function ProfileDropdown({ userData, logout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const imageSrc =
    config.storageUrl +
      (userData?.company?.logo || userData?.student?.photo_pic || "") ||
    "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png";

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={imageSrc}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-sm cursor-pointer"
        />
      </div>
      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[180px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          <li
            role="menuitem"
            className="cursor-pointer text-slate-800 flex text-sm items-center rounded-md p-3 hover:bg-slate-100"
            onClick={() => {
              setIsOpen(false);
              router.push(`/profile/student/${userData.slug}`);
            }}
          >
            <User className="w-5 h-5 text-slate-400" />
            <span className="ml-2">Mi perfil</span>
          </li>
          {userData?.rol === "company" && (
            <li
              role="menuitem"
              className="cursor-pointer text-slate-800 flex text-sm items-center rounded-md p-3 hover:bg-slate-100"
              onClick={() => {
                setIsOpen(false);
                router.push(`/profile/company/${userData.company?.slug}`);
              }}
            >
              <Building2Icon className="w-5 h-5 text-slate-400" />
              <span className="ml-2">Mi compañia</span>
            </li>
          )}
          <hr className="my-2 border-slate-200" />
          <li
            role="menuitem"
            className="cursor-pointer text-slate-800 flex text-sm items-center rounded-md p-3 hover:bg-slate-100"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <X className="w-5 h-5 text-slate-400" />
            <span className="ml-2">Cerrar sesión</span>
          </li>
        </ul>
      )}
    </div>
  );
}
