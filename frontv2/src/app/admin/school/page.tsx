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
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [editData, setEditData] = useState<Partial<Institution>>({});
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [currentSpecialty, setCurrentSpecialty] = useState('');

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
      toast.error(error instanceof Error ? error.message : 'Error al cargar instituciones');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
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

      const response = await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar institución');
      }

      toast.success('Institución actualizada correctamente');
      setSelectedInstitution(null);
      fetchInstitutions();
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar institución');
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Institución ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
        setInstitutions(institutions.map(institution =>
          institution.id === id ? {
            ...institution,
            active: !currentStatus,
            user: {
              ...institution.user,
              active: !currentStatus
            }
          } : institution
        ));
      } else {
        throw new Error(data.message || 'Error al cambiar estado');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
    }
  };

  const deleteInstitution = async (id: number) => {
    if (!confirm('¿Eliminar esta institución y todos sus datos asociados?')) return;

    try {
      const response = await fetch(`${config.apiUrl}admin/institutions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Institución eliminada correctamente');
        setInstitutions(institutions.filter(i => i.id !== id));
      } else {
        throw new Error(data.message || 'Error al eliminar institución');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar institución');
    }
  };

  const addLanguage = () => {
    if (currentLanguage.trim() === '') return;

    const updatedLanguages = [
      ...(editData.languages || []),
      currentLanguage.trim()
    ];

    setEditData(prev => ({
      ...prev,
      languages: updatedLanguages
    }));

    setCurrentLanguage('');
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = (editData.languages || []).filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      languages: updatedLanguages
    }));
  };

  const addSpecialty = () => {
    if (currentSpecialty.trim() === '') return;

    const updatedSpecialties = [
      ...(editData.specialties || []), // Añade fallback
      currentSpecialty.trim()
    ];

    setEditData(prev => ({
      ...prev,
      specialties: updatedSpecialties
    }));

    setCurrentSpecialty(''); // Corrige el nombre de la variable
  };

  const removeSpecialty = (index: number) => {
    const updatedSpecialties = (editData.specialties || []).filter((_, i) => i !== index);
    setEditData(prev => ({
      ...prev,
      specialties: updatedSpecialties
    }));
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    if (selectedInstitution) {
      setEditData({
        ...selectedInstitution,
        languages: selectedInstitution.languages || [],
        specialties: selectedInstitution.specialties || [] // Asegura que sea array
      });
    }
  }, [selectedInstitution]);
  

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
                   <Button
                    size="sm"
                    variant={institution.user?.active ? 'destructive' : 'default'}
                    onClick={() => toggleStatus(institution.id, institution.user?.active)}
                  >
                    {institution.user?.active ? 'Desactivar' : 'Activar'}
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