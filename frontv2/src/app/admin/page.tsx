"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoaderComponent } from "@/components/ui/loader-layout";
import { useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAdminAuth();
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const handleRedirectToReports = () => {
    showLoader();
    router.push("/admin/reported-users"); // Asegúrate de incluir el "/" inicial
  };
  const handleRedirectToCompanies = () => {
    showLoader();
    router.push("/admin/companies"); // Asegúrate de incluir el "/" inicial
  };
  const handleRedirectToInstitutes = () => {
    showLoader();
    router.push("/admin/school");
  };
  const handleRedirectToUsers = () => {
    showLoader();
    router.push("/admin/estudents");
  };
  const handleRedirectToOffers = () => {
    showLoader();
    router.push("/admin/offers");
  };

  const handleRedirectToQuestions = () => {
    showLoader();
    router.push("/admin/questions");
  };


  if (isLoading) {
    return (
      <LoaderComponent />
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acceso no autorizado</h2>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-10 text-center">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card: Gestionar Usuarios */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Estudiantes</h2>
          <p className="text-gray-500 mb-6">Ver, editar o eliminar usuarios registrados en el sistema.</p>
          <Button variant="default" className="mt-auto w-full" onClick={handleRedirectToUsers}>Ir a Usuarios</Button>
        </div>

        {/* Card: Gestionar Empresas */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Empresas</h2>
          <p className="text-gray-500 mb-6">Administrar información de las empresas registradas.</p>
          <Button
            variant="default"
            className="mt-auto w-full"
            onClick={handleRedirectToCompanies}
          >
            Ir a Empresas
          </Button>
        </div>

        {/* Card: Gestionar Institutos */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Institutos</h2>
          <p className="text-gray-500 mb-6">Administrar información de los institutos registrados.</p>
          <Button
            variant="default"
            className="mt-auto w-full"
            onClick={handleRedirectToInstitutes}
          >
            Ir a Institutos
          </Button>
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

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Ofertas</h2>
          <p className="text-gray-500 mb-6">Administrar todas las ofertas publicadas en el sistema.</p>
          <Button
            variant="default"
            className="mt-auto w-full"
            onClick={handleRedirectToOffers}
          >
            Ir a Ofertas
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-3">Gestionar Preguntas</h2>
          <p className="text-gray-500 mb-6">Administrar todas las preguntas publicadas en el sistema.</p>
          <Button
            variant="default"
            className="mt-auto w-full"
            onClick={handleRedirectToQuestions}
          >
            Ir a Preguntas
          </Button>
        </div>
      </div>
    </div>
  );
}