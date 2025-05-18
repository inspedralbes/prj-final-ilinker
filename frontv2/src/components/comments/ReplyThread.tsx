import { Reply } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import config from "@/types/config";

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
    return (
        <div className="mb-4">
            {/* Comentario */}
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
                    <span className="text-xs text-gray-500 ml-2">{reply.created_at}</span>

                    <div className="mt-1">
                        <button
                            onClick={() => handleReplyClick(reply)}
                            className="text-gray-500 hover:text-blue-600 text-xs flex items-center"
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Responder
                        </button>
                    </div>
                </div>
            </div>

            {/* Subrespuestas */}
            {reply.replies && reply.replies.length > 0 && (
                <div className=" border-l pl-4 border-gray-200">
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
