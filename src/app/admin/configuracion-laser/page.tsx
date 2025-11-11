'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { LaserMaterial } from '@/types/laser';
import { getActiveMaterials } from '@/lib/laserApi';

interface LaserConfig {
  cutting_rate_per_minute: number;
  profit_margin: number;
  materials: LaserMaterial[];
}

export default function LaserConfigurationPage() {
  const [materials, setMaterials] = useState<LaserMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<LaserConfig>({
    cutting_rate_per_minute: 8,
    profit_margin: 0.50,
    materials: [],
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const data = await getActiveMaterials();
      setMaterials(data);
      setConfig(prev => ({ ...prev, materials: data }));
    } catch (error) {
      console.error('Error loading configuration:', error);
      setErrors(['Error al cargar la configuración']);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialPriceChange = (materialId: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return;

    setConfig(prev => ({
      ...prev,
      materials: prev.materials.map(material =>
        material.id === materialId
          ? { ...material, price_per_sheet: price }
          : material
      ),
    }));
  };

  const handleConfigChange = (field: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue < 0) return;

    setConfig(prev => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors([]);

    try {
      // Guardar configuración general
      const generalConfigResponse = await fetch('/api/laser/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cutting_rate_per_minute: config.cutting_rate_per_minute,
          profit_margin: config.profit_margin,
        }),
      });

      if (!generalConfigResponse.ok) {
        throw new Error('Error al guardar configuración general');
      }

      // Guardar precios de materiales
      for (const material of config.materials) {
        const materialResponse = await fetch(`/api/laser/materials/${material.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_per_sheet: material.price_per_sheet,
          }),
        });

        if (!materialResponse.ok) {
          throw new Error(`Error al guardar precio del material ${material.name}`);
        }
      }

      // Recargar configuración para confirmar cambios
      await loadConfiguration();
      setErrors([]);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setErrors([error instanceof Error ? error.message : 'Error al guardar la configuración']);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuración de Corte Láser</h1>
          <p className="text-white/80 mt-2">Ajusta precios y configuraciones para las cotizaciones</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Configuración General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cutting_rate">Costo de corte por minuto ($)</Label>
              <Input
                id="cutting_rate"
                type="number"
                step="0.01"
                value={config.cutting_rate_per_minute}
                onChange={(e) => handleConfigChange('cutting_rate_per_minute', e.target.value)}
                placeholder="8.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profit_margin">Margen de utilidad (%)</Label>
              <Input
                id="profit_margin"
                type="number"
                step="0.01"
                value={(config.profit_margin * 100).toFixed(2)}
                onChange={(e) => handleConfigChange('profit_margin', parseFloat(e.target.value) / 100)}
                placeholder="50.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precios de Materiales */}
      <Card>
        <CardHeader>
          <CardTitle>Precios de Materiales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{material.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {material.thickness}mm - {material.sheet_width} × {material.sheet_height} cm
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Label htmlFor={`price-${material.id}`} className="text-sm">
                      Precio por lámina ($)
                    </Label>
                    <Input
                      id={`price-${material.id}`}
                      type="number"
                      step="0.01"
                      value={material.price_per_sheet.toFixed(2)}
                      onChange={(e) => handleMaterialPriceChange(material.id, e.target.value)}
                      className="w-32 mt-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Errores */}
      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Errores:</span>
            </div>
            <ul className="mt-2 text-sm text-destructive">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}