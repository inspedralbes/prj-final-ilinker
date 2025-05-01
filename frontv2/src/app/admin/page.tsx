"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();
  const handleRedirectToReports = () => {
    router.push("/admin/reported-users"); // Asegúrate de incluir el "/" inicial
  };


  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-10 text-center">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card: Gestionar Usuarios */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Usuarios</h2>
          <p className="text-gray-500 mb-6">Ver, editar o eliminar usuarios registrados en el sistema.</p>
          <Button variant="default" className="mt-auto w-full">Ir a Usuarios</Button>
        </div>

        {/* Card: Gestionar Empresas */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Empresas</h2>
          <p className="text-gray-500 mb-6">Administrar información de las empresas registradas.</p>
          <Button variant="default" className="mt-auto w-full">Ir a Empresas</Button>
        </div>

        {/* Card: Reportes y Análisis */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Reportes y Análisis</h2>
          <p className="text-gray-500 mb-6">Visualizar estadísticas y reportes de actividad.</p>
          <Button
            variant="default"
            className="mt-auto w-full"
            onClick={handleRedirectToReports}
          >
            Ver Reportes
          </Button>
        </div>
      </div>
    </div>
  );
}
