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
interface Student {
  id: number;
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
  languages: string[] | string;
  active: boolean;
  user: {
    email: string;
    active: boolean;
  };
  education_count?: number;
  skills_count?: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [currentLanguage, setCurrentLanguage] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}admin/students`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Asegurar que languages sea siempre un array
        const formattedStudents = data.data.data.map((student: Student) => ({
          ...student,
          languages: ensureArray(student.languages)
        }));
        setStudents(formattedStudents || []);
      } else {
        throw new Error(data.message || 'Error al cargar estudiantes');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  // Función para asegurar que languages sea un array
  const ensureArray = (languages: string[] | string | undefined): string[] => {
    if (!languages) return [];
    if (Array.isArray(languages)) return languages;
    try {
      // Si es un string JSON, parsearlo
      if (typeof languages === 'string' && languages.startsWith('[')) {
        return JSON.parse(languages);
      }
      // Si es un string simple, convertirlo a array
      return [languages];
    } catch {
      return [];
    }
  };
  const handleUpdate = async (id: number) => {
    try {
      // Preparar solo los campos permitidos para actualizar
      const allowedFields = [
        'name', 'surname', 'type_document', 'id_document', 'nationality',
        'birthday', 'gender', 'phone', 'address', 'city', 'country',
        'postal_code', 'languages', 'active'
      ];

      const dataToSend: any = {};

      allowedFields.forEach(field => {
        if (field in editData) {
          // Manejo especial para languages
          if (field === 'languages') {
            const languagesArray = ensureArray(editData.languages);
            dataToSend[field] = languagesArray.filter(lang => lang.trim() !== '');
          }
          // Manejo especial para birthday
          else if (field === 'birthday' && editData.birthday) {
            dataToSend[field] = new Date(editData.birthday).toISOString().split('T')[0];
          }
          else {
            dataToSend[field] = editData[field as keyof Student];
          }
        }
      });

      const response = await fetch(`${config.apiUrl}admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      toast.success('Estudiante actualizado correctamente');
      setSelectedStudent(null);
      fetchStudents();

    } catch (error) {
      console.error('Error completo:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar estudiante');
    }
  };

  // Función para agregar un nuevo idioma
  const addLanguage = () => {
    if (currentLanguage.trim() === '') return;

    setEditData(prev => ({
      ...prev,
      languages: [...ensureArray(prev.languages), currentLanguage.trim()]
    }));

    setCurrentLanguage('');
  };

  // Función para eliminar un idioma
  const removeLanguage = (index: number) => {
    const currentLanguages = ensureArray(editData.languages);
    setEditData(prev => ({
      ...prev,
      languages: currentLanguages.filter((_, i) => i !== index)
    }));
  };

  // ... (resto de funciones permanecen igual: toggleStatus, deleteStudent, etc.)

  useEffect(() => {
    fetchStudents();
  }, []);

  // Cuando seleccionamos un estudiante para editar
  useEffect(() => {
    if (selectedStudent) {
      setEditData({
        ...selectedStudent,
        languages: ensureArray(selectedStudent.languages)
      });
    }
  }, [selectedStudent]);

  const currentLanguages = ensureArray(editData.languages);

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`${config.apiUrl}admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      fetchStudents();
      toast({
        title: 'Éxito',
        description: `Estudiante ${!currentStatus ? 'activado' : 'desactivado'} correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al cambiar estado',
        variant: 'destructive',
      });
    }
  };

  const deleteStudent = async (id: number) => {
    if (!confirm('¿Eliminar este estudiante y todos sus datos asociados?')) return;

    try {
      await fetch(`${config.apiUrl}admin/students/${id}`, {
        method: 'DELETE',
      });
      setStudents(students.filter(s => s.id !== id));
      toast({
        title: 'Éxito',
        description: 'Estudiante eliminado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar estudiante',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s =>
    `${s.name} ${s.surname}`.toLowerCase().includes(search.toLowerCase()) ||
    s.id_document.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Estudiantes ({students.length})</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Buscar por nombre, documento o email..."
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={fetchStudents} variant="outline">
            Refrescar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Formación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{student.name} {student.surname}</div>
                  <div className="text-sm text-gray-500">{student.nationality}</div>
                </TableCell>
                <TableCell>
                  <div>{student.type_document}: {student.id_document}</div>
                  <div className="text-sm text-gray-500">
                    {student.birthday && new Date(student.birthday).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{student.user?.email}</div>
                  <div className="text-sm text-gray-500">{student.phone}</div>
                </TableCell>
                <TableCell>
                  <div>Educación: {student.education_count || 0}</div>
                  <div className="text-sm text-gray-500">Habilidades: {student.skills_count || 0}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.user?.active ? 'default' : 'destructive'}>
                    {student.user?.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStudent(student);
                      setEditData({ ...student });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant={student.user?.active ? 'destructive' : 'default'}
                    onClick={() => toggleStatus(student.id, student.user?.active)}
                  >
                    {student.user?.active ? 'Desactivar' : 'Activar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edición */}
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

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthday">Fecha Nacimiento</Label>
                <input
                  id="birthday"
                  type="date"
                  value={editData.birthday
                    ? new Date(editData.birthday).toISOString().split('T')[0]
                    : ''}
                  className="col-span-3 border rounded p-2"
                  onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
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
                      placeholder="Añadir idioma"
                    />
                    <Button type="button" onClick={addLanguage}>
                      Añadir
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="languages">Idiomas</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="languages"
                          value={currentLanguage}
                          onChange={(e) => setCurrentLanguage(e.target.value)}
                          placeholder="Añadir idioma"
                        />
                        <Button type="button" onClick={addLanguage}>
                          Añadir
                        </Button>
                      </div>

                      {/* Lista de idiomas actuales */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentLanguages.map((lang, index) => (
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
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => deleteStudent(selectedStudent.id)}
                >
                  Eliminar Estudiante
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
    </div>
  );
}