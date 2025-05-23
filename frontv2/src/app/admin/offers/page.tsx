'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MapPin, Building, DollarSign, Users, Edit, ToggleLeft, ToggleRight, Ungroup } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import config from '@/types/config';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { apiRequest } from '@/services/requests/apiRequest';
import { useContext } from 'react';
import { LoaderContext } from '@/contexts/LoaderContext';

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
    skills: any;
    created_at: string;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [editData, setEditData] = useState<Partial<Offer>>({});
    const [viewOffer, setViewOffer] = useState<Offer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const { showLoader, hideLoader } = useContext(LoaderContext);

    const fetchOffers = async () => {
        setLoading(true);
        showLoader();
        try {
            const data = await apiRequest('admin/offers', 'GET');
            setOffers(data?.data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al cargar ofertas',
                variant: 'destructive',
            });
        } finally {
            hideLoader();
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const dataToSend = {
                ...editData,
                skills: Array.isArray(editData.skills) ? editData.skills : [],
            };

            await apiRequest(`admin/offers/${id}`, 'PUT', dataToSend);

            toast({
                title: 'Éxito',
                description: 'Oferta actualizada correctamente',
            });
            setSelectedOffer(null);
            setIsEditing(false);
            fetchOffers();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Error desconocido al actualizar',
                variant: 'destructive',
            });
        }
    };

    const deleteOffer = async (id: number) => {
        if (!confirm('¿Eliminar esta oferta permanentemente?')) return;

        try {
            await apiRequest(`admin/offers/${id}`, 'DELETE');
            toast({
                title: 'Éxito',
                description: 'Oferta eliminada correctamente',
            });
            setOffers(offers.filter(o => o.id !== id));
            setViewOffer(null);
            setSelectedOffer(null);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al eliminar oferta',
                variant: 'destructive',
            });
        }
    };

    const toggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await apiRequest(`admin/offers/${id}/status`, 'PUT', { active: !currentStatus });

            toast({
                title: 'Éxito',
                description: `Oferta ${!currentStatus ? 'activada' : 'desactivada'} correctamente`,
            });
            setOffers(offers.map(offer =>
                offer.id === id ? { ...offer, active: !currentStatus } : offer
            ));
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error al cambiar estado',
                variant: 'destructive',
            });
        }
    };

    const openEditModal = (offer: Offer) => {
        setSelectedOffer(offer);
        setEditData({ ...offer });
        setIsEditing(true);
        setViewOffer(null);
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

    return (
        <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">Gestión de Ofertas ({offers.length})</h1>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Buscar por título, empresa o ciudad..."
                        className="w-full sm:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={fetchOffers} variant="outline">
                        Refrescar
                    </Button>
                    <Button onClick={() => router.push('/admin')}>
                        Ir al panel de admin
                    </Button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => (
                    <Card key={offer.id} className="relative hover:shadow-lg transition-shadow">
                        {/* Eye icon for view details */}
                        <div className="absolute top-2 right-2 flex gap-1 pt-2 pr-2">
                            <button
                                onClick={() => setViewOffer(offer)}
                                className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                                title="Ver detalles"
                            >
                                <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between pr-8">
                                <div>
                                    <CardTitle className="text-lg mb-1">{offer.title}</CardTitle>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Building className="h-4 w-4 mr-1" />
                                        {offer.company.name}
                                    </div>
                                </div>
                            </div>
                            <Badge variant={offer.active ? 'default' : 'destructive'} className="w-fit">
                                {offer.active ? 'Activa' : 'Inactiva'}
                            </Badge>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    {offer.salary}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {offer.city} - {offer.location_type}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-2" />
                                    {offer.vacancies} vacante{offer.vacancies !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => openEditModal(offer)}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={offer.active ? 'destructive' : 'default'}
                                    onClick={() => toggleStatus(offer.id, offer.active)}
                                >
                                    {offer.active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal de Vista Detallada */}
            {viewOffer && (
                <Dialog open={!!viewOffer} onOpenChange={() => setViewOffer(null)}>
                    <DialogContent className="sm:max-w-[700px] max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                {viewOffer.title}
                                <Badge className="mr-5" variant={viewOffer.active ? 'default' : 'destructive'}>
                                    {viewOffer.active ? 'Activa' : 'Inactiva'}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                ID: {viewOffer.id} | Creada: {new Date(viewOffer.created_at).toLocaleDateString()}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Información básica */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <Building className="h-4 w-4 mr-2" />
                                        Empresa
                                    </h4>
                                    <p className="text-gray-700">{viewOffer.company.name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Salario
                                    </h4>
                                    <p className="text-gray-700">{viewOffer.salary}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Ubicación
                                    </h4>
                                    <p className="text-gray-700">{viewOffer.city} - {viewOffer.location_type}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                        <Users className="h-4 w-4 mr-2" />
                                        Vacantes
                                    </h4>
                                    <p className="text-gray-700">{viewOffer.vacancies}</p>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <div className="flex items-center mb-2">
                                    <Building className="h-4 w-4 mr-2" />
                                    <h4 className="font-semibold">Descripción</h4>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                                    {viewOffer.description}
                                </p>
                            </div>

                            {/* Skills */}
                            {viewOffer.skills && (() => {
                                let parsedSkills;
                                try {
                                    parsedSkills = JSON.parse(viewOffer.skills);
                                } catch (error) {
                                    parsedSkills = [];
                                }

                                return parsedSkills.length > 0 && (
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <Ungroup className="h-4 w-4 mr-2" />
                                            <h4 className="font-semibold">Habilidades Requeridas</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedSkills.map((skill: any, index: any) => (
                                                <Badge key={index} variant="default">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}


                            {/* Acciones */}
                            <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteOffer(viewOffer.id)}
                                >
                                    Eliminar Oferta
                                </Button>
                                <Button variant="outline" onClick={() => setViewOffer(null)}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal de Edición */}
            {selectedOffer && isEditing && (
                <Dialog open={isEditing} onOpenChange={() => {
                    setSelectedOffer(null);
                    setIsEditing(false);
                }}>
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
                                <Button variant="outline" onClick={() => {
                                    setSelectedOffer(null);
                                    setIsEditing(false);
                                }}>
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