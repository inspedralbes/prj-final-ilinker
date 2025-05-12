"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  Search,
  MoreVertical,
  Send,
  Star,
  Mail,
  Users,
  Inbox,
  BookMarked,
  PenSquare,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { LoaderContext } from "@/contexts/LoaderContext";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/requests/apiRequest";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import Modal from "@/components/ui/modal";

interface SuggestedUser { 
  id: string; 
  uuid: string | null; 
  slug: string | null; 
  user_id: string; 
  name: string; 
  skills: string[]; 
  avatar: string | null; 
  type: "company" | "student"; 
} 

const suggestedUsers: SuggestedUser[] = [
  {
    id: "1",
    name: "Ana Martínez",
    role: "Full Stack Developer", 
    skills: ["React", "Node.js", "TypeScript"],
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    role: "UX Designer", 
    skills: ["UI/UX", "Figma", "Adobe XD"],
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  },
  {
    id: "3",
    name: "Laura García",
    role: "Frontend Developer", 
    skills: ["Vue.js", "CSS", "JavaScript"],
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
];

const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [suggestedAll, setSuggestedAll] = useState<SuggestedUser[]>([]);
  const [contacts, setContacts] = useState<SuggestedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [messageModal, setMessageModal] = useState("");
  const newMessageDirectModal = useModal();

  const router = useRouter();
  const { toast } = useToast();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { userData } = useContext(AuthContext);
  const mockChats = [
    {
      id: "1",
      name: "Ana Martínez",
      lastMessage: "Hola, ¿cómo estás?",
      time: "12:30",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      unread: true,
    },
    {
      id: "2",
      name: "Carlos Ruiz",
      lastMessage: "¿Podemos reunirnos mañana?",
      time: "10:15",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      unread: false,
    },
  ];

  useEffect(() => {
    showLoader();
    if (!userData) {
      router.push("/auth/login");
    }

    // Request for messages
    apiRequest("chats/my-direct-messages")
      .then((response) => {
        if (response.status === "success") {
          console.log(response);
          setChats(response.direct_chats);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        hideLoader();
      });
  }, [userData, router]);

  const handleOpenNewMessage = () => {
    showLoader();
    apiRequest("chats/suggested-direct-chat")
      .then((response) => {
        console.log(response);
        if (response.status === "success") {
          setSuggestedAll(response.suggested_all);
          setContacts(response.more_contacts);
        } else {
          toast({
            title: "Error",
            description: "No se encontraron sugerencias",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Error",
          description: "No se encontraron sugerencias",
          variant: "destructive",
        });
      })
      .finally(() => {
        hideLoader();
      });
    newMessageDirectModal.openModal();
  };

  const handleSelectUser = (user: any) => {
    setSelectedUsers(prev => {
      // evita duplicados
      if (prev.find(u => u.user_id === user.user_id)) return prev;
      return [...prev, user];
    });
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.user_id !== userId));
  };

  const handleSendMessage = ()=>{
    showLoader();

    console.log("ENVIAR MENSAJE");
    console.log(selectedUsers);

    apiRequest('chats/send-direct-chat', 
        "POST", 
        {
            user_ids: selectedUsers.map(u => u.user_id),
            content: messageModal
        }
    ).then((response)=>{
        console.log(response);
        if (response.status === "success") {
            toast({
                title: "Success",
                description: "Mensaje enviado correctamente",
                variant: "success",
            });
            newMessageDirectModal.closeModal();
        } else {
            toast({
                title: "Error",
                description: "No se pudo enviar el mensaje",
                variant: "destructive",
            });
        }
    }).catch((error) => {
        console.log(error);
        toast({
            title: "Error",
            description: "No se pudo enviar el mensaje",
            variant: "destructive",
        });
    }).finally(() => {
        newMessageDirectModal.closeModal();
        hideLoader();
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col bg-white border mt-5">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Buscar mensajes"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleOpenNewMessage()}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center"
              >
                <PenSquare className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Nuevo Mensaje</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div
            className="
      relative             /* para posicionar contenido absoluto si hiciera falta */
      group                /* convierte este div en un grupo para usar group-hover: */
      flex flex-col
      w-20 hover:w-64      /* ancho colapsado: 5rem, al hacer hover pasa a 16rem */
      transition-all duration-300
      border-r border-gray-200
      flex-shrink-0        /* no dejar que el sidebar se encoja más */
      bg-white
    "
          >
            <nav className="flex-1 overflow-hidden space-y-1 p-2">
              {[
                { id: "inbox", icon: <Inbox />, label: "Buzón", count: 2 },
                { id: "unread", icon: <Mail />, label: "No leídos", count: 1 },
                {
                  id: "contacts",
                  icon: <Users />,
                  label: "Mis contactos",
                  count: 0,
                },
                { id: "marked", icon: <Star />, label: "Marcados", count: 0 },
                {
                  id: "saved",
                  icon: <BookMarked />,
                  label: "Guardados",
                  count: 0,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
            w-full flex items-center justify-between p-3 rounded-lg
            transition-colors duration-200
            ${
              activeTab === item.id
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5">{item.icon}</span>
                    <span
                      className="
                ml-3 whitespace-nowrap
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.count > 0 && (
                    <span
                      className={`
                ml-2 px-2 py-1 rounded-full text-sm
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                ${
                  activeTab === item.id
                    ? "bg-white text-black"
                    : "bg-gray-200 text-gray-600"
                }
              `}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Opcional: sección Premium solo visible cuando está expandido */}
            <div
              className="
        p-4 bg-gray-50 rounded-lg m-2 hidden
        opacity-0 group-hover:opacity-100 group-hover:block
        transition-opacity duration-200
      "
            >
              <h3 className="font-bold text-lg mb-2">
                Consigue más con Premium
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                InMail de Premium es 4.6× más eficaz que emails en frío.
              </p>
              <button className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300">
                Probar Premium
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="w-80 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg">Conversaciones</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 flex items-center hover:bg-gray-50 transition-colors duration-200 ${
                    selectedChat === chat.id ? "bg-gray-50" : ""
                  }`}
                >
                  <img
                    src={chat.user.profile_pic}
                    alt={chat.user.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{chat.user.name}</h3>
                      <span className="text-sm text-gray-500">{chat.time}</span>
                    </div>
                    <p
                      className={`text-sm ${
                        chat.unread ? "font-medium text-black" : "text-gray-500"
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}

              {chats.length <= 0 && (
                <div className="flex flex-col items-center justify-center flex-1 p-6 space-y-4">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 text-sm text-center">
                      Aún no tienes conversaciones.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenNewMessage()}
                    className="flex items-center space-x-2 border border-black text-black px-5 py-2 rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    <span className="text-sm">Nuevo mensaje</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!selectedChat ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <img
                  src="https://images.pexels.com/photos/7709287/pexels-photo-7709287.jpeg"
                  alt="Empty inbox illustration"
                  className="w-64 h-64 object-cover rounded-lg mb-6 opacity-50"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Selecciona un chat
                </h2>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Elige una conversación de la lista o inicia una nueva
                </p>
                <button
                  onClick={() => handleOpenNewMessage()}
                  className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Nuevo mensaje
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={
                        chats.find((chat) => chat.id === selectedChat)?.avatar
                      }
                      alt="Chat avatar"
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <h3 className="font-bold">
                      {chats.find((chat) => chat.id === selectedChat)?.name}
                    </h3>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  {/* Chat messages would go here */}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        <Modal
          isOpen={newMessageDirectModal.isOpen}
          onClose={newMessageDirectModal.closeModal}
          id="new-message-direct-modal"
          size="lg"
          title="Nuevo mensaje directo"
          closeOnOutsideClick={false}
        >
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-4">
              {/* Tags arriba del input */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded-full object-cover mr-2"
                      />
                      <span className="text-xs font-medium mr-1">
                        {user.name}
                      </span>
                      <button
                        onClick={() => handleRemoveUser(user.user_id)}
                        className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Escribe uno o varios nombres"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Suggestions */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-500 mb-2">
                  Sugerido
                </h4>
                <div className="space-y-2">
                  {suggestedAll.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h5 className="font-medium">{user.name}</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-500 mb-2">
                  Mas contactos
                </h4>
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleSelectUser(contact)}
                    >
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h5 className="font-medium">{contact.name}</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                value={messageModal}
                onChange={(e) => setMessageModal(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
                    onClick={handleSendMessage}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Messages;
