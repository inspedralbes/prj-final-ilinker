'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import config from '@/types/config';

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
  founded_year: string;
  languages: string[];
  specialties: string[];
  courses_count?: number;
  user: {
    email: string;
    active: boolean;
  };
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [editData, setEditData] = useState<Partial<Institution>>({});

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}admin/institutions`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setInstitutions(data.data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar instituciones');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al cargar instituciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const dataToSend = {
        ...editData,
        languages: Array.isArray(editData.languages) ? editData.languages : [],
        specialties: Array.isArray(editData.specialties) ? editData.specialties : []
      };
  
      const response = await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      if (data.success) {
        toast.success('Institución actualizada correctamente');
        setSelectedInstitution(null);
        fetchInstitutions();
      } else {
        throw new Error(data.message || 'Error al actualizar institución');
      }
    } catch (error) {
      console.error('Error details:', error);
      toast.error(error instanceof Error ? error.message : 'Error desconocido al actualizar');
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      fetchInstitutions();
      toast({
        title: 'Éxito',
        description: `Institución ${!currentStatus ? 'activada' : 'desactivada'} correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al cambiar estado',
        variant: 'destructive',
      });
    }
  };

  const deleteInstitution = async (id: number) => {
    if (!confirm('¿Eliminar esta institución y todos sus datos asociados?')) return;
    
    try {
      await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'DELETE',
      });
      setInstitutions(institutions.filter(i => i.id !== id));
      toast({
        title: 'Éxito',
        description: 'Institución eliminada correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar institución',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.NIF.toLowerCase().includes(search.toLowerCase()) ||
    i.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Instituciones ({institutions.length})</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar por nombre, NIF o email..."
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchInstitutions} variant="outline">
            Refrescar
          </Button>
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
            {filteredInstitutions.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell>{institution.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{institution.name}</div>
                  <div className="text-sm text-gray-500">{institution.type}</div>
                </TableCell>
                <TableCell>{institution.NIF}</TableCell>
                <TableCell>
                  <div>{institution.user?.email}</div>
                  <div className="text-sm text-gray-500">{institution.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={institution.user?.active ? 'default' : 'destructive'}>
                    {institution.user?.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedInstitution(institution);
                      setEditData({...institution});
                    }}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edición */}
      {selectedInstitution && (
        <Dialog open={!!selectedInstitution} onOpenChange={() => setSelectedInstitution(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar {selectedInstitution.name}</DialogTitle>
              <DialogDescription>
                ID: {selectedInstitution.id} | Email: {selectedInstitution.user?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editData.name || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="NIF">NIF</Label>
                <Input
                  id="NIF"
                  value={editData.NIF || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, NIF: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={editData.type || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, type: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editData.phone || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={editData.website || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible_name">Responsable</Label>
                <Input
                  id="responsible_name"
                  value={editData.responsible_name || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, responsible_name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible_email">Email Responsable</Label>
                <Input
                  id="responsible_email"
                  type="email"
                  value={editData.responsible_email || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, responsible_email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="founded_year">Año Fundación</Label>
                <Input
                  id="founded_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={editData.founded_year || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({...editData, founded_year: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="destructive" 
                  onClick={() => deleteInstitution(selectedInstitution.id)}
                >
                  Eliminar Institución
                </Button>
                <Button variant="outline" onClick={() => setSelectedInstitution(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleUpdate(selectedInstitution.id)}>
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