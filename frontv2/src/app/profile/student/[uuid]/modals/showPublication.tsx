import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    X,
    Calendar, MapPin, Briefcase, Clock, Users, CreditCard, CheckCircle, XCircle, Loader2,
    Heart, MessageCircle, Bookmark,
    ChevronDown, ChevronUp, Ellipsis,
    Send, Reply
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
import { addDays, format, formatDistanceToNow, formatDistanceStrict } from "date-fns"
import { es } from 'date-fns/locale';
import { apiRequest } from "@/services/requests/apiRequest";
import ReplyThread from "@/components/comments/ReplyThread";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";

interface PropsModal {
    publication: any;
    student: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function ShowPublication({ publication, student, onClose, onSave }: PropsModal) {
    const [publicationEdit, setPublicationEdit] = useState(publication);
    const [error, setError] = useState<string | null>(null);
    const commentInputRef = useRef<HTMLInputElement>(null);

    // Verificar si la publicación tiene imágenes
    const hasMedia = publicationEdit?.media && publicationEdit?.media.length > 0;
    const hasMultipleMedia = publicationEdit?.media && publicationEdit?.media.length > 1;

    // Estado para controlar qué comentarios tienen las respuestas expandidas
    const [expandedComments, setExpandedComments] = useState<any>({});

    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<any>(null);

    const { userData, allUsers, setAllUsers } = useContext(AuthContext);

    const { showLoader, hideLoader } = useContext(LoaderContext);


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

    const handleLike = async (id: number) => {
        try {
            const response = await apiRequest(`/publications/${id}/like`, 'POST');
            console.log('Respuesta del like:', response);

            if (response.status === 'success') {
                // Actualizar el estado de las publicaciones con la nueva información del like
                setPublicationEdit({
                    ...publicationEdit,
                    likes_count: response.likes_count,
                    liked: response.liked
                });

                onSave(publicationEdit.id);
            }
        } catch (err) {
            console.error('Error al dar like a la publicación:', err);
            setError('Error al dar like a la publicación');
        }
    }

    const fetchComments = async () => {
        try {
            showLoader();
            const response = await apiRequest(`publications/${publicationEdit?.id}/comments`, 'GET');
            if (response.status === 'success' && Array.isArray(response.data)) {
                console.log("COMMENTS");
                console.log(response.data);
                setPublicationEdit({
                    ...publicationEdit,
                    comments: response.data
                });
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            hideLoader();
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await apiRequest(`publications/${publicationEdit?.id}/comments`, 'POST', {
                content: newComment,
                parent_comment_id: replyingTo?.id || null
            });

            if (response.status === 'success') {
                fetchComments();
                setNewComment("");
                setReplyingTo(null);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    // Función para iniciar respuesta a un comentario
    const handleReplyClick = (comment: any) => {
        console.log("comment");
        console.log(comment);
        setReplyingTo(comment);
        setNewComment(`@${getUserName(comment.user)} `);
        // Enfocar el input de comentario
        commentInputRef.current?.focus();
        commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Función para cancelar respuesta
    const cancelReply = () => {
        setReplyingTo(null);
        setNewComment("");
    };


    const handleSavePublication = async (id: number) => {
        try {
            showLoader();
            const response = await apiRequest(`/publications/${id}/save`, 'POST');
            console.log('Respuesta del guardado:', response);

            if (response.status === 'success') {
                // Actualizar solo el estado de guardado
                setPublicationEdit((prev: any) => {
                    if (
                        (prev.shared && prev.original_publication_id === id) ||
                        prev.id === id
                    ) {
                        return {
                            ...prev,
                            saved: response.saved,
                            saved_by: response.saved
                                ? [...(prev.saved_by || []), { user_id: userData?.id || 0 }]
                                : (prev.saved_by || []).filter(
                                    (saved: any) => saved.user_id !== userData?.id
                                ),
                        };
                    }

                    // Si no se cumple la condición, se retorna el estado anterior sin cambios
                    return prev;
                });

            }
        } catch (err) {
            console.error('Error al guardar la publicación:', err);
        } finally {
            hideLoader();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white w-full ${hasMedia ? 'max-w-4xl' : 'max-w-xl'} flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] rounded-md overflow-hidden shadow-xl`}
                onClick={e => e.stopPropagation()}
            >
                {/* Botón cerrar (X) - Posicionado absolutamente en la esquina superior derecha */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                {/* Cabecera - Visible solo en móvil en este punto */}
                <div className="flex md:hidden items-center p-3 border-b w-full bg-white">
                    <Avatar className="h-6 w-6">
                        <img
                            src={getProfileImageUrl(publicationEdit?.user_details)}
                            alt="Author"
                            className="h-full w-full object-cover rounded-full"
                        />
                    </Avatar>
                    <div className="ml-2 font-semibold text-sm">{getUserName(publicationEdit?.user_details)}</div>
                </div>

                {/* Imagen o Carousel (se muestra solo si hay media) */}
                {hasMedia && (
                    <div
                        className="w-full md:w-7/12 flex items-center justify-center h-auto max-h-[40vh] md:max-h-[90vh] md:h-full order-2 md:order-1"
                    >
                        {hasMultipleMedia ? (
                            // Mostrar carousel si hay múltiples imágenes
                            <Carousel className="w-full max-w-md relative">
                                <CarouselContent>
                                    {publicationEdit.media.map((picture: any, index: number) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1 flex aspect-square items-center justify-center">
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
                            <div className="flex items-center justify-center h-full w-full">
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
                <div className={`w-full ${hasMedia ? 'md:w-5/12' : 'md:w-full'} flex flex-col order-3 md:order-2 max-h-[55vh] md:max-h-[90vh]`}>
                    {/* Cabecera - Visible solo en desktop */}
                    <div className="hidden md:flex items-center p-3 border-b">
                        <Avatar className="h-7 w-7">
                            <img
                                src={getProfileImageUrl(publicationEdit.user_details)}
                                alt="Author"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </Avatar>
                        <div className="ml-2 font-semibold">{getUserName(publicationEdit.user_details)}</div>
                        <div className="ml-auto">
                            <button>
                                <Ellipsis className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Área de comentarios */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {publicationEdit.content ? (
                            <div className="flex mb-3">
                                <Avatar className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0">
                                    <img
                                        src={getProfileImageUrl(publicationEdit.user_details)}
                                        alt="Author"
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                </Avatar>
                                <div className="ml-2">
                                    <span className="font-semibold mr-1 text-sm">{getUserName(publicationEdit.user_details)}</span>
                                    <span className="text-sm">{publicationEdit.content}</span>
                                </div>
                            </div>
                        ) : null}

                        {/* Comentarios con scroll */}
                        <div className="max-h-[25vh] md:max-h-[60vh] overflow-y-auto pr-2">
                            {publicationEdit.comments && publicationEdit.comments.length > 0 ? (
                                publicationEdit.comments.map((comment: any) => (
                                    <div key={comment.id} className="mb-3">
                                        <div className="flex">
                                            <Avatar className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0">
                                                <img
                                                    src={getProfileImageUrl(comment.user)}
                                                    alt="Commenter"
                                                    className="h-full w-full object-cover rounded-full"
                                                />
                                            </Avatar>
                                            <div className="ml-2 flex-1">
                                                <span className="font-semibold mr-1 text-sm">
                                                    {getUserName(comment.user)}
                                                </span>
                                                <span className="break-words text-sm">{comment.content}</span>
                                                <span className="ml-1 text-xs text-gray-500">{formatDistanceStrict(new Date(comment.created_at), new Date(), { locale: es })}</span>

                                                {/* Agregar botón de responder */}
                                                <div className="mt-1">
                                                    <button
                                                        onClick={() => handleReplyClick(comment)}
                                                        className="text-gray-500 hover:text-blue-600 text-xs flex items-center"
                                                    >
                                                        <Reply className="h-3 w-3 mr-1" />
                                                        Responder
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Respuestas a los comentarios */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-5 md:ml-7">
                                                {/* Botón Ver respuestas / Ocultar respuestas */}
                                                <button
                                                    onClick={() => toggleReplies(comment.id)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center text-xs md:text-sm mb-1 mt-1"
                                                >
                                                    {expandedComments[comment.id] ? (
                                                        <>
                                                            <ChevronUp size={14} className="mr-1" />
                                                            Ocultar respuestas
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown size={14} className="mr-1" />
                                                            Ver {comment.replies.length} respuestas
                                                        </>
                                                    )}
                                                </button>

                                                {/* Solo mostrar las respuestas si están expandidas */}
                                                {expandedComments[comment.id] && comment.replies.map((reply: any) => (
                                                    <ReplyThread
                                                        key={reply.id}
                                                        reply={reply}
                                                        handleReplyClick={handleReplyClick}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="flex mb-3">
                                    <div className="text-gray-500 text-xs md:text-sm">Todavía no hay comentarios</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de likes */}
                    <div className="p-2 md:p-3 border-t">
                        <div className="flex justify-between mb-1">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => handleLike(publicationEdit.id)}
                                    >
                                        {publicationEdit.liked ? (
                                            <Heart className="h-5 w-5 text-red-500 hover:text-red-600" fill='red' />
                                        ) : (
                                            <Heart className="h-5 w-5 hover:text-red-600" />
                                        )}
                                    </button>
                                    <span className="text-sm">{publicationEdit.likes_count}</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => {
                                            commentInputRef.current?.focus();
                                            commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                    </button>
                                    <span className="text-sm">{publicationEdit.comments_count}</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button onClick={() => handleSavePublication(publicationEdit.id)}>
                                    {publicationEdit.saved ? (
                                        <Bookmark className="h-5 w-5 text-yellow-500" fill='yellow' />
                                    ) : (
                                        <Bookmark className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="font-semibold text-xs md:text-sm">{publicationEdit.likes_count || 0} likes</div>
                            <div className="text-xs text-gray-500">
                                {format(new Date(publicationEdit.created_at), 'dd/MM/yyyy')}
                            </div>
                        </div>
                    </div>

                    {/* Input de comentario con indicador de respuesta */}
                    <div className="p-2 md:p-3 border-t">
                        {/* Indicador de respuesta */}
                        {replyingTo && (
                            <div className="mb-2 flex items-center justify-between text-xs text-gray-600 bg-gray-100 p-1 md:p-2 rounded">
                                <div className="truncate">
                                    Respondiendo a <span className="font-semibold">{getUserName(replyingTo.user)}</span>
                                </div>
                                <button
                                    onClick={cancelReply}
                                    className="text-gray-500 hover:text-gray-800 flex-shrink-0 ml-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Input de comentario */}
                        <div className="flex items-center">
                            <input
                                ref={commentInputRef}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                type="text"
                                placeholder={replyingTo ? "Escribe tu respuesta..." : "Agrega un comentario..."}
                                className="w-full outline-none text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSubmitComment();
                                }}
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim()}
                                className="p-1 text-black hover:bg-black hover:text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}