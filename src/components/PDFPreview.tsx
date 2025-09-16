'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, Download } from 'lucide-react';

interface PDFPreviewProps {
  file: File | null;
}

export function PDFPreview({ file }: PDFPreviewProps) {
  if (!file) {
    return (
      <Card className="w-full h-full flex items-center justify-center glassmorphism fade-in">
        <CardContent className="text-center">
          <FileText className="mx-auto h-20 w-20 text-muted-foreground mb-6 animate-pulse" />
          <p className="text-muted-foreground text-lg font-medium">Sube un archivo PDF para ver la preview</p>
          <p className="text-muted-foreground/70 text-sm mt-2">Arrastra y suelta o haz clic para seleccionar</p>
        </CardContent>
      </Card>
    );
  }

  // Create object URL for the PDF
  const pdfUrl = URL.createObjectURL(file);

  return (
    <Card className="w-full h-full glassmorphism fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Preview PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* PDF Info */}
        <div className="mb-4 p-4 bg-muted/80 rounded-lg border-2 border-border/90 hover-lift shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-red-500 animate-pulse" />
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Tipo: {file.type}
              </p>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 border-2 border-border/90 rounded-lg overflow-hidden shadow-inner bg-muted/30">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={`Preview of ${file.name}`}
            onLoad={() => {
              // Clean up object URL after iframe loads
              setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 hover-lift transition-all duration-200 border-2 border-primary/30 shadow-sm">
              <Eye className="h-4 w-4" />
              Ver en nueva pestaña
            </button>
          </a>
          <a
            href={pdfUrl}
            download={file.name}
            className="flex-1"
          >
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 hover-lift transition-all duration-200 border-2 border-border/80 shadow-sm">
              <Download className="h-4 w-4" />
              Descargar
            </button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}