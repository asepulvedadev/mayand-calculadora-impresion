'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  const [currentLogo] = useState('/LOGO_DARK.svg');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/10 to-primary/5 dark:from-background dark:via-muted/5 dark:to-primary/10">
      {/* Header */}
      <header className="w-full h-16 border-b border-border/60 bg-gradient-to-r from-background/95 to-muted/10 backdrop-blur supports-[backdrop-filter]:bg-background/90 flex items-center justify-center px-6 shadow-md rounded-b-lg z-10">
        <div className="flex items-center gap-8">
          <Image
            src={currentLogo}
            alt="Mayand Logo"
            width={150}
            height={40}
            className="transition-all duration-300"
          />
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
              Mayand
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light">
              Impresión Profesional
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Especialistas en impresión de vinil, lona y materiales publicitarios, además de corte láser profesional.
              Calcula tu cotización de manera rápida y sencilla con nuestras herramientas avanzadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/calculadora">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Cotización Impresión
                </Button>
              </Link>

              <Link href="/corte-laser">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🖼️ Cotización Corte Láser
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              Fácil • Rápido • Profesional
            </div>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center space-x-8 mt-12 opacity-30">
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="w-12 h-12 rounded-full bg-primary/30 animate-pulse delay-100"></div>
            <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse delay-200"></div>
          </div>
        </div>
      </main>
    </div>
  );
}