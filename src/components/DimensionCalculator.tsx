'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calculate, Straighten, AutoAwesome } from '@mui/icons-material';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';
import { PrintCalculatorInput } from '@/lib/validations/calculator';

export function DimensionCalculator() {
  const {
    formData,
    errors,
    setWidth,
    setHeight,
    setMaterial,
    setIsPromotion,
  } = usePrintCalculatorStore();

  // Get max width based on material
  const getMaxWidth = (material: PrintCalculatorInput['material']): number => {
    return material === 'lona' ? 180 : 150;
  };

  const handleWidthChange = (value: string) => {
    if (value === '') {
      setWidth(0);
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      const maxWidth = getMaxWidth(formData.material);
      const clampedWidth = Math.min(maxWidth, num);
      setWidth(clampedWidth);
    }
  };

  const handleHeightChange = (value: string) => {
    if (value === '') {
      setHeight(0);
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      const clampedHeight = Math.min(3600, num);
      setHeight(clampedHeight);
    }
  };

  const handleMaterialChange = (selectedMaterial: PrintCalculatorInput['material']) => {
    setMaterial(selectedMaterial);

    // Re-validate width if it exceeds the new material's limit
    const maxWidth = getMaxWidth(selectedMaterial);
    if (formData.width > maxWidth) {
      setWidth(maxWidth);
    }
  };

  const handlePromotionChange = (checked: boolean) => {
    setIsPromotion(checked);
  };

  return (
    <Card className="w-full glassmorphism fade-in hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculate className="h-4 w-4 text-primary" />
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
               step="1"
               value={formData.width === 0 ? '' : formData.width}
               onChange={(e) => handleWidthChange(e.target.value)}
               min="0"
               max={getMaxWidth(formData.material)}
               placeholder="100"
               className={`border-2 focus:border-primary ${
                 errors.width
                   ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 1-{getMaxWidth(formData.material)} cm</p>
             {errors.width && <p className="text-xs text-red-600">{errors.width}</p>}
           </div>
           <div className="space-y-2">
             <Label htmlFor="height">Alto (cm)</Label>
             <Input
               id="height"
               type="number"
               step="1"
               value={formData.height === 0 ? '' : formData.height}
               onChange={(e) => handleHeightChange(e.target.value)}
               min="0"
               max="3600"
               placeholder="200"
               className={`border-2 focus:border-primary ${
                 errors.height
                   ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                   : 'border-border/80'
               }`}
             />
             <p className="text-xs text-muted-foreground">Rango: 1-3600 cm</p>
             {errors.height && <p className="text-xs text-red-600">{errors.height}</p>}
           </div>
         </div>

        <div className="space-y-1">
          <Label className="text-sm">Material</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMaterialChange('vinil')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                formData.material === 'vinil'
                  ? 'border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/25'
                  : 'border-border bg-muted text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md active:bg-accent/20'
              }`}
            >
              Vinil
            </button>
            <button
              onClick={() => handleMaterialChange('lona')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                formData.material === 'lona'
                  ? 'border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/25'
                  : 'border-border bg-muted text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md active:bg-accent/20'
              }`}
            >
              Lona
            </button>
            <button
              onClick={() => handleMaterialChange('vinil_transparente')}
              className={`px-2 py-2 text-xs font-medium rounded-md border-2 transition-all duration-200 ${
                formData.material === 'vinil_transparente'
                  ? 'border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/25'
                  : 'border-border bg-muted text-muted-foreground hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md active:bg-accent/20'
              }`}
            >
              Vinil Transp.
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-md border-2 border-accent/30 shadow-sm">
            <div className="flex items-center gap-2">
              <AutoAwesome className={`h-4 w-4 ${formData.isPromotion ? 'text-accent' : 'text-muted-foreground'}`} />
              <Label htmlFor="promotion" className="text-sm font-semibold cursor-pointer">
                Precio Promocional
              </Label>
            </div>
            <Switch
              id="promotion"
              checked={formData.isPromotion}
              onCheckedChange={handlePromotionChange}
              className="data-[state=checked]:bg-accent"
            />
          </div>
          {formData.isPromotion && (
            <p className="text-xs text-accent px-2 animate-in fade-in">
              ✨ Precios especiales: Vinil $120, Transp. $160, Lona $120/m
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-1 rounded-md border-2 border-border/80 shadow-sm">
            <Straighten className="inline h-3 w-3 mr-1" />
            Metros lineales: {(formData.height / 100).toFixed(2)} m
          </div>
      </CardContent>
    </Card>
  );
}