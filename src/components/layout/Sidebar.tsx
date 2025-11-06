'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Calculator, Scissors, Home, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Impresión', href: '/calculadora', icon: Calculator },
  { name: 'Corte Láser', href: '/corte-laser', icon: Scissors },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out",
        "bg-white/10 backdrop-blur-md border-r border-white/20",
        "lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/favicon.ico"
                  alt="Mayand Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md text-white hover:bg-white/20 transition-colors hidden lg:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    "hover:bg-white/20 hover:text-white",
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80",
                    isCollapsed ? "justify-center" : ""
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isCollapsed ? "" : "mr-3"
                  )} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-white/20">
              <p className="text-xs text-white/60 text-center">
                © 2025 Mayand
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}