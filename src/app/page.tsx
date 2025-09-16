'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DimensionCalculator } from '@/components/DimensionCalculator';
import { FileUpload } from '@/components/FileUpload';
import { PDFPreview } from '@/components/PDFPreview';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { ContactModal } from '@/components/ContactModal';
import { calculateQuote } from '@/lib/calculations';
import { Material, QuoteData } from '@/types';
import { Moon, Sun, Monitor, Menu } from 'lucide-react';
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [currentLogo, setCurrentLogo] = useState('/logo_dark.svg');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleDimensionChange = (newWidth: number, newHeight: number, newMaterial: Material) => {
    setWidth(newWidth);
    setHeight(newHeight);
    setMaterial(newMaterial);
    const newQuote = calculateQuote(newWidth, newHeight, newMaterial);
    setQuote(newQuote);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let actualTheme: 'light' | 'dark';
    if (theme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(actualTheme);
    } else {
      actualTheme = theme;
      root.classList.add(theme);
    }

    // Set logo based on actual theme
    setCurrentLogo(actualTheme === 'dark' ? '/LOGO_DARK.svg' : '/LOGO_LIGHT.svg');
  }, [theme]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      {/* Header */}
      <div className="h-16 border-b-2 border-border/80 bg-background/98 backdrop-blur supports-[backdrop-filter]:bg-background/95 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src={currentLogo}
            alt="Printología Logo"
            width={240}
            height={60}
            
            className="transition-all duration-300"
          />
          
        </div>

        {/* Desktop: Theme Toggle & Contact Button */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsContactModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Enviar Cotización
          </Button>
          <Button
            variant={theme === 'light' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('system')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile: Hamburger Menu & Contact Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsContactModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          >
            Cotización
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Tema Claro
                {theme === 'light' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Tema Oscuro
                {theme === 'dark' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Sistema
                {theme === 'system' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        quote={quote}
        pdfFile={pdfFile}
      />
    </div>
  );
}
