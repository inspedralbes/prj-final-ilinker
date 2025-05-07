"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bookmark, Users2, CalendarDays, PlusCircle, MessageCircle, Share2, MapPin, Image as ImageIcon, Video, FileText, X, Smile, AtSign, Hash, ThumbsUp } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/services/requests/apiRequest";
import { User } from "@/types/global";

// Tipos de datos para la aplicación
interface Media {
  url: string;
  type: "image" | "video";
}

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
  media?: Media[];
}

interface NewPublication {
  content: string;
  media: Media[];
  visibility: "Cualquiera" | "Solo conexiones" | "Solo yo";
  location: string;
  tags: string[];
}

// Componente principal de la página de publicaciones
export default function PublicationPage() {
  const { userData } = useContext(AuthContext);
  const router = useRouter();

  console.log('PublicationPage userData from context:', userData);
  console.log('PublicationPage userData role:', userData?.rol);
  console.log('PublicationPage userData institution logo:', userData?.institution?.logo);

  // Estado para almacenar las publicaciones
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 1,
      content: "¡Acabo de lanzar mi nuevo proyecto! Estoy muy emocionado de compartir esta nueva experiencia con todos ustedes.",
      user: { name: "Juan Pérez", avatar: "/default-avatar.png" },
      location: "Madrid, España",
      timestamp: "2h",
      likes: 45,
      comments: 12,
      media: [{ url: "/sample-project.jpg", type: "image" }],
    },
    {
      id: 2,
      content: "Check out this amazing tutorial on Next.js and TypeScript! 🚀",
      user: { name: "María García", avatar: "/default-avatar.png" },
      location: "Barcelona",
      timestamp: "5h",
      likes: 89,
      comments: 23,
      media: [{ url: "/tutorial-video.mp4", type: "video" }],
    },
    {
      id: 3,
      content: "Beautiful sunset at the beach today! 🌅 #nature #photography",
      user: { name: "Carlos Ruiz", avatar: "/default-avatar.png" },
      location: "Málaga",
      timestamp: "1d",
      likes: 234,
      comments: 45,
      media: [{ url: "/sunset.jpg", type: "image" }],
    },
  ]);

  // Estados para el modal y nueva publicación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPublication, setNewPublication] = useState<NewPublication>({
    content: "",
    media: [],
    visibility: "Cualquiera",
    location: "",
    tags: [],
  });

  // Función para crear una nueva publicación
  const handleCreatePublication = () => {
    if (!newPublication.content.trim()) return;

    const publication: Publication = {
      id: publications.length + 1,
      content: newPublication.content,
      user: {
        name: `${userData?.name} ${userData?.surname}`,
        avatar: userData?.student?.photo_pic || userData?.company?.logo || userData?.institution?.logo,
      },
      timestamp: "Ahora",
      likes: 0,
      comments: 0,
      media: newPublication.media,
      location: newPublication.location,
    };

    setPublications([publication, ...publications]);
    setNewPublication({
      content: "",
      media: [],
      visibility: "Cualquiera",
      location: "",
      tags: [],
    });
    setIsModalOpen(false);
  };

  // Función para dar like a una publicación
  const handleLike = (id: number) => {
    setPublications(publications.map((pub) =>
      pub.id === id ? { ...pub, likes: pub.likes + 1 } : pub
    ));
  };

  // Función para comentar en una publicación
  const handleComment = (id: number) => {
    setPublications(publications.map((pub) =>
      pub.id === id ? { ...pub, comments: pub.comments + 1 } : pub
    ));
  };

  // Función para navegar al perfil del usuario
  const handleViewMore = () => {
    console.log('handleViewMore clicked');
    console.log('userData:', userData);

    if (!userData) {
      console.log('No userData available');
      return;
    }

    console.log('User role:', userData.rol);

    if (userData.rol === "student" && userData.student?.uuid) {
      router.push(`/profile/student/${userData.student.uuid}`);
    } else if (userData.rol === "company" && userData.company?.slug) {
      router.push(`/profile/company/${userData.company.slug}`);
    } else if (userData.rol === "institutions" && userData.institution?.slug) {
      router.push(`/profile/institution/${userData.institution.slug}`);
    } else {
      console.log('No valid profile data found');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 flex gap-6">
        <ProfileSidebar userData={userData} onViewMore={handleViewMore} />
        <div className="flex-1 max-w-xl">
          <CreatePublicationCard onOpenModal={() => setIsModalOpen(true)} />
          {publications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} onLike={handleLike} onComment={handleComment} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de la barra lateral del perfil
const ProfileSidebar = ({ userData, onViewMore }: { userData: User | null; onViewMore: () => void }) => {
  // Obtener datos específicos según el rol del usuario
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
              alt="Cover"
              fill
              className="object-cover"
            />
          </div>
          <div className="px-4 pb-4">
            <div className="relative -mt-12 mb-3">
              <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                <Image
                  src={getUserProfilePic()}
                  alt="Profile"
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
                <p className="text-sm text-gray-700 mt-1 mb-1"><br></br>{  getUserTitle()}</p>


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

// Componente para crear una nueva publicación
const CreatePublicationCard = ({ onOpenModal }: { onOpenModal: () => void }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
        <Image src="/default-avatar.png" alt="Profile" width={32} height={32} className="object-cover" />
      </div>
      <button onClick={onOpenModal} className="flex-1 text-left bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
        ¿Qué quieres compartir?
      </button>
    </div>
  </div>
);

// Componente para mostrar una publicación individual
const PublicationCard = ({ publication, onLike, onComment }: { publication: Publication; onLike: (id: number) => void; onComment: (id: number) => void }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        <Image src={publication.user.avatar || "/default-avatar.png"} alt={publication.user.name} width={40} height={40} className="object-cover" />
      </div>
      <div>
        <h3 className="font-semibold">{publication.user.name}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <span>{publication.timestamp}</span>
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
    {publication.media && publication.media.length > 0 && (
      <div className="mb-4">
        {publication.media.map((media, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            {media.type === "image" ? (
              <Image src={media.url} alt="Publication media" width={500} height={300} className="w-full object-cover" />
            ) : (
              <video src={media.url} controls className="w-full rounded-lg" />
            )}
          </div>
        ))}
      </div>
    )}
    <div className="flex items-center justify-between text-gray-500 border-t pt-3">
      <button onClick={() => onLike(publication.id)} className="flex items-center gap-1 hover:text-blue-600">
        <ThumbsUp className="w-5 h-5" />
        <span>{publication.likes}</span>
      </button>
      <button onClick={() => onComment(publication.id)} className="flex items-center gap-1 hover:text-blue-600">
        <MessageCircle className="w-5 h-5" />
        <span>{publication.comments}</span>
      </button>
      <button className="flex items-center gap-1 hover:text-blue-600">
        <Share2 className="w-5 h-5" />
        <span>Compartir</span>
      </button>
    </div>
  </div>
);