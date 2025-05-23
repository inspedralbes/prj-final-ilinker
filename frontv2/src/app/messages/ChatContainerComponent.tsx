import React, { useEffect, useState } from "react";
import {
  BookMarked,
  Check,
  CheckCheck,
  PenSquare,
  Save,
  Send,
  Star,
} from "lucide-react";
import { apiRequest } from "@/services/requests/apiRequest";
import { toast } from "@/hooks/use-toast";
import { useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext";
import socket from "@/services/websockets/sockets";
import clsx from "clsx";

interface UserProfile {
  rol: "student" | "company" | "institution";
  student?: { photo_pic?: string; name?: string };
  company?: { logo?: string; name?: string };
  institution?: { logo?: string; name?: string };
  id?: number;
  user_two_id?: number;
  is_bookmarked_user_two?: boolean;
  is_bookmarked_user_one?: boolean;
  is_saved_user_two?: boolean;
  is_saved_user_one?: boolean;
  [key: string]: any;
}

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ChatData {
  direct_chat?: {
    user?: UserProfile;
    user_two_id?: number;
    is_bookmarked_user_two?: boolean;
    is_bookmarked_user_one?: boolean;
    is_saved_user_two?: boolean;
    is_saved_user_one?: boolean;
    [key: string]: any;
  };
  messages?: { data: Message[] };
}

interface ChatContainerProps {
  selectedChatData?: ChatData;
  userData?: { id?: number };
  formatTime: (iso: string) => string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  selectedChatData,
  userData,
  formatTime,
}) => {
  const profile = selectedChatData?.direct_chat?.user;
  const userId = userData?.id;
  // Dentro de tu componente…
  const senderId = selectedChatData?.messages?.data[0]?.sender_id;
  const isUserTwo = selectedChatData?.direct_chat?.user_two_id === senderId;

  // Sacamos en una variable si está “guardado” según el usuario
  const isBookMarked = isUserTwo
    ? selectedChatData?.direct_chat?.is_bookmarked_user_two
    : selectedChatData?.direct_chat?.is_bookmarked_user_one;

  const isSaved = isUserTwo
    ? selectedChatData?.direct_chat?.is_saved_user_two
    : selectedChatData?.direct_chat?.is_saved_user_one;

  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [message, setMessage] = useState("");

  type StudentKeys = keyof NonNullable<UserProfile["student"]>;
  type CompanyKeys = keyof NonNullable<UserProfile["company"]>;
  type InstitutionKeys = keyof NonNullable<UserProfile["institution"]>;

  const getProfileValue = (
    key: StudentKeys | CompanyKeys | InstitutionKeys
  ) => {
    if (!profile) return "";

    switch (profile.rol) {
      case "student":
        return profile.student?.[key as StudentKeys] ?? "";
      case "company":
        return profile.company?.[key as CompanyKeys] ?? "";
      case "institution":
        return profile.institution?.[key as InstitutionKeys] ?? "";
      default:
        return "";
    }
  };

  const handleSendMessage = () => {
    console.log("ENVIAR MENSAJE");

    apiRequest("chats/send-direct-chat", "POST", {
      user_ids: [selectedChatData?.direct_chat?.user?.id],
      content: message,
    })
      .then((response) => {
        console.log(response);
        if (response.status === "success") {
          selectedChatData?.messages?.data.push(response.dataChat.message);
          socket.emit("send_direct_message", {
            messageData: response.dataChat?.message,
            recipient_id: response.dataChat?.recipient_id,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje",
          variant: "destructive",
        });
      })
      .finally(() => {
        setMessage("");
      });
  };

  const handleSavedChat = () => {
    console.log("MARCAR CHAT");
    console.log(selectedChatData);
    const directChatId = selectedChatData?.direct_chat?.id;
    if (!directChatId) return;

    apiRequest(`chats/bookmarked/${directChatId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  const handleBookMarkedChat = () => {
    console.log("GUARDAR CHAT");
    console.log(selectedChatData);
    const directChatId = selectedChatData?.direct_chat?.id;
    if (!directChatId) return;

    apiRequest(`chats/saved/${directChatId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between">
        <div className="flex items-center">
          <img
            src={getProfileValue("photo_pic") || getProfileValue("logo")}
            alt="Chat avatar"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <h3 className="font-bold">{getProfileValue("name")}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={clsx("p-2 rounded-lg transition-colors duration-300", {
              // Si está guardado, fondo dorado claro y icono amarillo oscuro:
              "bg-yellow-100 hover:bg-yellow-200": isBookMarked,
              // Si no, gris habitual:
              "bg-transparent hover:bg-gray-300": !isBookMarked,
            })}
            onClick={handleSavedChat}
          >
            <Star
              className={clsx("w-5 h-5 transition-colors duration-300", {
                "text-yellow-500": isBookMarked,
                "text-black": !isBookMarked,
              })}
            />
          </button>
          {/* Botón “BookMarked” actualizado para usar la misma lógica */}
          <button
            className={clsx("p-2 rounded-lg transition-colors duration-300", {
              // Si está guardado, fondo dorado claro:
              "bg-yellow-100 hover:bg-yellow-200": isSaved,
              // Si no, fondo transparente
              "bg-transparent hover:bg-gray-300": !isSaved,
            })}
            onClick={() => handleBookMarkedChat()}
          >
            <BookMarked
              className={clsx("w-5 h-5 transition-colors duration-300", {
                "text-yellow-500": isSaved,
                "text-black": !isSaved,
              })}
            />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {selectedChatData?.messages?.data.map((message) => {
          const isMine = message.sender_id === userId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  `relative p-3 max-w-[60%] break-words rounded-xl shadow-sm flex flex-col ` +
                  (isMine ? "bg-black text-white" : "bg-gray-200 text-gray-800")
                }
              >
                <p className="mb-1">{message.content}</p>
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs opacity-75">
                    {formatTime(message.created_at)}
                  </span>
                  {isMine &&
                    (!message.is_read ? (
                      <Check className="h-4 w-4 text-gray-400 opacity-75" />
                    ) : (
                      <CheckCheck className="h-4 w-4 text-blue-500 opacity-90" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            onClick={() => handleSendMessage()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
