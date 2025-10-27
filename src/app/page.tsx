'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DimensionCalculator } from '@/components/DimensionCalculator';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { calculateQuote } from '@/lib/calculations';
import { Material, QuoteData } from '@/types';
import { MessageCircle, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [material] = useState<Material>('vinil'); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [currentLogo] = useState('/LOGO_DARK.svg');

  const handleDimensionChange = (newWidth: number, newHeight: number, newMaterial: Material) => {
    setWidth(newWidth);
    setHeight(newHeight);
    const newQuote = calculateQuote(newWidth, newHeight, newMaterial);
    setQuote(newQuote);
  };

  const shareOnWhatsApp = () => {
    if (!quote) return;

    const message = `🖨️ *Cotización Mayand*

📏 *Dimensiones:*
• Ancho: ${width} cm
• Alto: ${height} cm
• Metros lineales: ${quote.area.toFixed(2)} m

🏷️ *Material:* ${quote.material === 'vinil' ? 'Vinil' :
                quote.material === 'vinil_transparente' ? 'Vinil Transparente' :
                'Lona'}

💰 *Precios:*
• Precio unitario: $${quote.unitPrice.toFixed(2)} MXN/m
• Subtotal: $${quote.subtotal.toFixed(2)} MXN
• IVA (16%): $${quote.iva.toFixed(2)} MXN
• *Total con IVA: $${quote.total.toFixed(2)} MXN*

📱 Generado por Mayand`;

    // Detect if it's mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let whatsappUrl;
    if (isMobile) {
      // Use WhatsApp app URL for mobile
      whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Use WhatsApp Web for desktop
      whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      {/* Header */}
      <header className=" mx-auto h-16 border-b border-border/60 bg-gradient-to-r from-background/95 to-muted/10 backdrop-blur supports-[backdrop-filter]:bg-background/90 flex items-center justify-around px-6 shadow-md rounded-b-lg">
        <div className="flex items-center gap-8">
          <Image
            src={currentLogo}
            alt="Mayand Logo"
            width={150}
            height={40}
            className="transition-all duration-300"
          />
        </div>

        {/* Desktop: WhatsApp Share Button */}
        <div className="hidden md:flex items-center gap-8">
          <Button
            variant="default"
            size="sm"
            onClick={shareOnWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!quote}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>

        {/* Mobile: WhatsApp Share Only */}
        <div className="md:hidden flex items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={shareOnWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1 shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
            disabled={!quote}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Compartir
          </Button>
        </div>
      </header>

      {/* Main Content - Fixed Layout */}
      <main className="flex-1 max-w-[80%] mx-auto overflow-hidden">
        {/* Desktop Layout - Equal Size Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:h-full lg:gap-0">
          {/* Left Panel - Calculator */}
          <div className="border-r-2 border-border/60 bg-background/80 backdrop-blur-sm p-6 overflow-y-auto shadow-lg">
            <DimensionCalculator onChange={handleDimensionChange} />
          </div>

          {/* Right Panel - Quote */}
          <div className="bg-background/80 backdrop-blur-sm shadow-lg h-full p-6">
            <QuoteDisplay quote={quote} />
          </div>
        </div>

        {/* Mobile/Tablet Layout - Simplified */}
        <div className="lg:hidden h-full overflow-y-auto">
          <div className="space-y-6 p-4">
            <DimensionCalculator onChange={handleDimensionChange} />
            <QuoteDisplay quote={quote} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[80%] mx-auto bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/85 border-t border-border/60 py-4 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
