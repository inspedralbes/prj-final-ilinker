import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export function useAdminAuth() {
    const { loggedIn, userData } = useContext(AuthContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loggedIn === false) {
            // Redirigir directamente a la ruta /auth/login
            router.push('/auth/login');
        } else if (loggedIn && userData?.rol !== 'admin') {
            router.push('/');
        } else {
            setIsLoading(false);
        }
    }, [loggedIn, userData, router]);

    return { 
        isAdmin: loggedIn && userData?.rol === 'admin',
        isLoading 
    };
}