import { Reply, ChevronDown, ChevronUp, MoreHorizontal, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import config from "@/types/config";
import { formatDistanceStrict } from "date-fns";
import { es } from 'date-fns/locale';
import { useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";
import { useRouter } from "next/navigation";

interface ReplyProps {
    reply: any;
    handleReplyClick: (reply: any) => void;
    fetchComments: () => void;
}


const ReplyThread = ({ reply, handleReplyClick, fetchComments }: ReplyProps) => {
    // Estado para controlar si se muestran las respuestas
    const [showReplies, setShowReplies] = useState(false);

    // Comprobamos si hay respuestas y cuántas hay
    const hasReplies = reply.replies && reply.replies.length > 0;
    const repliesCount = reply.replies ? reply.replies.length : 0;

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const { userData, allUsers, setAllUsers } = useContext(AuthContext);

    const { showLoader, hideLoader } = useContext(LoaderContext);

    const router = useRouter();



    const handleDeleteComment = async (commentId: number) => {
        showLoader();
        try {
            const response = await apiRequest(`publications/${reply.publication_id}/comments/${commentId}`, 'DELETE');
            if (response.status === 'success') {
                fetchComments();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            hideLoader();
        }

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


    const goToUserProfile = (user: any) => {
        if (user?.rol === 'student') {
            showLoader();
            setTimeout(() => {
                hideLoader();
            }, 1000);
            router.push(`/profile/student/${user.student?.uuid}`);

        } else if (user?.rol === 'company') {
            showLoader();
            setTimeout(() => {
                hideLoader();
            }, 1000);
            router.push(`/profile/company/${user.company?.slug}`);
        } else {
            showLoader();
            setTimeout(() => {
                hideLoader();
            }, 1000);
            router.push(`/profile/institution/${user.institutions?.slug}`);
        }
    };

    return (
        <div className="mb-4">
            {/* Comentario principal */}
            <div className="flex">
                <Avatar className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0 cursor-pointer"
                    onClick={() => goToUserProfile(reply.user)}>
                    <img
                        src={getProfileImageUrl(reply.user)}
                        alt="User"
                        className="h-full w-full object-cover rounded-full"
                    />
                </Avatar>
                <div className="ml-3 flex-1">
                    <span className="font-semibold mr-2 text-sm cursor-pointer" onClick={() => goToUserProfile(reply.user)}>{getUserName(reply.user)}</span>

                    <div className="flex justify-between items-start w-full">
                        <span className="break-words text-sm">{reply.content}</span>

                        {userData?.id === reply.user_id && (
                            <div className="relative ml-2">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === reply.id ? null : reply.id)}
                                    className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>

                                {openMenuId === reply.id && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                handleDeleteComment(reply.id);
                                                setOpenMenuId(null);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <span className="text-xs text-gray-500 ml-2">
                        {formatDistanceStrict(new Date(reply.created_at), new Date(), { locale: es })}
                    </span>

                    <div className="mt-1 flex gap-3">
                        {/* Botón de responder */}
                        <button
                            onClick={() => handleReplyClick(reply)}
                            className="text-gray-500 hover:text-blue-600 text-xs flex items-center"
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Responder
                        </button>

                        {/* Botón de ver/ocultar respuestas - solo se muestra si hay respuestas */}
                        {hasReplies && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                            >
                                {showReplies ? (
                                    <>
                                        <ChevronUp size={16} className="mr-1" />
                                        Ocultar respuestas
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} className="mr-1" />
                                        Ver respuestas ({repliesCount})
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Subrespuestas - solo se muestran si showReplies es true */}
            {hasReplies && showReplies && (
                <div className="mt-2 border-l border-gray-200 pl-3">
                    {reply.replies.map((subReply: any) => (
                        <ReplyThread
                            key={subReply.id}
                            reply={subReply}
                            handleReplyClick={handleReplyClick}
                            fetchComments={fetchComments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReplyThread;