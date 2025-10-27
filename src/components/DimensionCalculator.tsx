'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Material } from '@/types';
import { Calculator, Ruler, Sparkles } from 'lucide-react';

interface DimensionCalculatorProps {
  onChange: (width: number, height: number, material: Material, isPromotion: boolean) => void;
}

export function DimensionCalculator({ onChange }: DimensionCalculatorProps) {
  const [width, setWidth] = useState<number | ''>(100);
  const [height, setHeight] = useState<number | ''>(100);
  const [material, setMaterial] = useState<Material>('vinil');
  const [isPromotion, setIsPromotion] = useState(false);

  // Get max width based on material
  const getMaxWidth = (material: Material): number => {
    return material === 'lona' ? 180 : 150;
  };

  // Send initial values to parent on mount only
  useEffect(() => {
    onChange(100, 100, 'vinil', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWidthChange = (value: string) => {
    if (value === '') {
      setWidth('');
      onChange(0, typeof height === 'number' ? height : 0, material, isPromotion);
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) return;

    // Clamp width between 1 and material-specific max
    const maxWidth = getMaxWidth(material);
    const clampedWidth = Math.max(1, Math.min(maxWidth, num));
    setWidth(clampedWidth);
    onChange(clampedWidth, typeof height === 'number' ? height : 0, material, isPromotion);
  };

  const handleHeightChange = (value: string) => {
    if (value === '') {
      setHeight('');
      onChange(typeof width === 'number' ? width : 0, 0, material, isPromotion);
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) return;

    // Clamp height between 1 and 3600 cm (no minimum restriction)
    const clampedHeight = Math.max(1, Math.min(3600, num));
    setHeight(clampedHeight);
    onChange(typeof width === 'number' ? width : 0, clampedHeight, material, isPromotion);
  };

  const handleMaterialChange = (selectedMaterial: 'vinil' | 'lona' | 'vinil_transparente') => {
    setMaterial(selectedMaterial);

    // Re-validate width if it exceeds the new material's limit
    let validatedWidth = typeof width === 'number' ? width : 0;
    const maxWidth = getMaxWidth(selectedMaterial);
    if (validatedWidth > maxWidth) {
      validatedWidth = maxWidth;
      setWidth(validatedWidth);
    }

    onChange(validatedWidth, typeof height === 'number' ? height : 0, selectedMaterial, isPromotion);
  };

  const handlePromotionChange = (checked: boolean) => {
    setIsPromotion(checked);
    onChange(typeof width === 'number' ? width : 0, typeof height === 'number' ? height : 0, material, checked);
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
               max={getMaxWidth(material)}
               placeholder={`Ej: ${getMaxWidth(material)}`}
               className={`border-2 focus:border-primary ${
                 (typeof width === 'number' && (width <= 1 || width >= getMaxWidth(material)))
                   ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 1-{getMaxWidth(material)} cm</p>
           </div>
           <div className="space-y-2">
             <Label htmlFor="height">Alto (cm)</Label>
             <Input
               id="height"
               type="number"
               value={height}
               onChange={(e) => handleHeightChange(e.target.value)}
               min="1"
               max="3600"
               placeholder="Ej: 100"
               className={`border-2 focus:border-primary ${
                 (typeof height === 'number' && (height <= 1 || height >= 3600))
                   ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 1-3600 cm</p>
           </div>
         </div>

        <div className="space-y-1">
          <Label className="text-sm">Material</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMaterialChange('vinil')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                material === 'vinil'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md active:bg-blue-200 active:border-blue-600'
              }`}
            >
              Vinil
            </button>
            <button
              onClick={() => handleMaterialChange('lona')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                material === 'lona'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md active:bg-blue-200 active:border-blue-600'
              }`}
            >
              Lona
            </button>
            <button
              onClick={() => handleMaterialChange('vinil_transparente')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                material === 'vinil_transparente'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'border-gray-300 bg-gray-100 text-gray-700 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md active:bg-blue-200 active:border-blue-600'
              }`}
            >
              Vinil Transp.
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 rounded-md border-2 border-yellow-400/50 dark:border-yellow-600/50 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className={`h-4 w-4 ${isPromotion ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`} />
              <Label htmlFor="promotion" className="text-sm font-semibold cursor-pointer">
                Precio Promocional
              </Label>
            </div>
            <Switch
              id="promotion"
              checked={isPromotion}
              onCheckedChange={handlePromotionChange}
              className="data-[state=checked]:bg-yellow-600"
            />
          </div>
          {isPromotion && (
            <p className="text-xs text-yellow-700 dark:text-yellow-400 px-2 animate-in fade-in">
              ✨ Precios especiales: Vinil $120, Transp. $160, Lona $70/m
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-1 rounded-md border-2 border-border/80 shadow-sm">
            <Ruler className="inline h-3 w-3 mr-1" />
            Metros lineales: {(typeof height === 'number' ? height : 0) / 100} m
          </div>
      </CardContent>
    </Card>
  );
}