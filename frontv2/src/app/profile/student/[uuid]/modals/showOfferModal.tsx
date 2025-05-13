import { useState } from 'react';
import {X, Calendar, MapPin, Briefcase, Clock, Users, CreditCard, CheckCircle, XCircle, Loader2} from 'lucide-react';
import {Button} from "@/components/ui/button";

interface PropsModal {
    application: any;
    onClose: () => void;
}

export default function OfferModal({ application, onClose }: PropsModal) {
    const [loading, setLoading] = useState(false);

    // Función para parsear el JSON de habilidades
    const parseSkills = (skillsStr: any) => {
        try {
            return JSON.parse(skillsStr);
        } catch (e) {
            return [];
        }
    };

    // Función para determinar el color del estado
    const getStatusColor = (status: any) => {
        switch(status) {
            case 'accept':
                return 'text-green-600 bg-green-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'rejected':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    // Función para traducir el estado
    const getStatusText = (status: any) => {
        switch(status) {
            case 'accept':
                return 'Aceptada';
            case 'pending':
                return 'Pendiente';
            case 'rejected':
                return 'Rechazada';
            default:
                return status;
        }
    };

    // Función para obtener el icono del estado
    const getStatusIcon = (status: any) => {
        switch(status) {
            case 'accept':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'pending':
                return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const skills = parseSkills(application.offer.skills);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">Detalles de la Oferta</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Estado de la aplicación */}
                    <div className="mb-6 flex items-center">
                        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-2 font-medium">{getStatusText(application.status)}</span>
                        </div>
                        <div className="ml-4 text-sm text-gray-500">
                            Aplicación enviada el {formatDate(application.created_at)}
                        </div>
                    </div>

                    {/* Información de la oferta */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{application.offer.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {application.offer.vacancies} {application.offer.vacancies === 1 ? 'Vacante' : 'Vacantes'}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {application.offer.city}, {application.offer.postal_code}
                            </div>
                            <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-1" />
                                {application.offer.salary}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Disponibilidad: {application.availability}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Descripción:</h4>
                            <p className="text-gray-700">{application.offer.description}</p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Habilidades requeridas:</h4>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill: any, index: number) => (
                                    <span key={index} className="bg-black text-white text-bold px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dirección completa */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Dirección:</h4>
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
                            <span className="text-gray-700">
                {application.offer.address}, {application.offer.city}, {application.offer.postal_code}
              </span>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Detalles del trabajo:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">Tipo de ubicación:</span>
                                    <span>{application.offer.location_type || 'No especificado'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">Tipo de horario:</span>
                                    <span>{application.offer.schedule_type || 'No especificado'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">Días por semana:</span>
                                    <span>{application.offer.days_per_week || 'No especificado'}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Tu aplicación:</h4>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">CV:</span>
                                    <span>{application.cv_attachment ? 'Enviado' : 'No enviado'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">Carta de presentación:</span>
                                    <span>{application.cover_letter_attachment ? 'Enviada' : 'No enviada'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-32 text-gray-600">Disponibilidad:</span>
                                    <span>{application.availability}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 flex justify-end sticky bottom-0 bg-white">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-white font-medium transition-colors"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}