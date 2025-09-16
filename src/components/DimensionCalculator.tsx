'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Material } from '@/types';
import { Calculator, Ruler } from 'lucide-react';

interface DimensionCalculatorProps {
  onChange: (width: number, height: number, material: Material) => void;
}

export function DimensionCalculator({ onChange }: DimensionCalculatorProps) {
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [material, setMaterial] = useState<Material>('vinil');

  // Ensure initial values are sent to parent on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    onChange(width, height, material);
  }, []);

  const handleWidthChange = (value: string) => {
    const num = parseFloat(value);
    // If invalid input, keep current value
    if (isNaN(num)) return;

    // Clamp width between 1 and 160 cm
    const clampedWidth = Math.max(1, Math.min(160, num));
    setWidth(clampedWidth);
    onChange(clampedWidth, height, material);
  };

  const handleHeightChange = (value: string) => {
    const num = parseFloat(value);
    // If invalid input, keep current value
    if (isNaN(num)) return;

    // Clamp height between 10 and 3600 cm
    const clampedHeight = Math.max(10, Math.min(3600, num));
    setHeight(clampedHeight);
    onChange(width, clampedHeight, material);
  };

  const handleMaterialChange = (checked: boolean) => {
    const newMaterial = checked ? 'lona' : 'vinil';
    setMaterial(newMaterial);
    onChange(width, height, newMaterial);
  };

  return (
    <Card className="w-full glassmorphism fade-in hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Calculadora de Dimensiones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-2">
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="width">Ancho (cm)</Label>
             <Input
               id="width"
               type="number"
               value={width}
               onChange={(e) => handleWidthChange(e.target.value)}
               min="1"
               max="160"
               placeholder="100"
               className={`border-2 focus:border-primary ${
                 width <= 1 || width >= 160
                   ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 1-160 cm</p>
           </div>
           <div className="space-y-2">
             <Label htmlFor="height">Alto (cm)</Label>
             <Input
               id="height"
               type="number"
               value={height}
               onChange={(e) => handleHeightChange(e.target.value)}
               min="10"
               max="3600"
               placeholder="100"
               className={`border-2 focus:border-primary ${
                 height <= 10 || height >= 3600
                   ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 10-3600 cm</p>
           </div>
         </div>

        <div className="space-y-1">
          <Label className="text-sm">Material</Label>
          <div className="flex gap-2">
            <button
              onClick={() => handleMaterialChange(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border-2 transition-all ${
                material === 'vinil'
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50'
              }`}
            >
              Vinil
            </button>
            <button
              onClick={() => handleMaterialChange(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border-2 transition-all ${
                material === 'lona'
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/50'
              }`}
            >
              Lona
            </button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-1 rounded-md border-2 border-border/80 shadow-sm">
           <Ruler className="inline h-3 w-3 mr-1" />
           Área: {((width * height) / 10000).toFixed(2)} m²
         </div>
      </CardContent>
    </Card>
  );
}