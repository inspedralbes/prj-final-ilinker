'use client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import config from '@/types/config';
import { apiRequest } from '@/services/requests/apiRequest';
import { Eye, Trash2, UserX, AlertTriangle, User, Mail, Calendar, Shield, Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewReport, setViewReport] = useState<Report | null>(null);

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
        await apiRequest(`admin/reported-users/${reportId}`, 'DELETE');
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
        await apiRequest(`admin/delete-user/${userId}`, 'DELETE');
        setReports(reports.filter(report => report.reported_user.id !== userId));
        alert('Usuario eliminado permanentemente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('No se pudo eliminar al usuario');
      }
    }
  };

  const handleBanUser = async (userId: number, reportedUser: User) => {
    const action = reportedUser.active === 1 ? 'banear' : 'desbanear';
    if (confirm(`¿Estás seguro de ${action} a este usuario?`)) {
      try {
        const endpoint = reportedUser.active === 1 ? `admin/ban-user/${userId}` : `admin/unban-user/${userId}`;
        await apiRequest(endpoint, 'POST');

        setReports(reports.map(report => {
          if (report.reported_user.id === userId) {
            return {
              ...report,
              reported_user: {
                ...report.reported_user,
                active: reportedUser.active === 1 ? 0 : 1,
              }
            };
          }
          return report;
        }));

        alert(`Usuario ${action === 'banear' ? 'baneado' : 'desbaneado'} correctamente`);
      } catch (error) {
        console.error(`Error al ${action} usuario:`, error);
        alert(`No se pudo ${action} al usuario`);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'empresa':
        return 'bg-blue-100 text-blue-800';
      case 'institucion':
        return 'bg-green-100 text-green-800';
      case 'estudiante':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter(report =>
    report.reported_user.name.toLowerCase().includes(search.toLowerCase()) ||
    report.reported_user.surname.toLowerCase().includes(search.toLowerCase()) ||
    report.reported_user.email.toLowerCase().includes(search.toLowerCase()) ||
    report.reporter.name.toLowerCase().includes(search.toLowerCase()) ||
    report.reporter.surname.toLowerCase().includes(search.toLowerCase()) ||
    report.reason.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Usuarios Reportados</h1>
            <p className="text-sm text-muted-foreground">
              {reports.length} reportes registrados
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar reportes..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button onClick={() => router.push("/admin")} className="w-full sm:w-auto">
            Ir al panel de admin
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? 'No se encontraron reportes con ese criterio' : 'No hay reportes disponibles'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {/* Eye button in top right corner */}
              <div className="absolute top-2 right-2 flex gap-1 pt-2 pr-2">
                <button
                  onClick={() => setViewReport(report)}
                  className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
              </div>


              <CardHeader className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pr-8">
                    <span className="text-xs text-gray-500">ID: {report.id}</span>
                    <Badge
                      variant={report.reported_user.active === 1 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {report.reported_user.active === 1 ? 'Activo' : 'Baneado'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {report.reported_user.name} {report.reported_user.surname}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{report.reported_user.email}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <Badge className={`text-xs ${getRoleBadgeColor(report.reported_user.rol)}`}>
                    {report.reported_user.rol}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Motivo del reporte:</Label>
                  <p className="text-sm text-gray-700 line-clamp-2">{report.reason}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-500">Reportado por:</Label>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {report.reporter.name} {report.reporter.surname}
                    </span>
                  </div>
                </div>

                {report.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(report.created_at)}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 flex flex-col gap-2">
                <div className="flex justify-between w-full gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteReport(report.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar Reporte
                  </Button>
                </div>

                <div className="flex justify-between w-full gap-2">
                  <Button
                    size="sm"
                    variant={report.reported_user.active === 1 ? 'destructive' : 'default'}
                    onClick={() => handleBanUser(report.reported_user.id, report.reported_user)}
                    className="flex-1"
                  >
                    <UserX className="h-3 w-3 mr-1" />
                    {report.reported_user.active === 1 ? 'Banear' : 'Desbanear'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(report.reported_user.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar Usuario
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Visualización */}
      {viewReport && (
        <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
          <DialogContent className="sm:max-w-[700px] max-w-[90vw] max-h-[70vh] sm:max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Reporte #{viewReport.id}</span>
                <Badge
                  className="mr-5"
                  variant={viewReport.reported_user.active === 1 ? 'default' : 'destructive'}
                >
                  {viewReport.reported_user.active === 1 ? 'Usuario Activo' : 'Usuario Baneado'}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Reporte generado el {formatDate(viewReport.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Usuario Reportado */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-700">Usuario Reportado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre completo</Label>
                    <p className="mt-1 font-medium">{viewReport.reported_user.name} {viewReport.reported_user.surname}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ID</Label>
                    <p className="mt-1">{viewReport.reported_user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="mt-1">{viewReport.reported_user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Rol</Label>
                    <Badge className={`mt-1 ml-2 ${getRoleBadgeColor(viewReport.reported_user.rol)}`}>
                      {viewReport.reported_user.rol}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Estado</Label>
                    <Badge
                      variant={viewReport.reported_user.active === 1 ? 'default' : 'destructive'}
                      className="mt-1 ml-2"
                    >
                      {viewReport.reported_user.active === 1 ? 'Activo' : 'Baneado'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Usuario que Reporta */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-700">Usuario que Reporta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre completo</Label>
                    <p className="mt-1 font-medium">{viewReport.reporter.name} {viewReport.reporter.surname}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">ID</Label>
                    <p className="mt-1">{viewReport.reporter.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="mt-1">{viewReport.reporter.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Rol</Label>
                    <Badge className={`mt-1 ${getRoleBadgeColor(viewReport.reporter.rol)}`}>
                      {viewReport.reporter.rol}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Detalles del Reporte */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Detalles del Reporte</h3>
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Motivo del reporte</Label>
                    <p className="mt-1 p-3 bg-white rounded border">{viewReport.reason}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Fecha de creación</Label>
                      <p className="mt-1">{formatDate(viewReport.created_at)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Última actualización</Label>
                      <p className="mt-1">{formatDate(viewReport.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 mt-6 space-y-2 sm:space-y-0">
              {/* Primera fila (dos botones) */}
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Button variant="outline" onClick={() => setViewReport(null)}>
                  Cerrar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewReport(null);
                    handleDeleteReport(viewReport.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar Reporte
                </Button>
              </div>

              {/* Segunda fila (un botón) */}
              <div>
                <Button
                  className="w-full sm:w-auto"
                  variant={viewReport.reported_user.active === 1 ? 'destructive' : 'default'}
                  onClick={() => {
                    setViewReport(null);
                    handleBanUser(viewReport.reported_user.id, viewReport.reported_user);
                  }}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  {viewReport.reported_user.active === 1 ? 'Banear Usuario' : 'Desbanear Usuario'}
                </Button>
              </div>
            </div>

          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}