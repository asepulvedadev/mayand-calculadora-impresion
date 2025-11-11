'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, AlertCircle } from 'lucide-react';
import { LaserMaterial, LaserQuoteInput, LaserQuote } from '@/types/laser';
import { getActiveMaterials } from '@/lib/laserApi';
import { validateLaserQuoteInput } from '@/lib/laserCalculations';

interface LaserCalculatorProps {
  onQuoteGenerated?: (quote: LaserQuote) => void;
}

export function LaserCalculator({ onQuoteGenerated }: LaserCalculatorProps) {
  const [materials, setMaterials] = useState<LaserMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<LaserMaterial | null>(null);
  const [formData, setFormData] = useState({
    material_id: '',
    piece_width: '',
    piece_height: '',
    quantity: '',
    cutting_minutes: '',
    requires_assembly: false,
    assembly_cost_per_piece: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [quote, setQuote] = useState<LaserQuote | null>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await getActiveMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialChange = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    setSelectedMaterial(material || null);
    setFormData(prev => ({ ...prev, material_id: materialId }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!selectedMaterial) {
      setErrors(['Selecciona un material']);
      return;
    }

    const input: LaserQuoteInput = {
      material_id: formData.material_id,
      piece_width: parseFloat(formData.piece_width),
      piece_height: parseFloat(formData.piece_height),
      quantity: parseFloat(formData.quantity),
      cutting_minutes: parseFloat(formData.cutting_minutes),
      requires_assembly: formData.requires_assembly,
      assembly_cost_per_piece: formData.assembly_cost_per_piece ? parseFloat(formData.assembly_cost_per_piece) : undefined,
    };

    const validationErrors = validateLaserQuoteInput(input);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);

    try {
      const response = await fetch('/api/calculations/laser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          material_id: formData.material_id,
          piece_width: formData.piece_width,
          piece_height: formData.piece_height,
          quantity: formData.quantity,
          cutting_minutes: formData.cutting_minutes,
          requires_assembly: formData.requires_assembly,
          assembly_cost_per_piece: formData.assembly_cost_per_piece || undefined,
          cutting_rate_per_minute: 8, // $8 por minuto
          profit_margin: 0.50, // 50% utilidad
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al calcular la cotización');
      }

      const calculatedQuote = await response.json();
      setQuote(calculatedQuote);

      if (onQuoteGenerated) {
        onQuoteGenerated(calculatedQuote);
      }
    } catch (error) {
      console.error('Error calculating quote:', error);
      setErrors([error instanceof Error ? error.message : 'Error al calcular la cotización']);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Corte Láser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Material Selection */}
          <div className="space-y-2">
            <Label htmlFor="material" className="text-white">Material</Label>
            <select
              id="material"
              value={formData.material_id}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="flex h-10 w-full rounded-md border-2 border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/20 transition-all"
              style={{
                colorScheme: 'dark'
              }}
            >
              <option value="" className="bg-[#110363] text-white">Selecciona un material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id} className="bg-[#110363] text-white py-2">
                  {material.name} - {material.thickness}mm
                  {material.color && ` (${material.color})`}
                </option>
              ))}
            </select>
          </div>

          {selectedMaterial && (
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <h4 className="font-medium mb-2 text-white">Especificaciones del Material</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-white/90">
                <div>
                  <span className="font-medium text-white">Lámina:</span> {selectedMaterial.sheet_width} × {selectedMaterial.sheet_height} cm
                </div>
                <div>
                  <span className="font-medium text-white">Área útil:</span> {selectedMaterial.usable_width} × {selectedMaterial.usable_height} cm
                </div>
                <div>
                  <span className="font-medium text-white">Precio:</span> ${selectedMaterial.price_per_sheet.toFixed(2)} MXN
                </div>
                {selectedMaterial.finish && (
                  <div>
                    <span className="font-medium text-white">Acabado:</span> {selectedMaterial.finish}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="piece_width">Ancho de la pieza (cm)</Label>
              <Input
                id="piece_width"
                type="number"
                step="0.01"
                value={formData.piece_width}
                onChange={(e) => handleInputChange('piece_width', e.target.value)}
                placeholder="120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="piece_height">Alto de la pieza (cm)</Label>
              <Input
                id="piece_height"
                type="number"
                step="0.01"
                value={formData.piece_height}
                onChange={(e) => handleInputChange('piece_height', e.target.value)}
                placeholder="80"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad de piezas</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="1"
            />
          </div>

          {/* Cutting Time */}
          <div className="space-y-2">
            <Label htmlFor="cutting_minutes">Minutos de corte</Label>
            <Input
              id="cutting_minutes"
              type="number"
              step="0.01"
              value={formData.cutting_minutes}
              onChange={(e) => handleInputChange('cutting_minutes', e.target.value)}
              placeholder="5.5"
            />
          </div>

          {/* Assembly */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requires_assembly"
                checked={formData.requires_assembly}
                onCheckedChange={(checked) => handleInputChange('requires_assembly', checked as boolean)}
              />
              <Label htmlFor="requires_assembly">Requiere ensamblaje</Label>
            </div>

            {formData.requires_assembly && (
              <div className="space-y-2">
                <Label htmlFor="assembly_cost_per_piece">Costo de ensamblaje por pieza ($)</Label>
                <Input
                  id="assembly_cost_per_piece"
                  type="number"
                  step="0.01"
                  value={formData.assembly_cost_per_piece}
                  onChange={(e) => handleInputChange('assembly_cost_per_piece', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Errores de validación:</span>
              </div>
              <ul className="mt-2 text-sm text-destructive">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Cotización
          </Button>
        </CardContent>
      </Card>

      {/* Quote Display */}
      {quote && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado de la Cotización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Material:</span> {quote.material.name} {quote.material.thickness}mm
              </div>
              <div>
                <span className="font-medium">Láminas necesarias:</span> {quote.sheets_needed}
              </div>
              <div>
                <span className="font-medium">Dimensiones por pieza:</span> {quote.piece_width} × {quote.piece_height} cm
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Material:</span>
                <span>${quote.material_cost.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Corte láser ({quote.cutting_minutes} min):</span>
                <span>${quote.cutting_cost.toFixed(2)} MXN</span>
              </div>
              {quote.assembly_cost > 0 && (
                <div className="flex justify-between">
                  <span>Ensamblaje:</span>
                  <span>${quote.assembly_cost.toFixed(2)} MXN</span>
                </div>
              )}
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Subtotal costos:</span>
                <span>${(quote.material_cost + quote.cutting_cost + quote.assembly_cost).toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Utilidad (50%):</span>
                <span>${((quote.material_cost + quote.cutting_cost + quote.assembly_cost) * 0.50).toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Subtotal:</span>
                <span>${quote.subtotal.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (16%):</span>
                <span>${quote.iva.toFixed(2)} MXN</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>${quote.total.toFixed(2)} MXN</span>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">
                Precio por pieza: ${quote.total.toFixed(2)} MXN
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}