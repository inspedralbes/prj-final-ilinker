'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { apiRequest } from '@/services/requests/apiRequest';
import { Eye, Pencil, Power, Trash2, RefreshCw, LayoutDashboard, FileUser, IdCard, Languages, Contact, MapPin, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  type_document: string;
  id_document: string;
  nationality: string;
  birthday: string;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  languages: any;
  active: boolean;
  user: {
    email: string;
    active: boolean;
  };
  created_at: string;
  updated_at: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [currentLanguage, setCurrentLanguage] = useState('');
  const router = useRouter();

  const normalizeLanguages = (languages: any): string[] => {
    if (!languages) return [];

    if (Array.isArray(languages)) {
      return languages.map(lang => {
        if (typeof lang === 'string') return lang;
        if (typeof lang === 'object') return lang.language || '';
        return '';
      }).filter(lang => lang !== '');
    }

    if (typeof languages === 'string') {
      try {
        const parsed = JSON.parse(languages);
        return normalizeLanguages(parsed);
      } catch {
        return [languages];
      }
    }

    return [];
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`admin/students`);
      const data = await response.data;

      if (response.success) {
        setStudents(data.data || []);
      } else {
        throw new Error(data.message || 'Error al cargar estudiantes');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const allowedFields = [
        'name', 'surname', 'type_document', 'id_document', 'nationality',
        'birthday', 'gender', 'phone', 'address', 'city', 'country',
        'postal_code', 'languages', 'active'
      ];

      const dataToSend: Record<string, any> = {};
      allowedFields.forEach(field => {
        if (field in editData && editData[field as keyof Student] !== undefined) {
          if (field === 'languages') {
            dataToSend[field] = Array.isArray(editData.languages)
              ? editData.languages
              : normalizeLanguages(editData.languages);
          } else {
            dataToSend[field] = editData[field as keyof Student];
          }
        }
      });

      if (!dataToSend.name || !dataToSend.surname) {
        throw new Error('Nombre y apellidos son campos requeridos');
      }

      const response = await apiRequest(`admin/students/${id}`, 'PUT', dataToSend);

      if (!response.success) {
        throw new Error(response.data?.message || 'Error al actualizar estudiante');
      }

      toast.success('Estudiante actualizado correctamente');
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar estudiante');
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await apiRequest(`admin/students/${id}`, 'PUT', { active: !currentStatus });

      if (response.success) {
        toast.success(`Estudiante ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
        setStudents(students.map(student =>
          student.id === id ? {
            ...student,
            user: {
              ...student.user,
              active: !currentStatus
            }
          } : student
        ));
      } else {
        throw new Error(response.data?.message || 'Error al cambiar estado');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
    }
  };

  const deleteStudent = async (id: number) => {
    if (!confirm('¿Eliminar este estudiante y todos sus datos asociados?')) return;

    try {
      const response = await apiRequest(`admin/students/${id}`, 'DELETE');

      if (response.success) {
        toast.success('Estudiante eliminado correctamente');
        setStudents(students.filter(s => s.id !== id));
      } else {
        throw new Error(response.data?.message || 'Error al eliminar estudiante');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar estudiante');
    }
  };

  const addLanguage = () => {
    if (currentLanguage.trim() === '') return;

    const updatedLanguages = [
      ...normalizeLanguages(editData.languages),
      currentLanguage.trim()
    ];

    setEditData(prev => ({
      ...prev,
      languages: updatedLanguages
    }));

    setCurrentLanguage('');
  };

  const removeLanguage = (index: number) => {
    const currentLanguages = normalizeLanguages(editData.languages);
    const updatedLanguages = currentLanguages.filter((_, i) => i !== index);

    setEditData(prev => ({
      ...prev,
      languages: updatedLanguages
    }));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      setEditData({
        ...selectedStudent,
        languages: normalizeLanguages(selectedStudent.languages)
      });
    }
  }, [selectedStudent]);

  const filteredStudents = students.filter(s =>
    `${s.name} ${s.surname}`.toLowerCase().includes(search.toLowerCase()) ||
    s.id_document.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gestión de Estudiantes ({students.length})</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por nombre, documento o email..."
            className="w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchStudents} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refrescar</span>
          </Button>
          <Button onClick={() => window.location.href = "/admin"} className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Panel de admin</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="absolute top-2 right-2 flex gap-1 pt-2 pr-2">
                  <button
                    onClick={() => setViewingStudent(student)}
                    className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{student.name} {student.surname}</h3>
                    <p className="text-sm text-gray-500">ID: {student.id}</p>
                  </div>
                  <Badge variant={student.user?.active ? 'default' : 'destructive'} className="ml-auto">
                    {student.user?.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-1">
                  <div className="text-sm"><span className="font-medium">Email:</span> {student.user?.email}</div>
                  <div className="text-sm"><span className="font-medium">Documento:</span> {student.type_document}: {student.id_document}</div>
                  <div className="text-sm"><span className="font-medium">Teléfono:</span> {student.phone || 'No especificado'}</div>
                  <div className="text-sm"><span className="font-medium">Nacionalidad:</span> {student.nationality || 'No especificada'}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setSelectedStudent(student)}
                >
                  <Pencil className="w-3 h-3" />
                  <span>Editar</span>
                </Button>
                <Button
                  size="sm"
                  variant={student.user?.active ? 'destructive' : 'default'}
                  className="flex items-center gap-1"
                  onClick={() => toggleStatus(student.id, student.user?.active)}
                >
                  <Power className="w-3 h-3" />
                  <span>{student.user?.active ? 'Desactivar' : 'Activar'}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar {selectedStudent.name} {selectedStudent.surname}</DialogTitle>
              <DialogDescription>
                ID: {selectedStudent.id} | Email: {selectedStudent.user?.email}
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
                <Label htmlFor="surname">Apellidos</Label>
                <Input
                  id="surname"
                  value={editData.surname || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, surname: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type_document">Tipo Documento</Label>
                <Select
                  value={editData.type_document || ''}
                  onValueChange={(value) => setEditData({ ...editData, type_document: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="NIE">NIE</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_document">Número Documento</Label>
                <Input
                  id="id_document"
                  value={editData.id_document || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, id_document: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input
                  id="nationality"
                  value={editData.nationality || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, nationality: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthday">Fecha Nacimiento</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={editData.birthday ? new Date(editData.birthday).toISOString().split('T')[0] : ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender">Género</Label>
                <Select
                  value={editData.gender || ''}
                  onValueChange={(value) => setEditData({ ...editData, gender: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="No decir">Prefiero no decir</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={editData.country || ''}
                  className="col-span-3"
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
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

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="languages">Idiomas</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="languages"
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      placeholder="Añadir idioma (ej: Inglés)"
                    />
                    <Button type="button" onClick={addLanguage}>
                      Añadir
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {normalizeLanguages(editData.languages).map((lang, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => deleteStudent(selectedStudent.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleUpdate(selectedStudent.id)}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para ver detalles del estudiante */}
      {viewingStudent && (
        <Dialog open={!!viewingStudent} onOpenChange={() => setViewingStudent(null)}>
          <DialogContent className="sm:max-w-[800px] max-w-[90%] max-h-[60vh] sm:max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle>Detalles de {viewingStudent.name} {viewingStudent.surname}</DialogTitle>
              <DialogDescription>
                ID: {viewingStudent.id} | Email: {viewingStudent.user?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileUser className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Información Personal</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div><span className="font-medium">Nombre completo:</span> {viewingStudent.name} {viewingStudent.surname}</div>
                      <div><span className="font-medium">Fecha de nacimiento:</span> {viewingStudent.birthday ? new Date(viewingStudent.birthday).toLocaleDateString() : 'No especificada'}</div>
                      <div><span className="font-medium">Género:</span> {viewingStudent.gender || 'No especificado'}</div>
                      <div><span className="font-medium">Nacionalidad:</span> {viewingStudent.nationality || 'No especificada'}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <IdCard className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Documento de Identidad</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div><span className="font-medium">Tipo:</span> {viewingStudent.type_document || 'No especificado'}</div>
                      <div><span className="font-medium">Número:</span> {viewingStudent.id_document || 'No especificado'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>

                    <div className="flex items-center gap-2">
                      <Contact className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Contacto</h3>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div><span className="font-medium">Email:</span> {viewingStudent.user?.email || 'No especificado'}</div>
                      <div><span className="font-medium">Teléfono:</span> {viewingStudent.phone || 'No especificado'}</div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center gap-2'>
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div><span className="font-medium">Dirección:</span> {viewingStudent.address || 'No especificada'}</div>
                      <div><span className="font-medium">Ciudad:</span> {viewingStudent.city || 'No especificada'}</div>
                      <div><span className="font-medium">País:</span> {viewingStudent.country || 'No especificado'}</div>
                      <div><span className="font-medium">Código Postal:</span> {viewingStudent.postal_code || 'No especificado'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>

                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-500">Idiomas</h3>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {normalizeLanguages(viewingStudent.languages).length > 0 ? normalizeLanguages(viewingStudent.languages).map((lang, index) => (
                    <Badge key={index}>{lang}</Badge>
                  )) : <span className="text-gray-400">No hay idiomas especificados</span>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Power className="w-5 h-5 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                </div>
                <div className="mt-2">
                  <Badge variant={viewingStudent.user?.active ? 'default' : 'destructive'}>
                    {viewingStudent.user?.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-500">Información adicional</h3>
                </div>

                <div className="mt-2 space-y-2">
                  <div><span className="font-medium">Fecha de registro:</span> {viewingStudent.created_at ? new Date(viewingStudent.created_at).toLocaleString() : 'No disponible'}</div>
                  <div><span className="font-medium">Última actualización:</span> {viewingStudent.updated_at ? new Date(viewingStudent.updated_at).toLocaleString() : 'No disponible'}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">

                <Button onClick={() => setViewingStudent(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}