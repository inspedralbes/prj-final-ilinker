'use client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import config from '@/types/config';
import { apiRequest } from '@/services/requests/apiRequest';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  rol: string;
  photo_pic: string | null;
  active: number;
}

interface Report {
  id: number;
  reason: string;
  created_at: string | null;
  updated_at: string | null;
  reported_user_id: number;
  reported_by_id: number;
  reporter: User;
  reported_user: User & { active: number };
}

export default function ReportedUsersPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      const data = await apiRequest(`admin/reported-users`);
      if (!Array.isArray(data)) throw new Error('Formato de datos inválido');

      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (confirm('¿Estás seguro de eliminar este reporte?')) {
      try {
        await apiRequest(`admin/reported-users/${reportId}`, 'DELETE',);

        setReports(reports.filter(report => report.id !== reportId));
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el reporte');
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('¿ESTÁS SEGURO DE ELIMINAR PERMANENTEMENTE ESTE USUARIO?\n\nEsta acción no se puede deshacer.')) {
      try {
        await apiRequest(`$admin/delete-user/${userId}`, 'DELETE',);

        setReports(reports.filter(report => report.reported_user.id !== userId));
        alert('Usuario eliminado permanentemente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('No se pudo eliminar al usuario');
      }
    }
  };

  const handleBanUser = async (userId: number) => {
    if (confirm('¿Estás seguro de banear a este usuario?')) {
      try {
        await apiRequest(`admin/ban-user/${userId}`, 'POST',);

        setReports(reports.map(report => {
          if (report.reported_user.id === userId) {
            return {
              ...report,
              reported_user: {
                ...report.reported_user,
                active: 0,
              }
            };
          }
          return report;
        }));

        alert('Usuario baneado correctamente');
      } catch (error) {
        console.error('Error al banear usuario:', error);
        alert('No se pudo banear al usuario');
      }
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Usuarios Reportados</h1>
          <Button
            onClick={() => window.location.href = "/admin"}
            className="w-full sm:w-auto"
          >
            Ir al panel de admin
          </Button>
        </div>


        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            No hay reportes disponibles
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Usuario Reportado</th>
                  <th className="p-4 text-left">Reportado Por</th>
                  <th className="p-4 text-left">Rol</th>
                  <th className="p-4 text-left">Motivo</th>
                  <th className="p-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{report.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {report.reported_user.name} {report.reported_user.surname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {report.reported_user.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {report.reporter.name} {report.reporter.surname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {report.reporter.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${report.reported_user.rol === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {report.reported_user.rol}
                      </span>
                    </td>
                    <td className="p-4">{report.reason}</td>
                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteReport(report.id)}
                            className="flex-1"
                          >
                            Eliminar Reporte
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-rose-800 text-white hover:bg-rose-900"
                          onClick={() => handleDeleteUser(report.reported_user.id)}
                        >
                          Eliminar Usuario
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}