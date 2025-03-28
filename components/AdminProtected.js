import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminProtected({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(`/admin/login?callbackUrl=${router.asPath}`);
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
} 