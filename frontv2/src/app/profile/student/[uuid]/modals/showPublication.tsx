import React, { useState } from 'react';
import {
    X,
    Calendar,MapPin, Briefcase, Clock, Users, CreditCard, CheckCircle, XCircle, Loader2,
    Heart, MessageCircle, Bookmark,
    ChevronDown, ChevronUp, Ellipsis 
} from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import config from "@/types/config";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { addDays, format, formatDistanceToNow } from "date-fns"
import { es } from 'date-fns/locale';


interface PropsModal {
    publication: any;
    student: any;
    onClose: () => void;
}

export default function ShowPublication({ publication, student, onClose }: PropsModal) {
    const [loading, setLoading] = useState(false);
    const [publicationEdit, setPublicationEdit] = useState(publication);
    const [studentEdit, setStudentEdit] = useState(student);


    // Verificar si la publicación tiene imágenes
    const hasMedia = publicationEdit?.media && publicationEdit?.media.length > 0;
    const hasMultipleMedia = publicationEdit?.media && publicationEdit?.media.length > 1;


    // Estado para controlar qué comentarios tienen las respuestas expandidas
    const [expandedComments, setExpandedComments] = useState<any>({});

    // Función para toggle el estado de expansión de un comentario
    const toggleReplies = (commentId: number) => {
        setExpandedComments((prev: any) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Función para obtener la URL de la imagen de perfil según el rol
    const getProfileImageUrl = (user: any) => {
        if (user?.rol === 'student') {
            return `${config.storageUrl}${user.student?.photo_pic}`;
        } else if (user?.rol === 'company') {
            return `${config.storageUrl}/${user.company?.logo}`;
        } else {
            return `${config.storageUrl}/${user.institutions?.logo}`;
        }
    };

    // Función para obtener el nombre del usuario según el rol
    const getUserName = (user: any) => {
        if (user?.rol === 'student') {
            return user.student?.name;
        } else if (user?.rol === 'company') {
            return user.company?.name;
        } else {
            return user.institutions?.name;
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white w-full ${hasMedia ? 'max-w-4xl' : 'max-w-xl'} flex flex-col md:flex-row max-h-screen md:h-auto rounded-md overflow-hidden shadow-xl`}
                onClick={e => e.stopPropagation()}
            >
                {/* Botón cerrar (X) - Posicionado absolutamente en la esquina superior derecha */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="h-6 w-6 text-gray-500" />
                </button>

                {/* En móvil primero aparecerá la cabecera, luego la imagen y finalmente el resto del contenido */}
                {/* Cabecera - Visible solo en móvil en este punto */}
                <div className="flex md:hidden items-center p-4 border-b w-full">
                    <Avatar className="h-8 w-8">
                        <img
                            src={getProfileImageUrl(publicationEdit.user_details)}
                            alt="Author"
                            className="h-full w-full object-cover rounded-full"
                        />
                    </Avatar>
                    <div className="ml-3 font-semibold">{getUserName(publicationEdit.user_details)}</div>
                </div>

                {/* Imagen o Carousel (se muestra solo si hay media) */}
                {hasMedia && (
                    <div
                        className="w-full md:w-7/12 flex items-center justify-center h-auto md:h-full order-2 md:order-1">
                        {hasMultipleMedia ? (
                            // Mostrar carousel si hay múltiples imágenes
                            <Carousel className="w-full max-w-md relative">
                                <CarouselContent>
                                    {publicationEdit.media.map((picture: any, index: number) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1 flex aspect-square items-center justify-center p-6">
                                                <img
                                                    src={picture.file_path}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2" />
                                <CarouselNext className="right-1 top-1/2 -translate-y-1/2" />
                            </Carousel>
                        ) : (
                            // Mostrar una sola imagen si solo hay una
                            <div className="aspect-square flex items-center justify-center"
                            >
                                <img
                                    src={publicationEdit.media[0].file_path}
                                    alt="Contenido de la publicación"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Lado derecho - Comentarios */}
                <div className={`w-full ${hasMedia ? 'md:w-5/12' : 'md:w-full'} flex flex-col order-3 md:order-2`}>
                    {/* Cabecera - Visible solo en desktop */}
                    <div className="hidden md:flex items-center p-4 border-b">
                        <Avatar className="h-8 w-8">
                            <img
                                src={getProfileImageUrl(publicationEdit.user_details)}
                                alt="Author"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </Avatar>
                        <div className="ml-3 font-semibold">{getUserName(publicationEdit.user_details)}</div>
                        <div className="ml-3">
                            <button>
                                <Ellipsis className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Área de comentarios */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {publicationEdit.content ? (
                            <div className="flex mb-4">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <img
                                        src={getProfileImageUrl(publicationEdit.user_details)}
                                        alt="Author"
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                </Avatar>
                                <div className="ml-3">
                                    <span className="font-semibold mr-2">{getUserName(publicationEdit.user_details)}</span>
                                    <span>{publicationEdit.content}</span>
                                </div>
                            </div>
                        ) : null}


                        {/* Comentarios con scroll */}
                        <div className="max-h-64 md:max-h-80 overflow-y-auto pr-2">
                            {publicationEdit.comments && publicationEdit.comments.length > 0 ? (
                                publicationEdit.comments.map((comment: any) => (
                                    <div key={comment.id}>
                                        <div className="flex mb-4">
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                <img
                                                    src={getProfileImageUrl(comment.user)}
                                                    alt="Commenter"
                                                    className="h-full w-full object-cover rounded-full"
                                                />
                                            </Avatar>
                                            <div className="ml-3 flex-1">
                                                <span
                                                    className="font-semibold mr-2">
                                                    {getUserName(comment.user)}
                                                </span>
                                                <span className="break-words">{comment.content}</span>
                                            </div>
                                        </div>

                                        {/* Respuestas a los comentarios */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-10">
                                                {expandedComments[comment.id] ? (
                                                    // Mostrar todas las respuestas cuando está expandido
                                                    <>
                                                        {comment.replies.map((reply: any) => (
                                                            <div key={reply.id} className="flex mb-4">
                                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                                    <img
                                                                        src={getProfileImageUrl(reply.user)}
                                                                        alt="Replier"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="ml-3 flex-1">
                                                                    <span className="font-semibold mr-2">{getUserName(reply.user)}</span>
                                                                    <span className="break-words">{reply.content}</span>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Botón para colapsar las respuestas */}
                                                        <button
                                                            onClick={() => toggleReplies(comment.id)}
                                                            className="text-blue-600 hover:text-blue-800 flex items-center text-sm ml-8 mb-2"
                                                        >
                                                            <ChevronUp size={16} className="mr-1" />
                                                            Ocultar respuestas
                                                        </button>
                                                    </>
                                                ) : (
                                                    // Mostrar solo la primera respuesta y el botón "Ver más" cuando está colapsado
                                                    <>
                                                        {comment.replies.length > 0 && (
                                                            <div className="flex mb-4">
                                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                                    <img
                                                                        src={getProfileImageUrl(comment.replies[0].user)}
                                                                        alt="Replier"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="ml-3 flex-1">
                                                                    <span className="font-semibold mr-2">
                                                                        {getUserName(comment.replies[0].user)}
                                                                    </span>
                                                                    <span className="break-words">{comment.replies[0].content}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Botón Ver más respuestas */}
                                                        {comment.replies.length > 1 && (
                                                            <button
                                                                onClick={() => toggleReplies(comment.id)}
                                                                className="text-blue-600 hover:text-blue-800 flex items-center text-sm ml-8 mb-2"
                                                            >
                                                                <ChevronDown size={16} className="mr-1" />
                                                                Ver {comment.replies.length - 1} respuestas más
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                ))
                            ) : (
                                <div className="flex mb-4">
                                    <div className="text-gray-500 text-sm">Todavía no hay comentarios</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de likes */}
                    <div className="p-4 border-t">
                        <div className="flex mb-2">
                            <button className="mr-4">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="mr-4">
                                <MessageCircle className="h-5 w-5" />
                            </button>
                            <button>
                                <Bookmark className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="font-semibold">{publicationEdit.likes_count || 0} likes</div>
                            <div className="text-xs text-gray-500">
                                {format(publicationEdit.created_at, 'dd/MM/yyyy')}
                            </div>
                        </div>

                    </div>

                    {/* Input de comentario */}
                    <div className="p-4 border-t">
                        <input
                            type="text"
                            placeholder="Agrega un comentario..."
                            className="w-full outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}