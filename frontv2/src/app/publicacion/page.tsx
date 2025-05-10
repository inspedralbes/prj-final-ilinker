"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import config from "@/types/config";
import { useRouter } from "next/navigation";
import { Bookmark, Users2, CalendarDays, MessageCircle, Share2, MapPin, Heart, ChevronLeft, ChevronRight, ImageIcon, Calendar, FileText } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/services/requests/apiRequest";
import { User } from "@/types/global";
import CreatePostModal from "@/components/posts/CreatePostModal";

// Interfaces para definir la estructura de los datos
interface Media {
  url: string | File;
  type: "image" | "video";
}

interface Publication {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  location?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  media?: {
    id: number;
    file_path: string;
    media_type: "image" | "video";
    display_order: number;
  }[];
  has_media: boolean;
  visibility: "public" | "private";
  comments_enabled: boolean;
  status: "published" | "draft" | "archived";
  liked?: boolean;
  saved?: boolean;
}

interface NewPublication {
  content: string;
  media: Media[];
  visibility: "public" | "private"; 
  location: string;
  tags: string[];
}

// Componente principal de la página de publicaciones
export default function PublicationPage() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublications();
  }, []);

  // Función para obtener las publicaciones del servidor
  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('publications', 'GET');
      console.log('Respuesta de datos de publicaciones:', response);
      
      if (response.status === 'success') {
        // Asegurar que cada publicación tenga la propiedad liked correctamente establecida
        const publicationsWithLikeState = response.data.data.map((pub: Publication) => ({
          ...pub,
          liked: pub.liked || false // Asegurar que liked sea siempre un booleano
        }));
        setPublications(publicationsWithLikeState);
      } else {
        setError('Error al cargar las publicaciones');
      }
    } catch (err) {
      console.error('Error al cargar las publicaciones:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setIsLoading(false);
    }
  };

  // Estados para el modal y nueva publicación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPublication, setNewPublication] = useState<NewPublication>({
    content: "",
    media: [],
    visibility: "public",
    location: "",
    tags: [],
  });

  // Función para crear una nueva publicación
  const handleCreatePublication = async () => {
    if (!newPublication.content.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', newPublication.content);
      formData.append('visibility', newPublication.visibility);
      if (newPublication.location) {
        formData.append('location', newPublication.location);
      }
      
      // Añadir archivos multimedia si existen
      newPublication.media.forEach((media, index) => {
        if (typeof media.url === 'object' && media.url instanceof File) {
          formData.append(`media[${index}]`, media.url);
        }
      });

      const response = await apiRequest('/publications', 'POST', formData);

      if (response.status === 'success') {
        setPublications([response.data, ...publications]);
        setNewPublication({
          content: "",
          media: [],
          visibility: "public",
          location: "",
          tags: [],
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      setError('Error al crear la publicación');
    }
  };

  // Función para dar like a una publicación
  const handleLike = async (id: number) => {
    try {
      const response = await apiRequest(`/publications/${id}/like`, 'POST');
      console.log('Respuesta del like:', response);
      
      if (response.status === 'success') {
        // Actualizar el estado de las publicaciones con la nueva información del like
        setPublications(publications.map((pub) =>
          pub.id === id ? { 
            ...pub, 
            likes_count: response.likes_count,
            liked: response.liked 
          } : pub
        ));
      }
    } catch (err) {
      console.error('Error al dar like a la publicación:', err);
    }
  };

  // Función para guardar una publicación
  const handleSavePublication = async (id: number) => {
    try {
      const response = await apiRequest(`/publications/${id}/save`, 'POST');
      console.log('Respuesta del guardado:', response);
      
      if (response.status === 'success') {
        setPublications(publications.map((pub) =>
          pub.id === id ? { 
            ...pub, 
            saved: response.saved 
          } : pub
        ));
      }
    } catch (err) {
      console.error('Error al guardar la publicación:', err);
    }
  };

  // Función para comentar en una publicación
  const handleComment = async (id: number) => {
    // TODO: Implementar funcionalidad de comentarios
    console.log('Comentar en la publicación:', id);
  };

  // Función para navegar al perfil del usuario
  const handleViewMore = () => {
    console.log('handleViewMore clickeado');
    console.log('userData:', userData);

    if (!userData) {
      console.log('No hay datos de usuario disponibles');
      return;
    }

    console.log('Rol del usuario:', userData.rol);

    if (userData.rol === "student" && userData.student?.uuid) {
      router.push(`/profile/student/${userData.student.uuid}`);
    } else if (userData.rol === "company" && userData.company?.slug) {
      router.push(`/profile/company/${userData.company.slug}`);
    } else if (userData.rol === "institutions" && userData.institution?.slug) {
      router.push(`/profile/institution/${userData.institution.slug}`);
    } else {
      console.log('No se encontraron datos de perfil válidos');
    }
  };

  const handlePublish = async (data: {
    content: string;
    media: Media[];
    visibility: "public" | "private";
    location: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('visibility', data.visibility);
      if (data.location) {
        formData.append('location', data.location);
      }
      
      // Añadir archivos multimedia si existen
      data.media.forEach((media, index) => {
        if (typeof media.url === 'object' && media.url instanceof File) {
          formData.append(`media[${index}]`, media.url);
        }
      });

      const response = await apiRequest('/publications', 'POST', formData);

      if (response.status === 'success') {
        setPublications([response.data, ...publications]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      setError('Error al crear la publicación');
    }
  };

  const getUserAvatar = () => {
    if (!userData) return "/default-avatar.png";
    if (userData.rol === "student" && userData.student?.photo_pic) {
      return userData.student.photo_pic;
    } else if (userData.rol === "company" && userData.company?.logo) {
      return userData.company.logo;
    } else if (userData.rol === "institutions" && userData.institution?.logo) {
      return userData.institution.logo;
    }
    return "/default-avatar.png";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 flex gap-6">
        <ProfileSidebar userData={userData} onViewMore={handleViewMore} />
        <div className="flex-1 max-w-xl">
          <CreatePublicationCard onOpenModal={() => setIsModalOpen(true)} userAvatar={getUserAvatar()} />
          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPublish={handlePublish}
          />
          
          {isLoading ? (
            <div className="text-center py-4">Cargando publicaciones...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            publications.map((publication) => (
              <PublicationCard 
                key={publication.id} 
                publication={publication} 
                onLike={handleLike} 
                onComment={handleComment}
                onSave={handleSavePublication}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de la barra lateral del perfil
const ProfileSidebar = ({ userData, onViewMore }: { userData: User | null; onViewMore: () => void }) => {
  // Funciones auxiliares para obtener datos específicos según el rol del usuario
  const getUserCoverPhoto = () => {
    if (!userData) return "/default-cover.jpg";

    if (userData.rol === "institutions" && userData.institution?.cover_photo) {
      return userData.institution.cover_photo;
    } else if (userData.rol === "company" && userData.company?.cover_photo) {
      return userData.company.cover_photo;
    } else if (userData.rol === "student" && userData.student?.cover_photo) {
      return userData.student.cover_photo;
    }

    return "/default-cover.jpg";
  };

  const getUserProfilePic = () => {
    if (!userData) return "/default-avatar.png";

    if (userData.rol === "institutions" && userData.institution?.logo) {
      return userData.institution.logo;
    } else if (userData.rol === "company" && userData.company?.logo) {
      return userData.company.logo;
    } else if (userData.rol === "student" && userData.student?.photo_pic) {
      return userData.student.photo_pic;
    }

    return "/default-avatar.png";
  };

  const getUserSlogan = () => {
    if (!userData) return "";

    if (userData.rol === "institutions" && userData.institution?.slogan) {
      return userData.institution.slogan;
    } else if (userData.rol === "company" && userData.company?.slogan) {
      return userData.company.slogan;
    }

    return "";
  };

  const getUserLocation = () => {
    if (!userData) return "";

    const city =
      (userData.rol === "student" && userData.student?.city) ||
      (userData.rol === "company" && userData.company?.city) ||
      (userData.rol === "institutions" && userData.institution?.city) ||
      "";

    const country =
      (userData.rol === "student" && userData.student?.country) ||
      (userData.rol === "company" && userData.company?.country) ||
      (userData.rol === "institutions" && userData.institution?.country) ||
      "";

    if (city && country) {
      return `${city}, ${country}`;
    } else if (city) {
      return city;
    } else if (country) {
      return country;
    }

    return "";
  };

  const getUserTitle = () => {
    if (!userData) return "";

    if (userData.rol === "student" && userData.student?.title) {
      return userData.student.title;
    } else if (userData.rol === "company" && userData.company?.name) {
      return userData.company.name;
    } else if (userData.rol === "institutions" && userData.institution?.name) {
      return userData.institution.name;
    }

    return "";
  };

  return (
    <div className="hidden md:block w-80 flex-shrink-0">
      <div className="sticky top-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-20 bg-slate-200 relative">
            <Image
              src={getUserCoverPhoto()}
              alt="Portada"
              fill
              className="object-cover"
            />
          </div>
          <div className="px-4 pb-4">
            <div className="relative -mt-12 mb-3">
              <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                <Image
                  src={getUserProfilePic()}
                  alt="Perfil"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl font-semibold">{userData?.name} {userData?.surname}</h1>

            {userData && (
              <>
                {getUserSlogan() && (
                  <p className="text-sm text-gray-600 italic mb-2">"{getUserSlogan()}"</p>
                )}
                <p className="text-sm text-gray-700 mt-1 mb-1"><br></br>{getUserTitle()}</p>

                {getUserLocation() && (
                  <p className="text-sm text-gray-600 flex items-center mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {getUserLocation()}
                  </p>
                )}
              </>
            )}

            <nav className="space-y-2 mt-4">
              <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray rounded-md px-2">
                <Bookmark className="w-4 h-4" /> Elementos guardados
              </button>
              <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md px-2">
                <Users2 className="w-4 h-4" /> Grupos
              </button>
              <button className="flex items-center gap-2 w-full py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md px-2">
                <CalendarDays className="w-4 h-4" /> Eventos
              </button>
            </nav>
            <button onClick={onViewMore} className="w-full text-center py-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-md mt-4">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para crear una nueva publicación estilo LinkedIn
const CreatePublicationCard = ({ onOpenModal, userAvatar = "/default-avatar.png" }: { onOpenModal: () => void; userAvatar?: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
        <Image src={userAvatar} alt="Perfil" width={48} height={48} className="object-cover" />
      </div>
      <button 
        onClick={onOpenModal} 
        className="flex-1 text-left bg-gray-50 rounded-full px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 border border-gray-200"
      >
        Crear publicación
      </button>
    </div>
  </div>
);

// Componente para el carrusel de medios (imágenes/videos)
const MediaCarousel = ({ media }: { media: { id: number; file_path: string; media_type: "image" | "video" }[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaError, setMediaError] = useState<Record<number, boolean>>({});

  // Funciones para navegar por el carrusel
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMediaError = (id: number) => {
    console.error(`Error loading media with id: ${id}`);
    setMediaError(prev => ({...prev, [id]: true}));
  };

  if (!media || media.length === 0) return null;

  return (
    <div className="relative mb-4">
      <div className="overflow-hidden rounded-lg">
        {/* Contenedor principal del carrusel */}
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {media.map((item: { id: number; file_path: string; media_type: "image" | "video" }) => (
            <div key={item.id} className="min-w-full flex-shrink-0">
              {mediaError[item.id] ? (
                <div className="h-64 w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No se pudo cargar el medio</p>
                </div>
              ) : item.media_type === "image" ? (
                <div className="relative h-64 w-full">
                  <Image 
                    src={item.file_path} 
                    alt="Imagen de publicación" 
                    fill
                    className="object-cover"
                    onError={() => handleMediaError(item.id)}
                    unoptimized={true}
                  />
                </div>
              ) : (
                <video 
                  src={item.file_path}
                  controls 
                  className="w-full h-64 object-cover rounded-lg"
                  playsInline
                  onError={() => handleMediaError(item.id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicadores de posición del carrusel */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {media.map((_, idx) => (
            <button 
              key={idx} 
              className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
      
      {/* Botones de navegación del carrusel */}
      {media.length > 1 && (
        <>
          <button 
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button 
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
};

// Componente para mostrar una publicación individual
const PublicationCard = ({ 
  publication, 
  onLike, 
  onComment,
  onSave
}: { 
  publication: Publication; 
  onLike: (id: number) => void; 
  onComment: (id: number) => void;
  onSave: (id: number) => void;
}) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  // Función para manejar el clic en el botón de like con animación
  const handleLikeClick = (id: number) => {
    setIsLikeAnimating(true);
    onLike(id);
    setTimeout(() => setIsLikeAnimating(false), 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center space-x-3 mb-4">
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
          <h3 className="font-semibold">{publication.user.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>{new Date(publication.created_at).toLocaleDateString()}</span>
            {publication.location && (
              <>
                <span className="mx-1">•</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{publication.location}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{publication.content}</p>
      
      {/* Carrusel de medios si la publicación tiene contenido multimedia */}
      {publication.has_media && publication.media && publication.media.length > 0 && (
        <MediaCarousel media={publication.media} />
      )}
      
      {/* Barra de acciones de la publicación */}
      <div className="flex items-center justify-between text-gray-500 border-t pt-3">
        <button 
          onClick={() => handleLikeClick(publication.id)} 
          className={`flex items-center gap-1 transition-all duration-200 ${publication.liked ? 'text-red-500' : 'hover:text-red-500'}`}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isLikeAnimating ? 'animate-[heartbeat_1s_ease-in-out]' : ''
            } ${publication.liked ? 'fill-current scale-110' : ''}`} 
          />
          <span className={`transition-all duration-200 ${publication.liked ? 'font-semibold' : ''}`}>
            {publication.likes_count}
          </span>
        </button>
        <button onClick={() => onComment(publication.id)} className="flex items-center gap-1 hover:text-blue-600">
          <MessageCircle className="w-5 h-5" />
          <span>{publication.comments_count}</span>
        </button>
        <button 
          onClick={() => onSave(publication.id)} 
          className={`flex items-center gap-1 transition-colors duration-200 ${publication.saved ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
        >
          <Bookmark className={`w-5 h-5 ${publication.saved ? 'fill-yellow-500' : ''}`} />
          <span>Guardar</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          <Share2 className="w-5 h-5" />
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
};
