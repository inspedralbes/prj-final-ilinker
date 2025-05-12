// hooks/useAdminAuth.ts
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export function useAdminAuth() {
    const { loggedIn, userData } = useContext(AuthContext);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loggedIn) {
            // Usar la ruta completa en lugar del nombre de ruta
            router.push('/auth/login');
        } else if (userData?.rol !== 'admin') {
            router.push('/');
        } else {
            setIsAdmin(true);
        }
        setLoading(false);
    }, [loggedIn, userData, router]);

    return { 
        isAdmin,
        loading,
        loggedIn,
        userData
    };
}