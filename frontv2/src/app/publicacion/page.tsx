'use client';

import { useState, useContext } from 'react';
import Image from 'next/image';
import { FaRegThumbsUp, FaRegComment, FaRegShareSquare, FaEllipsisH, FaHeart, FaImage, FaVideo, FaFileAlt, FaTimes, FaSmile, FaAt, FaHashtag, FaMapMarkerAlt } from 'react-icons/fa';
import { PlusCircle, Bookmark, Users2, CalendarDays } from 'lucide-react';
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

interface Publication {
  id: number;
  content: string;
  user: {
    name: string;
    avatar?: string;
  };
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

export default function PublicationPage() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 1,
      content: "¡Acabo de lanzar mi nuevo proyecto! Estoy muy emocionado de compartir esta nueva experiencia con todos ustedes.",
      user: {
        name: "Juan Pérez",
        avatar: "/default-avatar.png"
      },
      location: "Madrid, España",
      timestamp: "2h",
      likes: 45,
      comments: 12,
      media: [
        {
          url: "/sample-project.jpg",
          type: "image"
        }
      ]
    },
    {
      id: 2,
      content: "Check out this amazing tutorial on Next.js and TypeScript! 🚀",
      user: {
        name: "María García",
        avatar: "/default-avatar.png"
      },
      location: "Barcelona",
      timestamp: "5h",
      likes: 89,
      comments: 23,
      media: [
        {
          url: "/tutorial-video.mp4",
          type: "video"
        }
      ]
    },
    {
      id: 3,
      content: "Beautiful sunset at the beach today! 🌅 #nature #photography",
      user: {
        name: "Carlos Ruiz",
        avatar: "/default-avatar.png"
      },
      location: "Málaga",
      timestamp: "1d",
      likes: 234,
      comments: 45,
      media: [
        {
          url: "/sunset.jpg",
          type: "image"
        }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPublication, setNewPublication] = useState({
    content: '',
    media: [] as { url: string; type: 'image' | 'video' }[],
    visibility: 'Cualquiera' as 'Cualquiera' | 'Solo conexiones' | 'Solo yo',
    location: '',
    tags: [] as string[]
  });

  const handleCreatePublication = () => {
    if (!newPublication.content.trim()) return;

    const publication: Publication = {
      id: publications.length + 1,
      content: newPublication.content,
      user: {
        name: "Deray Burga Cachiguango",
        avatar: "/default-avatar.png"
      },
      timestamp: "Ahora",
      likes: 0,
      comments: 0,
      media: newPublication.media,
      location: newPublication.location
    };

    setPublications([publication, ...publications]);
    setNewPublication({ 
      content: '', 
      media: [], 
      visibility: 'Cualquiera',
      location: '',
      tags: []
    });
    setIsModalOpen(false);
  };

  const handleLike = (id: number) => {
    setPublications(publications.map(pub => 
      pub.id === id ? { ...pub, likes: pub.likes + 1 } : pub
    ));
  };

  const handleComment = (id: number) => {
    setPublications(publications.map(pub => 
      pub.id === id ? { ...pub, comments: pub.comments + 1 } : pub
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 flex gap-6">
        {/* Left Sidebar - Sticky */}
        {/* Perfil de usuario logeado */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Profile Header with Background */}
              <div className="h-20 bg-slate-200 relative">
                <Image
                  src={userData?.student?.cover_photo || userData?.company?.cover_photo || "/default-cover.jpg"}
                  alt="Cover"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="px-4 pb-4">
                {/* Profile Picture */}
                <div className="relative -mt-12 mb-3">
                  <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                    <Image
                      src={userData?.student?.photo_pic || userData?.company?.logo || userData?.institution?.logo || "/default-avatar.png"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Name and Title */}
                <h1 className="text-xl font-semibold">{userData?.name} {userData?.surname}</h1>
                <p className="text-sm mb-4">
                  {userData?.rol === 'student' && userData?.student?.title}
                  {userData?.rol === 'company' && userData?.company?.name}
                  {userData?.rol === 'institutions' && userData?.institution?.name}
                </p>

                {/* Contacts Section */}
                {/* <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Contactos</span>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Amplía tu red
                    </button>
                  </div>
                </div> */}

                {/* Premium Button */}
                {/* <button className="flex items-center gap-2 w-full justify-center py-2 px-4 border border-gray-300 rounded-full text-sm font-medium mb-3 hover:bg-gray-50">
                  <PlusCircle className="w-4 h-4" />
                  Probar Premium por 0 €
                </button> */}

                {/* Navigation Items */}
                <nav className="space-y-2">
                  <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md px-2">
                    <Bookmark className="w-4 h-4" />
                    Elementos guardados
                  </button>
                  <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md px-2">
                    <Users2 className="w-4 h-4" />
                    Grupos
                  </button>
                  <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md px-2">
                    <CalendarDays className="w-4 h-4" />
                    Eventos
                  </button>
                </nav>

                {/* Ver más Button */}
                <button 
                  onClick={() => {
                    if (userData?.rol === 'student') {
                      router.push(`/profile/student/${userData?.student?.uuid}`);
                    } else if (userData?.rol === 'company') {
                      router.push(`/profile/company/${userData?.company?.slug}`);
                    } else if (userData?.rol === 'institutions') {
                      router.push(`/profile/institution/${userData?.institution?.slug}`);
                    }
                  }}
                  className="w-full text-center py-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-md"
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-xl">
          {/* Create Publication Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/default-avatar.png"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 text-left bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
              >
                ¿Qué quieres compartir?
              </button>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm"
              >
                <FaImage color="#3B82F6" />
                <span>Foto</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm"
              >
                <FaVideo color="#22C55E" />
                <span>Video</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm"
              >
                <FaFileAlt color="#F97316" />
                <span>Artículo</span>
              </button>
            </div>
          </div>

          {/* Create Publication Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
                {/* Modal Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Crear publicación</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <Image
                      src="/default-avatar.png"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Deray Burga Cachiguango</h3>
                    <select 
                      value={newPublication.visibility}
                      onChange={(e) => setNewPublication({...newPublication, visibility: e.target.value as any})}
                      className="text-sm text-gray-600 border-none bg-transparent focus:ring-0"
                    >
                      <option value="Cualquiera">🌐 Cualquiera</option>
                      <option value="Solo conexiones">🔒 Solo conexiones</option>
                      <option value="Solo yo">👤 Solo yo</option>
                    </select>
                  </div>
                </div>

                {/* Publication Form */}
                <div className="p-4">
                  <textarea
                    value={newPublication.content}
                    onChange={(e) => setNewPublication({...newPublication, content: e.target.value})}
                    placeholder="¿Qué quieres compartir?"
                    className="w-full h-32 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Formatting Tools */}
                  <div className="mt-4 flex items-center space-x-4 text-gray-500">
                    <button className="hover:text-blue-600">
                      <FaSmile size={20} />
                    </button>
                    <button className="hover:text-blue-600">
                      <FaAt size={20} />
                    </button>
                    <button className="hover:text-blue-600">
                      <FaHashtag size={20} />
                    </button>
                    <button className="hover:text-blue-600">
                      <FaMapMarkerAlt size={20} />
                    </button>
                  </div>

                  {/* Media Upload Preview */}
                  {newPublication.media.length > 0 && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Archivos adjuntos</span>
                        <button 
                          onClick={() => setNewPublication({...newPublication, media: []})}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {newPublication.media.map((media, index) => (
                          <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <Image
                                src={media.url}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm">
                        <FaImage color="#3B82F6" />
                        <span>Foto</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm">
                        <FaVideo color="#22C55E" />
                        <span>Video</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm">
                        <FaFileAlt color="#F97316" />
                        <span>Artículo</span>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePublication}
                      disabled={!newPublication.content.trim()}
                      className={`px-6 py-2 rounded-full font-medium ${
                        newPublication.content.trim() 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Publications Feed */}
          {publications.map((publication) => (
            <div key={publication.id} className="bg-white rounded-lg shadow-sm mb-4">
              {/* Publication Header */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={publication.user.avatar || "/default-avatar.png"}
                        alt={publication.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-900">{publication.user.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{publication.timestamp}</span>
                        {publication.location && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{publication.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50">
                    <FaEllipsisH size={16} />
                  </button>
                </div>
              </div>

              {/* Publication Content */}
              <div className="px-3 pb-3">
                <p className="text-sm text-gray-800 mb-3">{publication.content}</p>
                {publication.media && publication.media[0] && (
                  <div className="rounded-lg overflow-hidden mb-3">
                    {publication.media[0].type === 'image' ? (
                      <Image
                        src={publication.media[0].url}
                        alt="Publication media"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    ) : (
                      <video
                        src={publication.media[0].url}
                        controls
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Publication Stats */}
              <div className="px-3 py-2 border-t border-b text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{publication.likes} me gusta</span>
                  <span>{publication.comments} comentarios</span>
                </div>
              </div>

              {/* Publication Actions */}
              <div className="px-3 py-2 flex justify-between">
                <button 
                  onClick={() => handleLike(publication.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm"
                >
                  <FaHeart color="#EF4444" />
                  <span>Me gusta</span>
                </button>
                <button 
                  onClick={() => handleComment(publication.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm"
                >
                  <FaRegComment />
                  <span>Comentar</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm">
                  <FaRegShareSquare />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 