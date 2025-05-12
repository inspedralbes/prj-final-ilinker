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
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';


interface Offer {
    id: number;
    title: string;
    company: {
        name: string;
    };
    description: string;
    salary: string;
    location_type: string;
    city: string;
    active: boolean;
    vacancies: number;
    skills: string[];
    created_at: string;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [editData, setEditData] = useState<Partial<Offer>>({});
    const router = useRouter();

    const { loggedIn, userData } = useAdminAuth();
    if (!loggedIn || userData?.rol !== 'admin') {
        return null; // O mostrar un loader
    }

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}admin/offers`);
            const data = await response.json();

            if (response.ok) {
                setOffers(data.data || []);
            } else {
                throw new Error(data.message || 'Error al cargar ofertas');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al cargar ofertas',
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
                skills: Array.isArray(editData.skills) ? editData.skills : [],
            };

            const response = await fetch(`${config.apiUrl}admin/offers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (!response.ok) {
                // Muestra detalles del error de validación si existen
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join('\n');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || `Error ${response.status}`);
            }

            toast.success('Oferta actualizada correctamente');
            setSelectedOffer(null);
            fetchOffers();
        } catch (error) {
            console.error('Error completo:', error);
            toast.error(error instanceof Error ? error.message : 'Error desconocido al actualizar');
        }
    };

    const deleteOffer = async (id: number) => {
        if (!confirm('¿Eliminar esta oferta permanentemente?')) return;

        try {
            const response = await fetch(`${config.apiUrl}admin/offers/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast({
                    title: 'Éxito',
                    description: 'Oferta eliminada correctamente',
                });
                setOffers(offers.filter(o => o.id !== id));
            } else {
                throw new Error('Error al eliminar oferta');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al eliminar oferta',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const filteredOffers = Array.isArray(offers)
        ? offers.filter(offer =>
            offer.title.toLowerCase().includes(search.toLowerCase()) ||
            (offer.company?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (offer.city || '').toLowerCase().includes(search.toLowerCase())
        )
        : [];

    if (loading) return (
        <div className="p-8 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch(`${config.apiUrl}admin/offers/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(`Oferta ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
                setOffers(offers.map(offer =>
                    offer.id === id ? { ...offer, active: !currentStatus } : offer
                ));
            } else {
                throw new Error(data.message || 'Error al cambiar estado');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al cambiar estado');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Ofertas ({offers.length})</h1>
                <div className="flex items-center space-x-4">
                    <Input
                        placeholder="Buscar por título, empresa o ciudad..."
                        className="max-w-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={fetchOffers} variant="outline">
                        Refrescar
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Salario</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Vacantes</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOffers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell>{offer.id}</TableCell>
                                <TableCell className="font-medium">{offer.title}</TableCell>
                                <TableCell>{offer.company.name}</TableCell>
                                <TableCell>{offer.salary}</TableCell>
                                <TableCell>
                                    <div>{offer.city}</div>
                                    <div className="text-sm text-gray-500 capitalize">{offer.location_type}</div>
                                </TableCell>
                                <TableCell>{offer.vacancies}</TableCell>
                                <TableCell>
                                    <Badge variant={offer.active ? 'default' : 'destructive'}>
                                        {offer.active ? 'Activa' : 'Inactiva'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex justify-end space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedOffer(offer);
                                            setEditData({ ...offer });
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={offer.active ? 'destructive' : 'default'}
                                        onClick={() => toggleStatus(offer.id, offer.active)}
                                    >
                                        {offer.active ? 'Desactivar' : 'Activar'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Edición */}
            {selectedOffer && (
                <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar {selectedOffer.title}</DialogTitle>
                            <DialogDescription>
                                ID: {selectedOffer.id} | Empresa: {selectedOffer.company.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={editData.title || ''}
                                    className="col-span-3"
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="salary">Salario</Label>
                                <Input
                                    id="salary"
                                    value={editData.salary || ''}
                                    className="col-span-3"
                                    onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location_type">Tipo de ubicación</Label>
                                <Select
                                    value={editData.location_type || ''}
                                    onValueChange={(value) => setEditData({ ...editData, location_type: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="remoto">Remoto</SelectItem>
                                        <SelectItem value="presencial">Presencial</SelectItem>
                                        <SelectItem value="hibrido">Híbrido</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Label htmlFor="vacancies">Vacantes</Label>
                                <Input
                                    id="vacancies"
                                    type="number"
                                    min="1"
                                    value={editData.vacancies || ''}
                                    className="col-span-3"
                                    onChange={(e) => setEditData({ ...editData, vacancies: parseInt(e.target.value) })}
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
                                    onClick={() => deleteOffer(selectedOffer.id)}
                                >
                                    Eliminar Oferta
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedOffer(null)}>
                                    Cancelar
                                </Button>
                                <Button onClick={() => handleUpdate(selectedOffer.id)}>
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