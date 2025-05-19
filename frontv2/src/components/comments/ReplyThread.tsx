import { Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import config from "@/types/config";
import { formatDistanceStrict } from "date-fns";
import { es } from 'date-fns/locale';
import { useState } from "react";

interface ReplyProps {
    reply: any;
    handleReplyClick: (reply: any) => void;
}

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

const ReplyThread = ({ reply, handleReplyClick }: ReplyProps) => {
    // Estado para controlar si se muestran las respuestas
    const [showReplies, setShowReplies] = useState(false);
    
    // Comprobamos si hay respuestas y cuántas hay
    const hasReplies = reply.replies && reply.replies.length > 0;
    const repliesCount = reply.replies ? reply.replies.length : 0;

    return (
        <div className="mb-4">
            {/* Comentario principal */}
            <div className="flex">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <img
                        src={getProfileImageUrl(reply.user)}
                        alt="User"
                        className="h-full w-full object-cover rounded-full"
                    />
                </Avatar>
                <div className="ml-3 flex-1">
                    <span className="font-semibold mr-2">{getUserName(reply.user)}</span>
                    <span className="break-words">{reply.content}</span>
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReplyThread;