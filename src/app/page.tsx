'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DimensionCalculator } from '@/components/DimensionCalculator';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { calculateQuote } from '@/lib/calculations';
import { Material, QuoteData } from '@/types';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, setWidth] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [height, setHeight] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [material, setMaterial] = useState<Material>('vinil');
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [currentLogo] = useState('/LOGO_DARK.svg');

  const handleDimensionChange = (newWidth: number, newHeight: number, newMaterial: Material) => {
    setWidth(newWidth);
    setHeight(newHeight);
    setMaterial(newMaterial);
    const newQuote = calculateQuote(newWidth, newHeight, newMaterial);
    setQuote(newQuote);
  };

  const shareOnWhatsApp = () => {
    if (!quote) return;

    const message = `🖨️ *Cotización Mayand*

📏 *Dimensiones:*
• Ancho: ${width} cm
• Alto: ${height} cm
${quote.material === 'vinil' || quote.material === 'vinil_transparente'
  ? `• Metros lineales: ${quote.area.toFixed(2)} m`
  : `• Área: ${quote.area.toFixed(2)} m²`
}

🏷️ *Material:* ${quote.material === 'vinil' ? 'Vinil' :
                quote.material === 'vinil_transparente' ? 'Vinil Transparente' :
                'Lona'}

💰 *Precios:*
• Precio unitario: $${quote.unitPrice.toFixed(2)} MXN/${quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 'm' : 'm²'}
• Subtotal: $${quote.subtotal.toFixed(2)} MXN
• IVA (16%): $${quote.iva.toFixed(2)} MXN
• *Total con IVA: $${quote.total.toFixed(2)} MXN*

${quote.hasBulkDiscount ? `🎉 ¡Descuento por volumen aplicado! (${quote.material === 'vinil' || quote.material === 'vinil_transparente' ? '≥10m' : '≥10m²'})` : ''}

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
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      {/* Header */}
      <div className="h-16 border-b-2 border-border/80 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src={currentLogo}
            alt="Mayand Logo"
            width={150}
            height={40}

            className="transition-all duration-300"
          />
          
        </div>

        {/* Desktop: WhatsApp Share Button */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={shareOnWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!quote}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Compartir por WhatsApp
          </Button>
        </div>

        {/* Mobile: WhatsApp Share Only */}
        <div className="md:hidden flex items-center">
          <Button
            variant="default"
            size="sm"
            onClick={shareOnWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white text-xs"
            disabled={!quote}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Main Content - Fixed Layout */}
      <div className="h-[calc(100vh-4rem)] overflow-hidden">
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
      </div>

    </div>
  );
}
