'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DimensionCalculator } from '@/components/DimensionCalculator';
import { FileUpload } from '@/components/FileUpload';
import { PDFPreview } from '@/components/PDFPreview';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { calculateQuote } from '@/lib/calculations';
import { Material, QuoteData } from '@/types';
import { Menu, MessageCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, setWidth] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [height, setHeight] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [material, setMaterial] = useState<Material>('vinil');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
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

    const message = `🖨️ *Cotización Printología*

📏 *Dimensiones:*
• Ancho: ${width} cm
• Alto: ${height} cm
• Área: ${quote.area.toFixed(2)} m²

🏷️ *Material:* ${quote.material === 'vinil' ? 'Vinil' : 'Lona'}

💰 *Precios:*
• Precio unitario: $${quote.unitPrice.toFixed(2)} MXN/m²
• Subtotal: $${quote.subtotal.toFixed(2)} MXN
• IVA (16%): $${quote.iva.toFixed(2)} MXN
• *Total con IVA: $${quote.total.toFixed(2)} MXN*

${quote.hasBulkDiscount ? '🎉 ¡Descuento por volumen aplicado!' : ''}

📱 Generado por Printología`;

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
            alt="Printología Logo"
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

        {/* Mobile: WhatsApp Share & Menu */}
        <div className="md:hidden flex items-center gap-2">
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

          <Button variant="ghost" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content - Fixed Layout */}
      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        {/* Desktop Layout - Fixed Grid */}
        <div className="hidden lg:grid lg:grid-cols-[320px_1fr_400px] lg:h-full lg:gap-0">
          {/* Left Sidebar - Calculator & Upload */}
          <div className="border-r-2 border-border/60 bg-background/80 backdrop-blur-sm p-4 overflow-y-auto shadow-lg">
            <div className="space-y-2">
              <DimensionCalculator onChange={handleDimensionChange} />
              <FileUpload onFileSelect={setPdfFile} selectedFile={pdfFile} />
            </div>
          </div>

          {/* Center Panel - PDF Preview */}
          <div className="border-r-2 border-border/60 bg-background/60 backdrop-blur-sm p-6 overflow-hidden shadow-lg">
            <PDFPreview file={pdfFile} />
          </div>

          {/* Right Panel - Quote */}
          <div className="bg-background/80 backdrop-blur-sm shadow-lg h-full">
            <QuoteDisplay quote={quote} />
          </div>
        </div>

        {/* Mobile/Tablet Layout - Tabs */}
        <div className="lg:hidden h-full overflow-hidden">
          <Tabs defaultValue="calculator" className="h-full flex flex-col">
            <div className="border-b-2 border-border/80 bg-background/98 backdrop-blur px-4 py-2 shadow-sm">
              <TabsList className="grid w-full grid-cols-2 border-2 border-border/60">
                <TabsTrigger value="calculator" className="text-xs">Calculadora</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="calculator" className="h-full overflow-y-auto">
                <div className="space-y-4 p-4">
                  <DimensionCalculator onChange={handleDimensionChange} />
                  <QuoteDisplay quote={quote} />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full overflow-y-auto">
                <div className="space-y-4 p-4">
                  <FileUpload onFileSelect={setPdfFile} selectedFile={pdfFile} />
                  <PDFPreview file={pdfFile} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

    </div>
  );
}
