'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import config from '@/types/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';


interface Company {
  id: number;
  name: string;
  CIF: string;
  email: string;
  phone: string;
  website: string;
  active: boolean;
  offers_count?: number;
  num_people?: number;
  short_description?: string;
  description?: string;
  responsible_name?: string;
  responsible_email?: string;
  responsible_phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  user: {
    email: string;
    name: string;
    surname: string;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editData, setEditData] = useState<Partial<Company>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const { loggedIn, userData } = useAdminAuth();
  if (!loggedIn || userData?.rol !== 'admin') {
    return null; // O mostrar un loader
  }

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}admin/companies`);

      if (!response.ok) {
        throw new Error('Error al cargar empresas');
      }

      const data = await response.json();

      if (data.success) {
        setCompanies(data.data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar empresas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las empresas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`${config.apiUrl}admin/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Éxito',
          description: 'Empresa actualizada correctamente',
        });
        setSelectedCompany(null);
        fetchCompanies();
      } else {
        throw new Error(data.message || 'Error al actualizar la empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al actualizar la empresa',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${config.apiUrl}admin/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Empresa ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
        setCompanies(companies.map(company =>
          company.id === id ? { ...company, active: !currentStatus } : company
        ));
      } else {
        throw new Error(data.message || 'Error al cambiar el estado');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar el estado');
    }
  };
  const deleteCompany = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${config.apiUrl}admin/companies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Éxito',
          description: 'Empresa eliminada correctamente',
        });
        setCompanies(companies.filter(c => c.id !== id));
      } else {
        throw new Error(data.message || 'Error al eliminar la empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar la empresa',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (c.email?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (c.CIF?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (c.user?.email?.toLowerCase().includes(search.toLowerCase()) || '')
  );

  if (loading) return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Empresas ({companies.length})</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar por nombre, CIF, email..."
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchCompanies} variant="outline">
            Refrescar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>CIF</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Ofertas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.CIF || '-'}</TableCell>
                  <TableCell>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-gray-500">{company.website}</div>
                  </TableCell>
                  <TableCell>
                    <div>{company.email}</div>
                    <div className="text-sm text-gray-500">{company.phone}</div>
                    <div className="text-sm text-gray-500">Usuario: {company.user?.email}</div>
                  </TableCell>
                  <TableCell>{company.offers_count || 0}</TableCell>
                  <TableCell>
                    <Badge variant={company.active ? 'default' : 'destructive'}>
                      {company.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCompany(company);
                        setEditData({ ...company });
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={company.active ? 'destructive' : 'default'}
                      onClick={() => toggleStatus(company.id, company.active)}
                    >
                      {company.active ? 'Desactivar' : 'Activar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {search ? 'No se encontraron empresas con ese criterio' : 'No hay empresas registradas'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edición */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar {selectedCompany.name}</DialogTitle>
              <DialogDescription>
                ID: {selectedCompany.id} | Usuario asociado: {selectedCompany.user?.name} {selectedCompany.user?.surname} ({selectedCompany.user?.email})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editData.name || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cif">CIF</Label>
                <Input
                  id="cif"
                  value={editData.CIF || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, CIF: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editData.phone || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={editData.website || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="num_people">Número de empleados</Label>
                <Input
                  id="num_people"
                  type="number"
                  value={editData.num_people || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, num_people: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible_name">Responsable</Label>
                <Input
                  id="responsible_name"
                  value={editData.responsible_name || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, responsible_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible_email">Email responsable</Label>
                <Input
                  id="responsible_email"
                  type="email"
                  value={editData.responsible_email || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, responsible_email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible_phone">Teléfono responsable</Label>
                <Input
                  id="responsible_phone"
                  type="tel"
                  value={editData.responsible_phone || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, responsible_phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={editData.address || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={editData.city || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="postal_code">Código Postal</Label>
                <Input
                  id="postal_code"
                  value={editData.postal_code || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, postal_code: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={editData.country || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="short_description">Descripción corta</Label>
                <Input
                  id="short_description"
                  value={editData.short_description || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, short_description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={editData.description || ''}
                  className="col-span-3 min-h-[100px] p-2 border rounded"
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => deleteCompany(selectedCompany.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Empresa'}
                </Button>
                <Button variant="outline" onClick={() => setSelectedCompany(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleUpdate(selectedCompany.id)}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}