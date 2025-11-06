'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { MessageCircle, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';

const DimensionCalculator = dynamic(
  () => import('@/components/DimensionCalculator').then(mod => ({ default: mod.DimensionCalculator })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full glassmorphism fade-in hover-lift p-6 animate-pulse">
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    )
  }
);

export default function CalculatorPage() {
  const { quote } = usePrintCalculatorStore();

  const shareOnWhatsApp = () => {
    if (!quote) return;

    const message = `🖨️ *Cotización Mayand*${quote.isPromotion ? ' ✨' : ''}

📏 *Dimensiones:*
• Ancho: ${quote.width} cm
• Alto: ${quote.height} cm
• Metros lineales: ${quote.area.toFixed(2)} m

🏷️ *Material:* ${quote.material === 'vinil' ? 'Vinil' :
                quote.material === 'vinil_transparente' ? 'Vinil Transparente' :
                'Lona'}${quote.isPromotion ? ' _(Precio Promocional)_' : ''}

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calculadora de Impresión</h1>
          <p className="text-white/80 mt-2">Cotiza tu impresión gran formato con Mayand</p>
        </div>
        {quote && (
          <Button
            onClick={shareOnWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Compartir Cotización
          </Button>
        )}
      </div>

      {/* Desktop Layout - Equal Size Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Calculator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <DimensionCalculator />
        </div>

        {/* Right Panel - Quote */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <QuoteDisplay quote={quote} />
        </div>
      </div>
    </div>
  );
}