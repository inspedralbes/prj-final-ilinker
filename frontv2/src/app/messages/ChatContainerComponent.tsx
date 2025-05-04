import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';
import { toast } from '@/hooks/use-toast';
import { useContext } from 'react';
import { LoaderContext } from '@/contexts/LoaderContext';
import socket from '@/services/websockets/sockets';

interface UserProfile {
  rol: 'student' | 'company' | 'institution';
  student?: { photo_pic?: string; name?: string };
  company?: { logo?: string; name?: string };
  institution?: { logo?: string; name?: string };
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
  };
  messages?: { data: Message[] };
}

interface ChatContainerProps {
  selectedChatData?: ChatData;
  userData?: { id?: number };
  formatTime: (iso: string) => string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ selectedChatData, userData, formatTime }) => {
  const profile = selectedChatData?.direct_chat?.user;
  const userId = userData?.id;
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [message, setMessage] = useState('');

  const getProfileValue = (key: keyof UserProfile['student'] | keyof UserProfile['company'] | keyof UserProfile['institution']) => {
    if (!profile) return '';
    switch (profile.rol) {
      case 'student':
        return profile.student?.[key] ?? '';
      case 'company':
        return profile.company?.[key] ?? '';
      case 'institution':
        return profile.institution?.[key] ?? '';
      default:
        return '';
    }
  };

  const handleSendMessage = () => {
  
      console.log("ENVIAR MENSAJE");
  
      apiRequest('chats/send-direct-chat',
        "POST",
        {
          user_ids: [selectedChatData?.direct_chat?.user?.id],
          content: message
        }
      ).then((response) => {
        console.log(response);
        if (response.status === "success") {
            selectedChatData?.messages?.data.push(response.dataChat.message);
            socket.emit('send_direct_message', {messageData: response.dataChat?.message, recipient_id: response.dataChat?.recipient_id});
        }
      }).catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje",
          variant: "destructive",
        });
      }).finally(() => {
        setMessage('');
      });
    }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={getProfileValue('photo_pic' as any) || getProfileValue('logo' as any)}
            alt="Chat avatar"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <h3 className="font-bold">
            {getProfileValue('name' as any)}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {selectedChatData?.messages?.data.map((message) => {
          const isMine = message.sender_id === userId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={
                  `relative p-3 max-w-[60%] break-words rounded-xl shadow-sm flex flex-col ` +
                  (isMine ? 'bg-black text-white' : 'bg-gray-200 text-gray-800')
                }
              >
                <p className="mb-1">{message.content}</p>
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs opacity-75">
                    {formatTime(message.created_at)}
                  </span>
                  {isMine && (
                    !message.is_read ? (
                      <Check className="h-4 w-4 text-gray-400 opacity-75" />
                    ) : (
                      <div className="flex -space-x-1">
                        <Check className="h-4 w-4 text-blue-500 opacity-90" />
                        <Check className="h-4 w-4 text-blue-500 opacity-90 translate-y-0.5" />
                      </div>
                    )
                  )}
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
          <button className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
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
