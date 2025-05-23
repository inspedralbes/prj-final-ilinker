import React, { useEffect, useState } from 'react';
import { UserX, Search, Unlock, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/services/requests/apiRequest';
import { formatDistanceToNow, previousDay } from "date-fns";
import config from '@/types/config';

const BlockedUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loaderContainer, setLoaderContainer] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<any>(null);
  // const blockedUsers = [
  //   {
  //     id: 1,
  //     name: 'James Wilson',
  //     username: '@jameswilson',
  //     avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //     blockedDate: '2 days ago',
  //   },
  //   {
  //     id: 2,
  //     name: 'Emma Thompson',
  //     username: '@emmathompson',
  //     avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //     blockedDate: '1 week ago',
  //   },
  //   {
  //     id: 3,
  //     name: 'Michael Davis',
  //     username: '@michaeldavis',
  //     avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  //     blockedDate: '2 weeks ago',
  //   },
  // ];

  const filteredUsers = blockedUsers?.filter((user: any) => 
    user.blocked_user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLoaderContainer(true);
    apiRequest("my-blocked-users")
      .then((response: any) => {
        console.log(response);
        if(response.status === 'success') {
          setBlockedUsers(
            response.blockedUser.map((user: any) => ({
              ...user,
              loaderContainerBtn: false,  // añadimos la propiedad
            }))
          );
        }else{
          toast({
            title: 'Error',
            description: 'No se encontraron usuarios bloqueados',
            variant: 'destructive',
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
        toast({
          title: 'Error',
          description: 'Ocurrio algo inesperado',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setLoaderContainer(false);
      });
  }, []);

  const handleUnblockUser = (blockedData: any) => {
    console.log("unblock user");
    setBlockedUsers((prev: any)=>{
      return prev.map((user: any) =>
        user.id === blockedData.blocked_user.id ? {
          ...user,
          loaderContainerBtn: true,
        } : user
      );
    })
    apiRequest(`unblock/${blockedData.blocked_user.id}`)
      .then((response: any) => {
        console.log(response);
        if(response.status === 'success') {
          toast({
            title: 'Exito',
            description: 'Usuario desbloqueado',
            variant: 'success',
          });
        }else{
          toast({
            title: 'Error',
            description: 'No se pudo desbloquear el usuario',
            variant: 'destructive',
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
        toast({
          title: 'Error',
          description: 'Ocurrio algo inesperado',
          variant: 'destructive',
        });
      }).finally(()=>{
        setBlockedUsers((prev: any)=>{
          return prev.map((user: any) =>
            user.id === blockedData.blocked_user.id ? {
              ...user,
              loaderContainerBtn: false,
            } : user
          );
        })
      })
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Usuarios bloqueados</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-3">
          Los usuarios que has bloqueado no podrán ver tu perfil, publicaciones o enviarte mensajes.
        </p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuarios bloqueados"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
          />
        </div>
      </div>

      {loaderContainer ? (
        <div className="flex items-center justify-center text-center py-8 border border-gray-200 rounded-lg animate-fadeIn">
          <Loader2 className="h-5 w-5 text-black mr-2 animate-spin" />
          Cargando...
        </div>
        ) : 
        (
          filteredUsers?.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-lg">
            {searchTerm ? (
              <p className="text-gray-500">No hay usuarios bloqueados que coincidan con tu búsqueda.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <UserX className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500">No has bloqueado a ningún usuario.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {filteredUsers?.map((user: any) => (
              <div 
                key={user.id} 
                className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={config.storageUrl + (user.blocked_user?.student ? user.blocked_user?.student.profile_pic : user.blocked_user?.company ? user.blocked_user?.company.logo : user.blocked_user?.institutions ? user.blocked_user?.institutions.logo : '')} 
                    alt={user.blocked_user?.student ? user.blocked_user?.student.name : user.blocked_user?.company ? user.blocked_user?.company.name : user.blocked_user?.institutions ? user.blocked_user?.institutions.name : ''} 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-md font-medium text-gray-900">{user.blocked_user?.student ? user.blocked_user?.student.name : user.blocked_user?.company ? user.blocked_user?.company.name : user.blocked_user?.institutions ? user.blocked_user?.institutions.name : ''}</h3>
                  <p className="text-sm text-gray-500">{user.blocked_user?.student ? user.blocked_user?.email : user.blocked_user?.company ? user.blocked_user?.company.email : user.blocked_user?.institutions ? user.blocked_user?.institutions.email : ''}</p>
                  <p className="text-xs text-gray-400 mt-1">Bloqueado {formatDistanceToNow(new Date(user.created_at), {
                    addSuffix: true,
                  })}</p>
                </div>
                
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => handleUnblockUser(user)}
                >
                  <span>
                    {user.loaderContainerBtn ? (
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Cargando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Unlock className="h-4 w-4 mr-2" />
                        Desbloquear
                      </div>
                    )}
                  </span>
                </button>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default BlockedUsers;