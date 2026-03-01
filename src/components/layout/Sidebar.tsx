'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  FolderOpen,
  Calculator,
  Scissors,
  Settings,
  Layers,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Catálogo', href: '/admin/catalogo', icon: FolderOpen },
  { name: 'Impresión', href: '/admin/calculadora', icon: Calculator },
  { name: 'Corte Láser', href: '/admin/corte-laser', icon: Scissors },
  { name: 'Config. Láser', href: '/admin/configuracion-laser', icon: Settings },
  { name: 'Materiales', href: '/admin/materiales', icon: Layers },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname !== '/';

  const toggleCollapsed = () => {
    onCollapsedChange?.(!collapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isAdmin && (
        <div className="lg:hidden fixed top-3 right-3 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.1] transition-all active:scale-95"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out',
        'bg-[#0a0530]/95 backdrop-blur-xl border-r border-white/[0.06]',
        'lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
        collapsed ? 'lg:w-[60px]' : 'lg:w-64'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            'flex items-center h-16 border-b border-white/[0.06]',
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}>
            {!collapsed && (
              <Link href="/" className="flex items-center">
                <Image src="/LOGO_DARK.svg" alt="Mayand" width={110} height={32} className="h-7 w-auto" />
              </Link>
            )}
            <button
              onClick={toggleCollapsed}
              className={cn(
                'p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all hidden lg:flex',
                collapsed && 'mx-auto'
              )}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={cn('flex-1 py-4 space-y-1', collapsed ? 'px-1.5' : 'px-2.5')}>
            {!collapsed && (
              <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Menu</p>
            )}
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-[#458FFF]/15 text-[#458FFF] border border-[#458FFF]/20'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent',
                    collapsed ? 'justify-center px-0' : 'px-3'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon size={18} className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-[#458FFF]' : 'text-white/30 group-hover:text-white/60'
                  )} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div className="p-4 border-t border-white/[0.06]">
              <p className="text-[10px] text-white/20 text-center">
                Mayand Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {isAdmin && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
