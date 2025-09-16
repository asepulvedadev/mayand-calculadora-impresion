'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Solo se aceptan archivos PDF');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB
        setError('El archivo no puede superar los 50MB');
        return;
      }
      setError('');
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full glassmorphism fade-in hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          Subir Archivo PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedFile ? (
          <div
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-muted-foreground/60 rounded-lg p-3 text-center cursor-pointer hover:border-primary/70 hover:bg-primary/10 transition-all duration-300 group shadow-sm"
          >
            <p className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
              Seleccionar archivo PDF
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              Tamaño máximo: 50MB
            </p>
            <Button variant="outline" size="sm" className="hover-lift border-2 border-border/80 text-xs">
              Seleccionar archivo
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 border-2 border-border/80 rounded-lg bg-muted/50 shadow-sm hover-lift">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-red-500 animate-pulse" />
              <div>
                <p className="font-medium text-sm text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile} className="hover:bg-destructive/10 hover:text-destructive border border-border/60 h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-2 border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}