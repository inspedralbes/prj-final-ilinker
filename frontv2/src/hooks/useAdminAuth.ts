import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export function useAdminAuth() {
    const { loggedIn, userData } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loggedIn || userData?.rol !== 'admin') {
            router.push('/login');
        }
    }, [loggedIn, userData, router]);

    return { loggedIn, userData };
}