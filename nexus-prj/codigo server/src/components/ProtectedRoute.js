'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    setChecking(false);
    if (!user) {
      const returnTo =
        pathname && pathname !== '/login' ? `?returnTo=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${returnTo}`);
    }
  }, [isLoading, pathname, router, user]);

  if (checking || isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f1eb] px-6 text-[#64707d]">
        <p className="text-sm font-medium">Verificando tu sesión...</p>
      </main>
    );
  }

  if (!user) return null;

  return children;
}
