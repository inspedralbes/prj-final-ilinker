'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import config from '@/types/config';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trash2, Edit, Ban, CheckCircle2, Eye, Power, Calendar, MapPin, Globe, Phone, Mail, RefreshCw, LayoutDashboard } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useContext } from 'react';
import { LoaderContext } from '@/contexts/LoaderContext';

interface Institution {
  id: number;
  name: string;
  slug: string;
  NIF: string;
  type: string;
  email: string;
  phone: string;
  website: string;
  responsible_name: string;
  responsible_email: string;
  responsible_phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  founded_year: string;
  languages: string[];
  specialties: string[];
  courses_count?: number;
  active: boolean;
  user: {
    email: string;
    active: boolean;
  };
}

export default function InstitutionsPage() {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();
  const { isAdmin } = useAdminAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [viewInstitution, setViewInstitution] = useState<Institution | null>(null);
  const [editData, setEditData] = useState<Partial<Institution>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInstitutions = async () => {
    showLoader();
    setLoading(true);
    try {
      const data = await apiRequest('admin/institutions', 'GET');

      if (data.success) {
        setInstitutions(data.data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar instituciones');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar instituciones');
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    showLoader();
    setIsSaving(true);
    try {
      const allowedFields = [
        'name', 'NIF', 'type', 'email', 'phone', 'website', 'responsible_name',
        'responsible_email', 'responsible_phone', 'address', 'city', 'country',
        'postal_code', 'founded_year', 'languages', 'specialties', 'active'
      ];

      const dataToSend: Record<string, any> = {};
      allowedFields.forEach(field => {
        if (field in editData && editData[field as keyof Institution] !== undefined) {
          dataToSend[field] = editData[field as keyof Institution];
        }
      });

      const data = await apiRequest(`admin/institutions/${id}`, 'PUT', dataToSend);

      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar institución');
      }

      toast.success('Institución actualizada correctamente');
      setSelectedInstitution(null);
      fetchInstitutions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar institución');
    } finally {
      hideLoader();
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    showLoader();
    try {
      const data = await apiRequest(`admin/institutions/${id}/status`, 'PUT', { active: !currentStatus });

      if (data.success) {
        toast.success(`Institución ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
        fetchInstitutions();
      } else {
        throw new Error(data.message || 'Error al cambiar estado');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
    } finally {
      hideLoader();
    }
  };

  const deleteInstitution = async (id: number) => {
    if (!confirm('¿Eliminar esta institución y todos sus datos asociados?')) return;

    setIsDeleting(true);
    try {
      const data = await apiRequest(`admin/institutions/${id}`, 'DELETE');

      if (data.success) {
        toast.success('Institución eliminada correctamente');
        fetchInstitutions();
      } else {
        throw new Error(data.message || 'Error al eliminar institución');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar institución');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (selectedInstitution) {
      setEditData({
        ...selectedInstitution,
        languages: selectedInstitution.languages || [],
        specialties: selectedInstitution.specialties || []
      });
    }
  }, [selectedInstitution]);

  const filteredInstitutions = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.NIF.toLowerCase().includes(search.toLowerCase()) ||
    i.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acceso no autorizado</h2>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  if (loading && institutions.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Instituciones</h1>
          <p className="text-sm text-muted-foreground">
            {institutions.length} instituciones registradas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por nombre, documento o email..."
            className="w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchInstitutions} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refrescar</span>
          </Button>
          <Button onClick={() => window.location.href = "/admin"} className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Panel de admin</span>
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredInstitutions.length > 0 ? (
          filteredInstitutions.map((institution) => (
            <Card key={institution.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {/* Eye button in top right corner */}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setViewInstitution(institution)}
                  className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              <CardHeader className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ID: {institution.id}</span>
                    <Badge className="mr-5" variant={institution.user?.active ? 'default' : 'destructive'}>
                      {institution.user?.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{institution.name}</h3>
                    <p className="text-sm text-gray-600">{institution.type}</p>
                    {institution.NIF && (
                      <p className="text-sm text-gray-500">NIF: {institution.NIF}</p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{institution.user?.email}</span>
                  </div>

                  {institution.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{institution.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">No disponible</span>
                    </div>
                  )}

                  {institution.website ? (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400" />
                      <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate">{institution.website}</a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-blue-600 truncate">No disponible</span>
                    </div>
                  )}

                  {(institution.city || institution.country) ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {[institution.city, institution.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">No disponible</span>
                    </div>
                  )}

                  {institution.founded_year ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">Fundada en {institution.founded_year}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">No disponible</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  <p>Cursos: {institution.courses_count || 0}</p>
                  {institution.languages && institution.languages.length > 0 ? (
                    <p>Idiomas: {institution.languages.join(', ')}</p>
                  ) : (
                    <p>Idiomas: No disponible</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedInstitution(institution);
                    setEditData({ ...institution });
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant={institution.user?.active ? 'destructive' : 'default'}
                  onClick={() => toggleStatus(institution.id, institution.user?.active)}
                >
                  <Power className="h-3 w-3 mr-1" />
                  {institution.user?.active ? 'Desactivar' : 'Activar'}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                {search ? 'No se encontraron instituciones con ese criterio' : 'No hay instituciones registradas'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Visualización */}
      {viewInstitution && (
        <Dialog open={!!viewInstitution} onOpenChange={() => setViewInstitution(null)}>
          <DialogContent className="sm:max-w-[800px] max-w-[400px] max-h-[70vh] sm:max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{viewInstitution.name}</span>
                <Badge className="mr-5" variant={viewInstitution.user?.active ? 'default' : 'destructive'}>
                  {viewInstitution.user?.active ? 'Activa' : 'Inactiva'}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                ID: {viewInstitution.id} | Tipo: {viewInstitution.type} | Email: {viewInstitution.user?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Información básica */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                    <p className="mt-1">{viewInstitution.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">NIF</Label>
                    <p className="mt-1">{viewInstitution.NIF || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Tipo</Label>
                    <p className="mt-1">{viewInstitution.type || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Año de fundación</Label>
                    {viewInstitution.founded_year ? (
                      <p className="mt-1">{viewInstitution.founded_year}</p>
                    ) : (
                      <p className="mt-1 text-gray-500 text-sm">No especificado</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    {viewInstitution.email ? (
                      <a
                        href={`mailto:${viewInstitution.email}`}
                        className="text-blue-600 hover:underline text-sm truncate block"
                        style={{ maxWidth: '100%' }}
                        title={viewInstitution.email}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {viewInstitution.email}
                      </a>
                    ) : (
                      <p className="mt-1 text-gray-500 text-sm">No hay email</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
                    {viewInstitution.phone ? (
                      <p className="mt-1">{viewInstitution.phone}</p>
                    ) : (
                      <p className="mt-1 text-gray-500 text-sm">No hay teléfono</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Website</Label>
                    {viewInstitution.website ? (
                      <a
                        href={viewInstitution.website}
                        className="text-blue-600 hover:underline text-sm truncate block"
                        style={{ maxWidth: '100%' }}
                        title={viewInstitution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {viewInstitution.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">No hay red vinculada</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Cursos</Label>
                    <p className="mt-1">{viewInstitution.courses_count || 0}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Slug</Label>
                    <p className="mt-1">{viewInstitution.slug || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Información del responsable */}
              {(viewInstitution.responsible_name || viewInstitution.responsible_email || viewInstitution.responsible_phone) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Información del Responsable</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Nombre</Label>
                      {viewInstitution.responsible_name ? (
                        <p className="mt-1">{viewInstitution.responsible_name}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay nombre del responsable</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      {viewInstitution.responsible_email ? (
                        <a
                          href={`mailto:${viewInstitution.responsible_email}`}
                          className="text-blue-600 hover:underline text-sm truncate block"
                          style={{ maxWidth: '100%' }}
                          title={viewInstitution.responsible_email}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {viewInstitution.responsible_email}
                        </a>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay email del responsable</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
                      {viewInstitution.responsible_phone ? (
                        <p className="mt-1">{viewInstitution.responsible_phone}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay teléfono del responsable</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dirección */}
              {(viewInstitution.address || viewInstitution.city || viewInstitution.postal_code || viewInstitution.country) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dirección</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Dirección</Label>
                      {viewInstitution.address ? (
                        <p className="mt-1">{viewInstitution.address}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay dirección</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ciudad</Label>
                      {viewInstitution.city ? (
                        <p className="mt-1">{viewInstitution.city}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay ciudad</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Código Postal</Label>
                      {viewInstitution.postal_code ? (
                        <p className="mt-1">{viewInstitution.postal_code}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay código postal</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">País</Label>
                      {viewInstitution.country ? (
                        <p className="mt-1">{viewInstitution.country}</p>
                      ) : (
                        <p className="mt-1 text-gray-500 text-sm">No hay país</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Idiomas y especialidades */}
              {((viewInstitution.languages && viewInstitution.languages.length > 0) ||
                (viewInstitution.specialties && viewInstitution.specialties.length > 0)) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Idiomas y Especialidades</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {viewInstitution.languages && viewInstitution.languages.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Idiomas</Label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {viewInstitution.languages.map((lang, index) => (
                              <Badge key={index} variant="default">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {viewInstitution.specialties && viewInstitution.specialties.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Especialidades</Label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {viewInstitution.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="default" onClick={() => setViewInstitution(null)}>
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Edición */}
      {selectedInstitution && (
        <Dialog open={!!selectedInstitution} onOpenChange={() => setSelectedInstitution(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Institución</DialogTitle>
              <DialogDescription>
                ID: {selectedInstitution.id} | Email: {selectedInstitution.user?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="NIF">NIF</Label>
                  <Input
                    id="NIF"
                    value={editData.NIF || ''}
                    onChange={(e) => setEditData({ ...editData, NIF: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Input
                    id="type"
                    value={editData.type || ''}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={editData.website || ''}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsible_name">Responsable</Label>
                  <Input
                    id="responsible_name"
                    value={editData.responsible_name || ''}
                    onChange={(e) => setEditData({ ...editData, responsible_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsible_email">Email Responsable</Label>
                  <Input
                    id="responsible_email"
                    type="email"
                    value={editData.responsible_email || ''}
                    onChange={(e) => setEditData({ ...editData, responsible_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={editData.address || ''}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={editData.city || ''}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    value={editData.postal_code || ''}
                    onChange={(e) => setEditData({ ...editData, postal_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded_year">Año Fundación</Label>
                <Input
                  id="founded_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={editData.founded_year || ''}
                  onChange={(e) => setEditData({ ...editData, founded_year: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => deleteInstitution(selectedInstitution.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Eliminar</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedInstitution(null)}
                >
                  Cancelar
                </Button>

                <Button
                  onClick={() => handleUpdate(selectedInstitution.id)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Guardar</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}