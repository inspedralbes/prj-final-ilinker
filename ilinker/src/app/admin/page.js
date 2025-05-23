"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { userData, loggedIn } = useContext(AuthContext);
  const router = useRouter();


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid gap-4">
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Gestionar Usuarios</h2>
          <p className="text-muted-foreground mb-4">Ver, editar o eliminar usuarios.</p>
          <Button variant="default">Ir a Usuarios</Button>
        </div>
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Gestionar Empresas</h2>
          <p className="text-muted-foreground mb-4">Administrar las empresas registradas.</p>
          <Button variant="default">Ir a Empresas</Button>
        </div>
        <div className="border p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Reportes y Análisis</h2>
          <p className="text-muted-foreground mb-4">Ver estadísticas de la plataforma.</p>
          <Button variant="default">Ver Reportes</Button>
        </div>
      </div>
    </div>
  );
}
