import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import config from '@/types/config';

interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
}

export const useAdminAuth = (): boolean => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // Intentar obtener el token primero de cookies (más seguro)
      const token = Cookies.get('authToken') || localStorage.getItem('authToken');

      if (!token) {
        console.log('No se encontró token de autenticación');
        //router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }

      try {
        console.log('Verificando autenticación con token');

        // Obtener la información del usuario autenticado
        // hooks/useAdminAuth.ts
        const res = await fetch(`${config.apiUrl}auth/check`, { // Usa el endpoint de verificación
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!res.ok) {
          console.error('Error en la respuesta:', res.status);
          // Si el token no es válido, redirigir al login
          if (res.status === 401) {
            // Eliminar token inválido
            Cookies.remove('authToken');
            localStorage.removeItem('authToken');
            //router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
          } 
          return;
        }

        const data = await res.json();
        console.log('Datos del usuario:', data);

        // Verificar si el usuario es administrador
        if (data.rol !== 'admin') {
          console.log('Usuario no es administrador:', data.rol);
          return;
        }

        console.log('Usuario autenticado como administrador');
        // Si llegamos aquí, el usuario está autenticado y es admin

      } catch (error) {
        console.error('Error checking admin auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  return loading;
};