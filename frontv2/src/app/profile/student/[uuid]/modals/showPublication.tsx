import React, {useState} from 'react';
import {
    X,
    Calendar,
    MapPin,
    Briefcase,
    Clock,
    Users,
    CreditCard,
    CheckCircle,
    XCircle,
    Loader2,
    Heart, MessageCircle, Bookmark
} from 'lucide-react';
import {Avatar} from "@/components/ui/avatar";
import config from "@/types/config";
import {format} from "date-fns"
import {Card, CardContent} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


interface PropsModal {
    publication: any;
    student: any;
    onClose: () => void;
}

export default function ShowPublication({publication, student, onClose}: PropsModal) {
    const [loading, setLoading] = useState(false);
    const [publicationEdit, setPublicationEdit] = useState(publication);
    const [studentEdit, setStudentEdit] = useState(student);


    // Verificar si la publicación tiene imágenes
    const hasMedia = publicationEdit?.media && publicationEdit?.media.length > 0;
    const hasMultipleMedia = publicationEdit?.media && publicationEdit?.media.length > 1;


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
                    <X className="h-6 w-6 text-gray-500"/>
                </button>

                {/* En móvil primero aparecerá la cabecera, luego la imagen y finalmente el resto del contenido */}
                {/* Cabecera - Visible solo en móvil en este punto */}
                <div className="flex md:hidden items-center p-4 border-b w-full">
                    <Avatar className="h-8 w-8">
                        <img
                            src={publicationEdit.user_details?.rol === 'student' ?
                                publicationEdit.user_details?.student.photo_pic
                                : publicationEdit.user_details?.rol === 'company' ?
                                    publicationEdit.user_details?.company.logo
                                    : publicationEdit.user_details?.institutions.logo}
                            alt="Author"
                            className="h-full w-full object-cover rounded-full"
                        />
                    </Avatar>
                    <div className="ml-3 font-semibold">{publicationEdit.user_details?.rol === 'student' ?
                        publicationEdit.user_details?.student.name
                        : publicationEdit.user_details?.rol === 'company' ?
                            publicationEdit.user_details?.company.name
                            : publicationEdit.user_details?.institutions.name}</div>
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
                                <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2"/>
                                <CarouselNext className="right-1 top-1/2 -translate-y-1/2"/>
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
                                src={publicationEdit.user_details?.rol === 'student' ?
                                    publicationEdit.user_details?.student.photo_pic
                                    : publicationEdit.user_details?.rol === 'company' ?
                                        publicationEdit.user_details?.company.logo
                                        : publicationEdit.user_details?.institutions.logo}
                                alt="Author"
                                className="h-full w-full object-cover rounded-full"
                            />
                        </Avatar>
                        <div className="ml-3 font-semibold">{publicationEdit.user_details?.rol === 'student' ?
                            publicationEdit.user_details?.student.name
                            : publicationEdit.user_details?.rol === 'company' ?
                                publicationEdit.user_details?.company.name
                                : publicationEdit.user_details?.institutions.name}</div>
                    </div>

                    {/* Área de comentarios */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {publicationEdit.content ? (
                            <div className="flex mb-4">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <img
                                        src={publicationEdit.user_details?.rol === 'student' ?
                                            publicationEdit.user_details?.student.photo_pic
                                            : publicationEdit.user_details?.rol === 'company' ?
                                                publicationEdit.user_details?.company.logo
                                                : publicationEdit.user_details?.institutions.logo}
                                        alt="Author"
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                </Avatar>
                                <div className="ml-3">
                                    <span className="font-semibold mr-2">{publicationEdit.user_details?.rol === 'student' ?
                                        publicationEdit.user_details?.student.name
                                        : publicationEdit.user_details?.rol === 'company' ?
                                            publicationEdit.user_details?.company.name
                                            : publicationEdit.user_details?.institutions.name}</span>
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
                                                    src={
                                                        comment.user?.rol === 'student'
                                                            ? `${config.storageUrl}students/photos/${comment.user.student?.uuid}/${comment.user.student?.photo_pic}`
                                                            : comment.user?.rol === 'company'
                                                                ? `${config.storageUrl}/${comment.user.company?.logo}`
                                                                : `${config.storageUrl}/${comment.user.institutions?.logo}`
                                                    }
                                                    alt="Commenter"
                                                    className="h-full w-full object-cover rounded-full"
                                                />
                                            </Avatar>
                                            <div className="ml-3 flex-1">
                                                    <span
                                                        className="font-semibold mr-2">
                                                        {comment.user?.rol === 'student'
                                                            ? comment.user.student.name
                                                            : comment.user?.rol === 'company'
                                                                ? comment.user.company.name
                                                                : comment.user.institutions.name}
                                                    </span>
                                                <span className="break-words">{comment.content}</span>
                                            </div>
                                        </div>

                                        {/* PARA MENSAJE RESPONDIDOS*/}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <>
                                                {comment.replies.lenght > 1 ? (
                                                    <div className="ml-6 mt-2">
                                                        {comment.replies.map((reply: any) => (
                                                            <div key={reply.id} className="flex mb-4">
                                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                                    <img
                                                                        src={
                                                                            reply.user?.rol === 'student'
                                                                                ? `${config.storageUrl}users/photos/${reply.user.student?.uuid}/${reply.user.student?.photo_pic}`
                                                                                : reply.user?.rol === 'company'
                                                                                    ? `${config.storageUrl}/${reply.user.company?.logo}`
                                                                                    : `${config.storageUrl}/${reply.user.institutions?.logo}`
                                                                        }
                                                                        alt="Commenter"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="ml-3 flex-1">
                                                             <span
                                                                 className="font-semibold mr-2">
                                                                {reply.user?.rol === 'student'
                                                                    ? reply.user.student.name
                                                                    : reply.user?.rol === 'company'
                                                                        ? reply.user.company.name
                                                                        : reply.user.institutions.name}
                                                             </span>
                                                                    <span className="break-words">{reply.content}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        Ver más {comment.replies.length}
                                                    </div>
                                                )}
                                            </>

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
                                <Heart className="h-5 w-5"/>
                            </button>
                            <button className="mr-4">
                                <MessageCircle className="h-5 w-5"/>
                            </button>
                            <button>
                                <Bookmark className="h-5 w-5"/>
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