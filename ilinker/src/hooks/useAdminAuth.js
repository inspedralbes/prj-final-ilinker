import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAdminAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;

      if (!token) {
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }

      try {
        const res = await fetch('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
          return;
        }

        const user = await res.json();

        if (user.role !== 'admin') {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  return loading;
};
