import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const useAdminAuth = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkAdmin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
  
        try {
          const res = await fetch('http://localhost:8000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!res.ok) {
            router.push('/login');
            return;
          }
  
          const user = await res.json();
  
          if (user.role !== 'admin') {
            router.push('/unauthorized'); // Puedes crear esta página
          }
        } catch (error) {
          console.error('Error checking admin auth:', error);
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };
  
      checkAdmin();
    }, [router]);
  
    return loading;
  };