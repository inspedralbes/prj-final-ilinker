"use client";

import React, { useState, useContext, useEffect, useCallback, use, useRef } from "react";
import Image from "next/image";
import config from "@/types/config";
import { useRouter } from "next/navigation";
import { Bookmark, Users2, CalendarDays, MessageCircle, Share2, MapPin, Heart, ChevronLeft, ChevronRight, ImageIcon, Calendar, FileText, Send, Linkedin } from "lucide-react";
import CommentModal from "./comment";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";
import { User } from "@/types/global";
import CreatePostModal from "@/components/posts/CreatePostModal";
import SavePublications from "./SavePublications";
import SharePublications from "./SharePublications";

// Add this utility function at the top of the file
const normalizeUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Remove any leading slashes from the path
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${config.storageUrl}${normalizedPath}`;
};

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
  shared?: boolean;
  shared_by?: {
    id: number;
    name: string;
  };
  original_publication_id?: number;
  likes?: {
    user_id: number;
  }[];
  saved_by?: {
    user_id: number;
  }[];
}

interface NewPublication {
  content: string;
  media: Media[];
  visibility: "public" | "private";
  location: string;
  tags: string[];
}

// Estados para el modal de comentarios
interface ActiveComment {
  isOpen: boolean;
  publicationId: number | null;
}

const defaultAvatarSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCCCCC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Componente principal de la página de publicaciones
export default function PublicationPage() {
  const [activeComment, setActiveComment] = useState<ActiveComment>({
    isOpen: false,
    publicationId: null
  });
  const { userData, allUsers, setAllUsers } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPublications();
    fetchAllUsers();
  }, []);
  // Función para obtener las publicaciones del servidor
  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      showLoader(); // Mostrar loader al iniciar la carga
      const response = await apiRequest('publications', 'GET');

      if (response.status === 'success') {
        // Asegurar que cada publicación tenga la propiedad liked y saved correctamente establecida
        // y que las URLs de los medios sean completas
        const publicationsWithState = response.data.data.map((pub: Publication) => ({
          ...pub,
          liked: pub.likes?.some(like => like.user_id === userData?.id) || false,
          saved: pub.saved_by?.some(saved => saved.user_id === userData?.id) || false,
          // Procesar las URLs de los medios para asegurar que sean completas
          media: pub.media?.map(m => ({
            ...m,
            file_path: normalizeUrl(m.file_path)
          }))
        }));
        setPublications(publicationsWithState);
      } else {
        setError('Error al cargar las publicaciones');
      }
    } catch (err) {
      console.error('Error al cargar las publicaciones:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setIsLoading(false);
      hideLoader(); // Ocultar loader al finalizar la carga
    }
  };

  // Función para obtener todos los usuarios
  const fetchAllUsers = async () => {
    try {
      showLoader(); // Mostrar loader al iniciar la carga
      const response = await apiRequest('/users/all', 'POST');

      if (response.status === 'success' && response.users) {
        // Transformar los datos de usuario según su rol
        const transformedUsers = response.users.map((user: any) => {
          const baseUser = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            rol: user.rol,
          };

          // Añadir información específica según el rol
          switch (user.rol) {
            case 'student':
              return {
                ...baseUser,
                student: {
                  name: user.student?.name,
                  uuid: user.student?.uuid,
                  photo_pic: user.student?.photo_pic,
                  cover_photo: user.student?.cover_photo,
                },
                avatar: user.student?.photo_pic
              };
            case 'company':
              return {
                ...baseUser,
                company: {
                  name: user.company?.name,
                  logo: user.company?.logo,
                  slug: user.company?.slug,
                },
                avatar: user.company?.logo
              };
            case 'institutions':
              return {
                ...baseUser,
                institution: {
                  name: user.institution?.name,
                  logo: user.institution?.logo,
                  slug: user.institution?.slug,
                },
                avatar: user.institution?.logo
              };
            default:
              return baseUser;
          }
        });

        setAllUsers(transformedUsers);
      } else {
        console.error('Error en el formato de respuesta de usuarios:', response);
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      hideLoader(); // Ocultar loader al finalizar la carga
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
      showLoader();
      const response = await apiRequest(`/publications/${id}/like`, 'POST');
      console.log('Respuesta del like:', response);

      if (response.status === 'success') {
        // Actualizar solo los datos necesarios sin recargar las imágenes
        setPublications(publications.map((pub) => {
          if ((pub.shared && pub.original_publication_id === id) || pub.id === id) {
            return {
              ...pub,
              likes_count: response.likes_count,
              liked: response.liked,
              likes: response.liked 
                ? [...(pub.likes || []), { user_id: userData?.id || 0 }]
                : (pub.likes || []).filter(like => like.user_id !== userData?.id)
            };
          }
          return pub;
        }));
      }
    } catch (err) {
      console.error('Error al dar like a la publicación:', err);
    } finally {
      hideLoader();
    }
  };

  // Función para guardar una publicación
  const handleSavePublication = async (id: number) => {
    try {
      showLoader();
      const response = await apiRequest(`/publications/${id}/save`, 'POST');
      console.log('Respuesta del guardado:', response);

      if (response.status === 'success') {
        // Actualizar solo el estado de guardado
        setPublications(publications.map((pub) => {
          if ((pub.shared && pub.original_publication_id === id) || pub.id === id) {
            return {
              ...pub,
              saved: response.saved,
              saved_by: response.saved 
                ? [...(pub.saved_by || []), { user_id: userData?.id || 0 }]
                : (pub.saved_by || []).filter(saved => saved.user_id !== userData?.id)
            };
          }
          return pub;
        }));
      }
    } catch (err) {
      console.error('Error al guardar la publicación:', err);
    } finally {
      hideLoader();
    }
  };

  // Función para comentar en una publicación
  const handleComment = (id: number) => {
    setActiveComment({
      isOpen: true,
      publicationId: id
    });
  };

  const handleCloseComment = () => {
    setActiveComment({
      isOpen: false,
      publicationId: null
    });
  };

  // Función para actualizar el contador de comentarios sin recargar la publicación
  const handleCommentChange = (publicationId: number) => {
    setPublications(publications.map((pub) => {
      if ((pub.shared && pub.original_publication_id === publicationId) || pub.id === publicationId) {
        return {
          ...pub,
          comments_count: pub.comments_count + 1
        };
      }
      return pub;
    }));
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
        console.log('Respuesta de creación de publicación:', response.data);
        
        // Create a complete publication object with all required fields
        const normalizedPublication = {
          ...response.data,
          id: response.data.id,
          content: response.data.content || "",
          user: {
            id: response.data.user_id,
            name: response.data.user?.name || userData?.name || "",
            avatar: userData?.avatar || ""
          },
          created_at: response.data.created_at,
          likes_count: 0,
          comments_count: 0,
          has_media: response.data.has_media || false,
          location: response.data.location || null,
          liked: false,
          saved: false,
          visibility: response.data.visibility || "public",
          comments_enabled: response.data.comments_enabled !== false,
          status: response.data.status || "published",
          
          // Las URLs ya vienen procesadas del backend
          media: response.data.media || []
        };
        
        console.log('Publicación normalizada:', normalizedPublication);
        
        // Añadir la nueva publicación al principio de la lista y asegurar que el estado se actualice inmediatamente
        setPublications(prevPublications => [normalizedPublication, ...prevPublications]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error al crear la publicación:', err);
      setError('Error al crear la publicación');
    }
  };

  const getUserAvatar = () => {
    if (!userData) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCCCCC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
    if (userData.rol === "student" && userData.student?.photo_pic) {
      return config.storageUrl + userData.student.photo_pic;
    } else if (userData.rol === "company" && userData.company?.logo) {
      return config.storageUrl + userData.company.logo;
    } else if (userData.rol === "institutions" && userData.institution?.logo) {
      return config.storageUrl + userData.institution.logo;
    }
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CCCCCC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
  };

  const handleShare = async (sharedPublication: any) => {
    try {
      showLoader();
      // Actualizar la lista de publicaciones con la nueva publicación compartida
      setPublications(prevPublications => [sharedPublication, ...prevPublications]);
    } catch (err) {
      console.error('Error al compartir la publicación:', err);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 md:py-6 px-2 md:px-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Mobile Profile Sidebar - Only visible on mobile */}
          <div className="lg:hidden w-full mb-4">
            <ProfileSidebar
              userData={userData}
              onViewMore={handleViewMore}
              onSavedClick={() => setIsSavedModalOpen(true)}
              isMobile={true}
            />
          </div>

          {/* Desktop Profile Sidebar - Only visible on desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProfileSidebar
              userData={userData}
              onViewMore={handleViewMore}
              onSavedClick={() => setIsSavedModalOpen(true)}
              isMobile={false}
            />
          </div>

          {/* Main Content - Centered with max width */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
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
                  onShare={handleShare}
                />
              ))
            )}
          </div>

          {/* Right Sidebar - Only visible on desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            {/* Puedes agregar contenido adicional aquí si lo necesitas */}
          </div>
        </div>
      </div>
      {activeComment.isOpen && activeComment.publicationId && (
        <CommentModal
          publicationId={activeComment.publicationId}
          isOpen={activeComment.isOpen}
          onClose={handleCloseComment}
          onCommentChange={() => activeComment.publicationId && handleCommentChange(activeComment.publicationId)}
        />
      )}
      <SavePublications
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
    </div>
  );
}

// Componente de la barra lateral del perfil
const ProfileSidebar = ({
  userData,
  onViewMore,
  onSavedClick,
  isMobile
}: {
  userData: User | null;
  onViewMore: () => void;
  onSavedClick: () => void;
  isMobile: boolean;
}) => {
  const router = useRouter();

  const getUserCoverPhoto = () => {
    if (!userData) return "/default-cover.jpg";

    if (userData.rol === "student" && userData.student?.cover_photo) {
      return userData.student.cover_photo.startsWith('http') 
        ? userData.student.cover_photo 
        : `${config.storageUrl}${userData.student.cover_photo}`;
    } else if (userData.rol === "company" && userData.company?.cover_photo) {
      return userData.company.cover_photo.startsWith('http') 
        ? userData.company.cover_photo 
        : `${config.storageUrl}${userData.company.cover_photo}`;
    } else if (userData.rol === "institutions" && userData.institution?.cover) {
      return userData.institution.cover.startsWith('http') 
        ? userData.institution.cover 
        : `${config.storageUrl}${userData.institution.cover}`;
    }

    return "/default-cover.jpg";
  };

  const getUserProfilePic = () => {
    if (!userData) return defaultAvatarSvg;

    if (userData.rol === "student" && userData.student?.photo_pic) {
      return userData.student.photo_pic.startsWith('http') 
        ? userData.student.photo_pic 
        : `${config.storageUrl}${userData.student.photo_pic}`;
    } else if (userData.rol === "company" && userData.company?.logo) {
      return userData.company.logo.startsWith('http') 
        ? userData.company.logo 
        : `${config.storageUrl}${userData.company.logo}`;
    } else if (userData.rol === "institutions" && userData.institution?.logo) {
      return userData.institution.logo.startsWith('http') 
        ? userData.institution.logo 
        : `${config.storageUrl}${userData.institution.logo}`;
    }

    return defaultAvatarSvg;
  };

  const getUserSlogan = () => {
    if (!userData) return "";

    if (userData.rol === "student" && userData.student?.bio) {
      return userData.student.bio;
    } else if (userData.rol === "company" && userData.company?.slogan) {
      return userData.company.slogan;
    } else if (userData.rol === "institutions" && userData.institution?.slogan) {
      return userData.institution.slogan;
    }

    return "";
  };

  const getUserLocation = () => {
    if (!userData) return "";

    if (userData.rol === "student") {
      const location = [];
      if (userData.student?.city) location.push(userData.student.city);
      if (userData.student?.country) location.push(userData.student.country);
      return location.join(", ");
    } else if (userData.rol === "company" && userData.company?.address) {
      return userData.company.address;
    } else if (userData.rol === "institutions" && userData.institution?.address) {
      return userData.institution.address;
    }

    return "";
  };

  const getUserTitle = () => {
    if (!userData) return "";

    if (userData.rol === "student") {
      const name = userData.student?.name || userData.name || "";
      const surname = userData.student?.surname || userData.surname || "";
      return `${name} ${surname}`.trim();
    } else if (userData.rol === "company" && userData.company?.name) {
      return userData.company.name;
    } else if (userData.rol === "institutions" && userData.institution?.name) {
      return userData.institution.name;
    }

    return userData.name || "";
  };

  // Función para obtener la descripción corta
  const getShortDescription = () => {
    if (!userData) return "";

    if (userData.rol === "student") {
      if (userData.student?.short_description) {
        return userData.student.short_description;
      } else if (userData.student?.title) {
        return userData.student.title;
      }
    } else if (userData.rol === "company" && userData.company?.short_description) {
      return userData.company.short_description;
    } else if (userData.rol === "institutions" && userData.institution?.short_description) {
      return userData.institution.short_description;
    }

    return "";
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-80'} ${isMobile ? '' : 'sticky top-6'}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-24 md:h-32 bg-slate-200 relative">
          <Image
            src={getUserCoverPhoto()}
            alt="Portada"
            fill
            className="object-cover"
            unoptimized={true}
            onError={(e) => {
              e.currentTarget.src = "/default-cover.jpg";
            }}
          />
        </div>
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="relative -mt-12 md:-mt-16 mb-3 md:mb-4">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white overflow-hidden relative">
              <Image
                src={getUserProfilePic()}
                alt="Perfil"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized={true}
                onError={(e) => {
                  e.currentTarget.src = defaultAvatarSvg;
                }}
              />
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">{getUserTitle()}</h1>
          
          {getShortDescription() && (
            <p className="text-sm md:text-base text-gray-600 mb-3">{getShortDescription()}</p>
          )}

          {userData && (
            <>
              {getUserSlogan() && (
                <p className="text-sm md:text-base text-gray-600 italic mb-3">"{getUserSlogan()}"</p>
              )}

              {getUserLocation() && (
                <p className="text-sm md:text-base text-gray-600 flex items-center mb-4">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {getUserLocation()}
                </p>
              )}
            </>
          )}

          <nav className="space-y-2 md:space-y-3 mt-4 md:mt-6">
            <button
              onClick={onSavedClick}
              className="group flex items-center gap-3 w-full py-3 md:py-3.5 text-sm md:text-base bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 rounded-xl px-4 transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50"
            >
              <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" /> 
              <span className="font-medium tracking-wide">Publicaciones guardadas</span>
            </button>
          </nav>
          <button 
            onClick={onViewMore} 
            className="w-full text-center py-3 md:py-3.5 text-sm md:text-base font-medium bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl mt-4 md:mt-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para crear una nueva publicación estilo LinkedIn
const CreatePublicationCard = ({ onOpenModal, userAvatar = defaultAvatarSvg }: { onOpenModal: () => void; userAvatar?: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden relative">
        <img
          src={userAvatar}
          alt="Perfil"
          className="w-full h-full object-cover"
          onError={(e) => { 
            e.currentTarget.src = "/default-avatar.png";
          }}
        />
      </div>
      <button
        onClick={onOpenModal}
        className="flex-1 text-left bg-gray-50 rounded-full px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-500 hover:bg-gray-100 border border-gray-200"
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
  
  // Resetear errores cuando cambian los medios
  useEffect(() => {
    setMediaError({});
  }, [media]);

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

  const handleMediaError = (id: number, path: string) => {
    console.error(`Error loading media with id: ${id} from path: ${path}`);
    setMediaError(prev => ({ ...prev, [id]: true }));
  };

  if (!media || media.length === 0) return null;

  const getMediaUrl = (path: string) => {
    return normalizeUrl(path);
  };

  return (
    <div className="relative mb-4">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {media.map((item) => (
            <div key={item.id} className="min-w-full flex-shrink-0">
              {mediaError[item.id] ? (
                <div className="h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No se pudo cargar el medio</p>
                </div>
              ) : item.media_type === "image" ? (
                <div className="relative h-48 sm:h-64 w-full">
                  <img
                    src={getMediaUrl(item.file_path)}
                    alt="Imagen de publicación"
                    className="w-full h-full object-cover"
                    onError={() => handleMediaError(item.id, item.file_path)}
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="relative h-48 sm:h-64 w-full">
                  <video
                    src={getMediaUrl(item.file_path)}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                    playsInline
                    onError={() => handleMediaError(item.id, item.file_path)}
                    preload="auto"
                    controlsList="nodownload"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {media.length > 1 && (
        <>
          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-1.5 sm:space-x-2">
            {media.map((_, idx) => (
              <button
                key={idx}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
          <button
            className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-white/80 sm:bg-white/70 rounded-full p-1.5 sm:p-1 hover:bg-white/90 transition-colors"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
          <button
            className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-white/80 sm:bg-white/70 rounded-full p-1.5 sm:p-1 hover:bg-white/90 transition-colors"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
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
  onSave,
  onShare
}: {
  publication: Publication;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
  onSave: (id: number) => void;
  onShare?: (sharedPublication: any) => void;
}) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const { allUsers, userData } = useContext(AuthContext);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const router = useRouter();

  const getUserName = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return "Usuario";

    if (user.rol === "student") {
      return user.student?.name || user.name;
    } else if (user.rol === "company") {
      return user.company?.name || user.name;
    } else if (user.rol === "institutions") {
      return user.institution?.name || user.name;
    }
    return user.name;
  };

  const getAvatarUrl = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return defaultAvatarSvg;

    let avatarPath = '';
    if (user.rol === "student" && user.student?.photo_pic) {
      avatarPath = user.student.photo_pic;
    } else if (user.rol === "company" && user.company?.logo) {
      avatarPath = user.company.logo;
    } else if (user.rol === "institutions" && user.institution?.logo) {
      avatarPath = user.institution.logo;
    }

    return avatarPath ? (avatarPath.startsWith('http') ? avatarPath : `${config.storageUrl}${avatarPath}`) : defaultAvatarSvg;
  };

  const handleProfileClick = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    let profileUrl = '';
    switch (user.rol) {
      case 'student':
        if (user.student?.uuid) {
          profileUrl = `/profile/student/${user.student.uuid}`;
        }
        break;
      case 'company':
        if (user.company?.slug) {
          profileUrl = `/profile/company/${user.company.slug}`;
        }
        break;
      case 'institutions':
        if (user.institution?.slug) {
          profileUrl = `/profile/institution/${user.institution.slug}`;
        }
        break;
    }

    if (profileUrl) {
      router.push(profileUrl);
    }
  };

  const handleLikeClick = (id: number) => {
    setIsLikeAnimating(true);
    const targetId = publication.shared && publication.original_publication_id ? publication.original_publication_id : id;
    onLike(targetId);
    setTimeout(() => setIsLikeAnimating(false), 1000);
  };

  const handleCommentClick = (id: number) => {
    const targetId = publication.shared && publication.original_publication_id ? publication.original_publication_id : id;
    onComment(targetId);
  };

  const handleSaveClick = (id: number) => {
    const targetId = publication.shared && publication.original_publication_id ? publication.original_publication_id : id;
    onSave(targetId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4">
      {publication.shared_by && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
            <img
              src={getAvatarUrl(publication.shared_by.id)}
              alt={getUserName(publication.shared_by.id)}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.currentTarget.src = defaultAvatarSvg;
              }}
              loading="lazy"
            />
          </div>
          <div>
            <h3 
              className="text-base font-semibold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => publication.shared_by && handleProfileClick(publication.shared_by.id)}
            >
              {getUserName(publication.shared_by.id)}
            </h3>
            <p className="text-sm text-gray-500">Compartió esta publicación</p>
          </div>
        </div>
      )}

      <div className={`${publication.shared_by ? 'bg-gray-50 rounded-lg p-4 border border-gray-200' : ''}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
            <img
              src={getAvatarUrl(publication.user.id)}
              alt={getUserName(publication.user.id)}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.currentTarget.src = defaultAvatarSvg;
              }}
              loading="lazy"
            />
          </div>
          <div>
            <h3 
              className="text-base font-semibold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleProfileClick(publication.user.id)}
            >
              {getUserName(publication.user.id)}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(publication.created_at).toLocaleDateString()}</span>
              {publication.location && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{publication.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`${publication.shared_by ? 'pl-12' : ''}`}>
          <p className="text-base text-gray-800 mb-4 whitespace-pre-wrap">{publication.content}</p>
          {publication.has_media && publication.media && publication.media.length > 0 && (
            <MediaCarousel media={publication.media} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-500 border-t pt-3 mt-4">
        <button
          onClick={() => handleLikeClick(publication.id)}
          className={`flex items-center gap-2 transition-all duration-200 ${publication.liked ? 'text-red-500' : 'hover:text-red-500'}`}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${isLikeAnimating ? 'animate-[heartbeat_1s_ease-in-out]' : ''
              } ${publication.liked ? 'fill-current scale-110' : ''}`}
          />
          <span className={`text-sm transition-all duration-200 ${publication.liked ? 'font-semibold' : ''}`}>
            {publication.likes_count}
          </span>
        </button>

        <button onClick={() => handleCommentClick(publication.id)} className="flex items-center gap-2 hover:text-blue-600">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{publication.comments_count}</span>
        </button>
        <button
          onClick={() => handleSaveClick(publication.id)}
          className={`flex items-center gap-2 transition-colors duration-200 ${publication.saved ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
        >
          <Bookmark className={`w-5 h-5 ${publication.saved ? 'fill-yellow-500' : ''}`} />
          <span className="text-sm">Guardar</span>
        </button>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Compartir</span>
        </button>
      </div>

      {isShareModalOpen && (
        <SharePublications
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          publication={publication}
          onShareSuccess={onShare}
        />
      )}
    </div>
  );
};
