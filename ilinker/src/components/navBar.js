"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useNavBar from "../hooks/useNavBar";

export default function NavBar() {
  const { user, loading, error } = useNavBar(); // Importa el hook personalizado
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Buscador */}
          <div className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="iLinker logo"
              width={30}
              height={30}
              className="mr-4"
            />
            <input
              type="text"
              placeholder="Buscar"
              className="hidden md:block w-60 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {/* Menú principal (Desktop) */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <i className="bi bi-house-door mr-2"></i> Inicio
            </Link>
            <Link
              href="/network"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <i className="bi bi-people mr-2"></i> Mi red{" "}
              <span className="ml-1 text-red-500">(2)</span>
            </Link>
            <Link
              href="/jobs"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <i className="bi bi-briefcase mr-2"></i> Empleos
            </Link>
          </div>

          {/* Sección "Yo" */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none"
            >
              <Image
                src={user?.avatar || "/user-avatar.jpg"}
                alt="User avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              <span className="ml-2">{user?.name || "Yo"}</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Menú desplegable */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-md rounded-md py-2 z-50">
                <div className="px-4 py-3 border-b dark:border-gray-700">
                  <p className="font-semibold">
                    {user?.name} {user?.surname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.rol === "student"
                      ? "Estudiante"
                      : user?.rol === "company"
                      ? "Empresa"
                      : "Institución"}
                  </p>
                  <button className="mt-2 w-full bg-blue-500 text-white text-sm py-1 rounded-md hover:bg-blue-600">
                    Ver perfil
                  </button>
                </div>
                <div className="px-4 py-2">
                  <Link href="/settings" className="block py-1 hover:text-blue-500">
                    Ajustes y privacidad
                  </Link>
                  <Link href="/help" className="block py-1 hover:text-blue-500">
                    Ayuda
                  </Link>
                </div>
                <div className="px-4 py-2 border-t dark:border-gray-700">
                  <Link
                    href="/logout"
                    className="block py-1 text-red-500 hover:underline"
                  >
                    Cerrar sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
