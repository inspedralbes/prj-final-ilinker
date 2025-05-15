import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { apiRequest } from '@/services/requests/apiRequest';
import { AuthContext } from '@/contexts/AuthContext';
import { LoaderContext } from '@/contexts/LoaderContext';
import Image from 'next/image';
import config from '@/types/config';

interface SharePublicationsProps {
  isOpen: boolean;
  onClose: () => void;
  publication: {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    media?: {
      id: number;
      file_path: string;
      media_type: "image" | "video";
    }[];
    has_media: boolean;
  } | null;
  onShareSuccess?: (sharedPublication: any) => void;
}

export default function SharePublications({ isOpen, onClose, publication, onShareSuccess }: SharePublicationsProps) {
  const [content, setContent] = useState('');
  const { userData, allUsers } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Función para obtener el nombre según el rol
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

  if (!isOpen || !publication) return null;

  const handleShare = async () => {
    if (!publication) return;

    try {
      showLoader();
      const response = await apiRequest('/publications/share', 'POST', {
        publication_id: publication.id,
        content: content
      });

      if (response.status === 'success' && onShareSuccess) {
        onShareSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error('Error al compartir la publicación:', err);
    } finally {
      hideLoader();
    }
  };

  const getUserAvatar = () => {
    if (!userData) return "/default-avatar.png";
    if (userData.rol === "student" && userData.student?.photo_pic) {
      return userData.student.photo_pic.startsWith('http') ? userData.student.photo_pic : `${config.storageUrl}${userData.student.photo_pic}`;
    } else if (userData.rol === "company" && userData.company?.logo) {
      return userData.company.logo.startsWith('http') ? userData.company.logo : `${config.storageUrl}${userData.company.logo}`;
    } else if (userData.rol === "institutions" && userData.institution?.logo) {
      return userData.institution.logo.startsWith('http') ? userData.institution.logo : `${config.storageUrl}${userData.institution.logo}`;
    }
    return "/default-avatar.png";
  };

  const getOriginalUserAvatar = (userId: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return "/default-avatar.png";

    if (user.rol === "student" && user.student?.photo_pic) {
      return user.student.photo_pic.startsWith('http') ? user.student.photo_pic : `${config.storageUrl}${user.student.photo_pic}`;
    } else if (user.rol === "company" && user.company?.logo) {
      return user.company.logo.startsWith('http') ? user.company.logo : `${config.storageUrl}${user.company.logo}`;
    } else if (user.rol === "institutions" && user.institution?.logo) {
      return user.institution.logo.startsWith('http') ? user.institution.logo : `${config.storageUrl}${user.institution.logo}`;
    }
    return "/default-avatar.png";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto">
        <div className="p-3 md:p-4 border-b flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold">Compartir publicación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="p-3 md:p-4">
          {/* User's new post content */}
          <div className="mb-3 md:mb-4">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 overflow-hidden relative">
                <Image
                  src={getUserAvatar()}
                  alt={userData?.name || 'User'}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Compartiendo publicación</p>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Añade un comentario a tu publicación..."
              className="w-full p-2 md:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              rows={3}
            />
          </div>

          {/* Original post being shared */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
            <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 overflow-hidden relative">
                <Image
                  src={getOriginalUserAvatar(publication.user.id)}
                  alt={publication.user.name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>
              <div>
                <h4 className="font-medium text-xs md:text-sm">{getUserName(publication.user.id)}</h4>
                <p className="text-xs text-gray-500">Publicación original</p>
              </div>
            </div>
            <div className="pl-8 md:pl-11">
              <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3">{publication.content}</p>
              {publication.has_media && publication.media && publication.media.length > 0 && (
                <div className="relative h-36 md:h-48 w-full rounded-lg overflow-hidden">
                  {publication.media[0].media_type === "image" ? (
                    <Image
                      src={publication.media[0].file_path.startsWith('http') 
                        ? publication.media[0].file_path 
                        : `${config.storageUrl}${publication.media[0].file_path}`}
                      alt="Shared media"
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <video
                      src={publication.media[0].file_path.startsWith('http') 
                        ? publication.media[0].file_path 
                        : `${config.storageUrl}${publication.media[0].file_path}`}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 border-t flex justify-end space-x-2 md:space-x-3">
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleShare}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-sm rounded-lg hover:bg-blue-700"
          >
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
} 