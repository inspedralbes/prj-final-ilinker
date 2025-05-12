'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import config from '@/types/config';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trash2, Edit, Ban, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';


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
  const router = useRouter();
  const { isAdmin } = useAdminAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [editData, setEditData] = useState<Partial<Institution>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInstitutions = async () => {
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
      setLoading(false);
    }
  };


  const handleUpdate = async (id: number) => {
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

      const data = await apiRequest(`admin/institutions/${id}`, 'PUT', dataToSend,);

      if (!data.success) {
        throw new Error(data.message || 'Error al actualizar institución');
      }

      toast.success('Institución actualizada correctamente');
      setSelectedInstitution(null);
      fetchInstitutions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar institución');
    } finally {
      setIsSaving(false);
    }
  };


  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const data = await apiRequest(`admin/institutions/${id}/status`, 'PUT', { active: !currentStatus },);

      if (data.success) {
        toast.success(`Institución ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
        fetchInstitutions();
      } else {
        throw new Error(data.message || 'Error al cambiar estado');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
    }
  };


  const deleteInstitution = async (id: number) => {
    if (!confirm('¿Eliminar esta institución y todos sus datos asociados?')) return;

    setIsDeleting(true);
    try {
      const data = await apiRequest(`admin/institutions/${id}`, 'DELETE',);

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
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Instituciones</h1>
          <p className="text-sm text-muted-foreground">
            {institutions.length} instituciones registradas
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar instituciones..."
            className="pl-9 w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Institución</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((institution) => (
                <TableRow key={institution.id}>
                  <TableCell>{institution.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{institution.name}</div>
                    <div className="text-sm text-muted-foreground">{institution.type}</div>
                  </TableCell>
                  <TableCell>{institution.NIF}</TableCell>
                  <TableCell>
                    <div>{institution.user?.email}</div>
                    <div className="text-sm text-muted-foreground">{institution.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={institution.user?.active ? 'default' : 'destructive'}>
                      {institution.user?.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInstitution(institution)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={institution.user?.active ? 'destructive' : 'default'}
                      onClick={() => toggleStatus(institution.id, institution.user?.active)}
                    >
                      {institution.user?.active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {search ? 'No se encontraron instituciones con ese criterio' : 'No hay instituciones registradas'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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