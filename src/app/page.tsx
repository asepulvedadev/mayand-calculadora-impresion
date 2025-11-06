'use client';

import { Hero } from '@/components/Hero';
import { Facebook, Instagram } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />

      {/* Footer */}
      <footer className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/85 border-t border-border/60 py-4 px-6">
        <div className="max-w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Hecho por <span className="font-semibold text-primary">Craftia</span> - Derechos reservados Mayand
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/mayand"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/mayand"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
