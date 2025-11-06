'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LaserCalculator } from '@/components/LaserCalculator';
import { LaserQuote } from '@/types/laser';
import { createQuote } from '@/lib/laserApi';
import { MessageCircle, Facebook, Instagram, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function CorteLaserPage() {
  const [currentLogo] = useState('/LOGO_DARK.svg');
  const [generatedQuote, setGeneratedQuote] = useState<LaserQuote | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  const handleQuoteGenerated = async (quote: LaserQuote) => {
    try {
      console.log('Intentando guardar cotización:', quote);
      // Guardar la cotización en la base de datos
      await createQuote(quote);
      setGeneratedQuote(quote);
      toast.success('Cotización guardada correctamente');
    } catch (error) {
      console.error('Error saving quote:', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      toast.error('Error al guardar la cotización');
      // Aún mostrar la cotización aunque no se guarde
      setGeneratedQuote(quote);
    }
  };

  const shareOnWhatsApp = () => {
    if (!generatedQuote) return;

    const message = `🖼️ *Cotización Corte Láser Mayand* 

📏 *Especificaciones:*
• Material: ${generatedQuote.material.name} ${generatedQuote.material.thickness}mm
• Dimensiones por pieza: ${generatedQuote.piece_width} × ${generatedQuote.piece_height} cm
• Cantidad: ${generatedQuote.quantity} piezas
• Minutos de corte: ${generatedQuote.cutting_minutes}

📊 *Material necesario:*
• Láminas requeridas: ${generatedQuote.sheets_needed}
• Área total: ${(generatedQuote.piece_width * generatedQuote.piece_height * generatedQuote.quantity / 10000).toFixed(2)} m²

💰 *Costos:*
• Material: $${generatedQuote.material_cost.toFixed(2)} MXN
• Corte láser: $${generatedQuote.cutting_cost.toFixed(2)} MXN
${generatedQuote.assembly_cost > 0 ? `• Ensamblaje: $${generatedQuote.assembly_cost.toFixed(2)} MXN` : ''}
• Subtotal: $${generatedQuote.subtotal.toFixed(2)} MXN
• IVA (16%): $${generatedQuote.iva.toFixed(2)} MXN
• *Total: $${generatedQuote.total.toFixed(2)} MXN*

📱 Generado por Mayand`;

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const generatePDF = () => {
    // TODO: Implementar generación de PDF
    toast.info('Función de PDF próximamente disponible');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#110363' }}>
      {/* Header */}
      <header className="mx-auto h-16 border-b border-border/60 bg-gradient-to-r from-background/95 to-muted/10 backdrop-blur supports-[backdrop-filter]:bg-background/90 flex items-center justify-between px-6 shadow-md rounded-b-lg">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-8">
            <Image
              src={currentLogo}
              alt="Mayand Logo"
              width={150}
              height={40}
              className="transition-all duration-300"
            />
          </Link>
        </div>

        {/* Desktop: Share and PDF Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {generatedQuote && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={shareOnWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </>
          )}
        </div>

        {/* Mobile: Share and PDF Buttons */}
        <div className="md:hidden flex items-center gap-2">
          {generatedQuote && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-2 py-1 shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
              >
                <FileText className="h-3 w-3" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={shareOnWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-2 py-1 shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Calculadora de Corte Láser
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Obtén una cotización precisa para tus proyectos de corte láser.
            Selecciona el material, especifica las dimensiones y calcula el costo total.
          </p>
        </div>

        <LaserCalculator onQuoteGenerated={handleQuoteGenerated} />
      </main>

      {/* Footer */}
      <footer className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/85 border-t border-border/60 py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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