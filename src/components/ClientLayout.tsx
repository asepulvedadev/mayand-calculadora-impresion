'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  // Solo usar DashboardLayout para rutas de admin
  return isAdmin ? <DashboardLayout>{children}</DashboardLayout> : <>{children}</>;
}
