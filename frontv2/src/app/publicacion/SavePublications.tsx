"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { Bookmark, X, Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";
import config from "@/types/config";

interface Publication {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    location?: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    media?: {
        id: number;
        file_path: string;
        media_type: "image" | "video";
        display_order: number;
    }[];
    has_media: boolean;
    visibility: "public" | "private";
    comments_enabled: boolean;
    status: "published" | "draft" | "archived";
    liked?: boolean;
    saved?: boolean;
    likes?: {
        user_id: number;
    }[];
    saved_by?: {
        user_id: number;
    }[];
}

interface SavePublicationsProps {
    isOpen: boolean;
    onClose: () => void;
}

const SavePublications: React.FC<SavePublicationsProps> = ({ isOpen, onClose }) => {
    const [savedPublications, setSavedPublications] = useState<Publication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { allUsers, userData } = useContext(AuthContext);
    const { showLoader, hideLoader } = useContext(LoaderContext);

    // Función para obtener el nombre según el rol
    const getUserName = (userId: number) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return "Usuario";

        if (user.rol === "student") {
            return user.student?.name || user.name;
        } else if (user.rol === "company") {
            return user.company?.name || user.name;
        } else if (user.rol === "institutions") {
            return user.institution?.name || user.name;
        }
        return user.name;
    };

    // Fetch saved publications when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchSavedPublications();
        }
    }, [isOpen]);

    const fetchSavedPublications = async () => {
        try {
            setIsLoading(true);
            showLoader(); // Mostrar loader al iniciar la carga
            const response = await apiRequest('/publications/saved', 'GET');

            if (response.status === 'success') {
                const publicationsWithState = response.data.map((pub: Publication) => ({
                    ...pub,
                    liked: pub.likes?.some(like => like.user_id === userData?.id) || false,
                    saved: pub.saved_by?.some(saved => saved.user_id === userData?.id) || false
                }));
                setSavedPublications(publicationsWithState);
            } else {
                setError('Error al cargar las publicaciones guardadas');
            }
        } catch (err) {
            console.error('Error al cargar las publicaciones guardadas:', err);
            setError('Error al cargar las publicaciones guardadas');
        } finally {
            setIsLoading(false);
            hideLoader(); // Ocultar loader al finalizar la carga
        }
    };

    const handleUnsave = async (publicationId: number) => {
        try {
            showLoader(); // Mostrar loader al iniciar la acción
            const response = await apiRequest(`/publications/${publicationId}/save`, 'POST');

            if (response.status === 'success') {
                // Remove the unsaved publication from the list
                setSavedPublications(prevPublications =>
                    prevPublications.filter(pub => pub.id !== publicationId)
                );
            }
        } catch (err) {
            console.error('Error al quitar la publicación guardada:', err);
        } finally {
            hideLoader(); // Ocultar loader al finalizar la acción
        }
    };

    const handleLike = async (publicationId: number) => {
        try {
            showLoader(); // Mostrar loader al iniciar la acción
            const response = await apiRequest(`/publications/${publicationId}/like`, 'POST');

            if (response.status === 'success') {
                // Update the publication's like status in the list
                setSavedPublications(prevPublications =>
                    prevPublications.map(pub =>
                        pub.id === publicationId
                            ? {
                                ...pub,
                                likes_count: response.likes_count,
                                liked: response.liked,
                                likes: response.liked 
                                    ? [...(pub.likes || []), { user_id: userData?.id || 0 }]
                                    : (pub.likes || []).filter(like => like.user_id !== userData?.id)
                            }
                            : pub
                    )
                );
            }
        } catch (err) {
            console.error('Error al dar like a la publicación:', err);
        } finally {
            hideLoader(); // Ocultar loader al finalizar la acción
        }
    };

    // Get user avatar based on role
    const getUserAvatar = (userId: number) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return "/default-avatar.png";

        if (user.rol === "student" && user.student?.photo_pic) {
            return user.student.photo_pic.startsWith('http') ? user.student.photo_pic : `${config.storageUrl}${user.student.photo_pic}`;
        } else if (user.rol === "company" && user.company?.logo) {
            return user.company.logo.startsWith('http') ? user.company.logo : `${config.storageUrl}${user.company.logo}`;
        } else if (user.rol === "institutions" && user.institution?.logo) {
            return user.institution.logo.startsWith('http') ? user.institution.logo : `${config.storageUrl}${user.institution.logo}`;
        }
        return "/default-avatar.png";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Publicaciones Guardadas</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {isLoading ? (
                        <div className="p-4 text-center">Cargando publicaciones...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : savedPublications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No tienes publicaciones guardadas
                        </div>
                    ) : (
                        savedPublications.map((publication) => (
                            <div key={publication.id} className="p-4 border-b">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                        <Image
                                            src={getUserAvatar(publication.user.id)}
                                            alt={publication.user.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{getUserName(publication.user.id)}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{new Date(publication.created_at).toLocaleDateString()}</span>
                                            {publication.location && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span>{publication.location}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-800 mb-4">{publication.content}</p>

                                {publication.has_media && publication.media && publication.media.length > 0 && (
                                    <div className="mb-4">
                                        {publication.media[0].media_type === "image" ? (
                                            <div className="relative h-64 w-full">
                                                <Image
                                                    src={publication.media[0].file_path.startsWith('http')
                                                        ? publication.media[0].file_path
                                                        : `${config.storageUrl}${publication.media[0].file_path}`}
                                                    alt="Imagen de publicación"
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    unoptimized={true}
                                                />
                                            </div>
                                        ) : (
                                            <video
                                                src={publication.media[0].file_path.startsWith('http')
                                                    ? publication.media[0].file_path
                                                    : `${config.storageUrl}${publication.media[0].file_path}`}
                                                controls
                                                className="w-full h-64 object-cover rounded-lg"
                                                playsInline
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-gray-500">
                                    <button
                                        onClick={() => handleLike(publication.id)}
                                        className={`flex items-center gap-1 transition-all duration-200 ${publication.liked ? 'text-red-500' : 'hover:text-red-500'
                                            }`}
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${publication.liked ? 'fill-current scale-110' : ''
                                                }`}
                                        />
                                        <span>{publication.likes_count}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-600">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{publication.comments_count}</span>
                                    </button>
                                    <button
                                        onClick={() => handleUnsave(publication.id)}
                                        className="flex items-center gap-1 text-yellow-500 hover:text-yellow-600"
                                    >
                                        <Bookmark className="w-5 h-5 fill-current" />
                                        <span>Quitar</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-600">
                                        <Share2 className="w-5 h-5" />
                                        <span>Compartir</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavePublications;
