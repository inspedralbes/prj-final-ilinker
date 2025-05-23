import React from 'react';
import { UserPlus, X } from 'lucide-react';
import config from '@/types/config';
import { useRouter } from 'next/navigation';

interface ContactSuggestionsProps {
  suggestedUsers: any[];
  onAddContact: (userId: string) => void;
  onDismiss: (userId: string) => void;
}

const ContactSuggestions: React.FC<ContactSuggestionsProps> = ({
  suggestedUsers,
  onAddContact,
  onDismiss
}) => {
  const router = useRouter();
  if (suggestedUsers.length === 0) return null;

  const getAvatarUser = (user: any) => {
    switch(user.rol){
      case 'student':
        return user.student?.photo_pic;
      case 'company':
        return user.company?.logo;
      case 'institution':
        return user.institution?.logo;
    }
  };

  const getNameUser = (user: any) => {
    switch(user.rol){
      case 'student':
        return user.student?.name;
      case 'company':
        return user.company?.name;
      case 'institutions':
        return user.institutions?.name;
    }
  };

  const goToProfile = (user: any) => {
    switch(user.rol){
      case 'student':
        router.push(`/profile/student/${user.student?.uuid}`);
        break;
      case 'company':
        router.push(`/profile/company/${user.company?.slug}`);
        break;
      case 'institutions':
        router.push(`/profile/institution/${user.institutions?.slug}`);
        break;
    }
  };
  return (
    <div className="w-full max-w-xs bg-white rounded-lg overflow-hidden border border-gray-100">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700">Sugerencias de contactos</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {suggestedUsers.map((user) => (
          <div 
            key={user.id} 
            className="p-3 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group cursor-pointer"
            onClick={() => goToProfile(user)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={config.storageUrl + getAvatarUser(user)} 
                  alt={getNameUser(user)}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {user.isNew && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{getNameUser(user)}</p>
                <p className="text-xs text-gray-500">Te puede interesar</p>
              </div>
            </div>
            {/* <div className="flex items-center space-x-1">
              <button 
                onClick={() => onAddContact(user.id)}
                className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                aria-label="Añadir contacto"
              >
                <UserPlus size={18} />
              </button>
              <button 
                onClick={() => onDismiss(user.id)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                aria-label="Descartar sugerencia"
              >
                <X size={18} />
              </button>
            </div> */}
          </div>
        ))}
        {suggestedUsers.length === 0 && (
          <div className="p-3 text-center">
            <p className="text-xs text-gray-500">No hay sugerencias</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSuggestions;