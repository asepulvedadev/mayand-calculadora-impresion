'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RefreshCw, AlertCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';
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

  // Estados para CRUD de materiales
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LaserMaterial | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    thickness: '',
    sheet_width: '',
    sheet_height: '',
    usable_width: '',
    usable_height: '',
    price_per_sheet: '',
    color: '',
    finish: '',
  });

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
        const errorData = await generalConfigResponse.json();
        throw new Error(errorData.error || 'Error al guardar configuración general');
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

  // Funciones CRUD para materiales
  const handleCreateMaterial = async () => {
    try {
      const materialData = {
        name: newMaterial.name,
        thickness: parseFloat(newMaterial.thickness),
        sheet_width: parseFloat(newMaterial.sheet_width),
        sheet_height: parseFloat(newMaterial.sheet_height),
        usable_width: parseFloat(newMaterial.usable_width),
        usable_height: parseFloat(newMaterial.usable_height),
        price_per_sheet: parseFloat(newMaterial.price_per_sheet),
        color: newMaterial.color || null,
        finish: newMaterial.finish || null,
        is_active: true,
      };

      const response = await fetch('/api/laser/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el material');
      }

      // Resetear formulario y recargar
      setNewMaterial({
        name: '',
        thickness: '',
        sheet_width: '',
        sheet_height: '',
        usable_width: '',
        usable_height: '',
        price_per_sheet: '',
        color: '',
        finish: '',
      });
      setIsCreateDialogOpen(false);
      await loadConfiguration();
    } catch (error) {
      console.error('Error creating material:', error);
      setErrors([error instanceof Error ? error.message : 'Error al crear el material']);
    }
  };

  const handleEditMaterial = async () => {
    if (!editingMaterial) return;

    try {
      const materialData = {
        name: editingMaterial.name,
        thickness: editingMaterial.thickness,
        sheet_width: editingMaterial.sheet_width,
        sheet_height: editingMaterial.sheet_height,
        usable_width: editingMaterial.usable_width,
        usable_height: editingMaterial.usable_height,
        price_per_sheet: editingMaterial.price_per_sheet,
        color: editingMaterial.color || null,
        finish: editingMaterial.finish || null,
        is_active: editingMaterial.is_active,
      };

      const response = await fetch(`/api/laser/materials/${editingMaterial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el material');
      }

      setIsEditDialogOpen(false);
      setEditingMaterial(null);
      await loadConfiguration();
    } catch (error) {
      console.error('Error updating material:', error);
      setErrors([error instanceof Error ? error.message : 'Error al actualizar el material']);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este material?')) return;

    try {
      const response = await fetch(`/api/laser/materials/${materialId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el material');
      }

      await loadConfiguration();
    } catch (error) {
      console.error('Error deleting material:', error);
      setErrors([error instanceof Error ? error.message : 'Error al eliminar el material']);
    }
  };

  const openEditDialog = (material: LaserMaterial) => {
    setEditingMaterial(material);
    setIsEditDialogOpen(true);
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
              <p className="text-xs text-muted-foreground">Costo actual: ${config.cutting_rate_per_minute.toFixed(2)} MXN/min</p>
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
              <p className="text-xs text-muted-foreground">Utilidad actual: {(config.profit_margin * 100).toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Materiales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Materiales</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Material</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nombre</Label>
                    <Input
                      id="new-name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: MDF 3mm Blanco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-thickness">Espesor (mm)</Label>
                    <Input
                      id="new-thickness"
                      type="number"
                      step="0.1"
                      value={newMaterial.thickness}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, thickness: e.target.value }))}
                      placeholder="3.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-sheet-width">Ancho lámina (cm)</Label>
                    <Input
                      id="new-sheet-width"
                      type="number"
                      value={newMaterial.sheet_width}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, sheet_width: e.target.value }))}
                      placeholder="122"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-sheet-height">Alto lámina (cm)</Label>
                    <Input
                      id="new-sheet-height"
                      type="number"
                      value={newMaterial.sheet_height}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, sheet_height: e.target.value }))}
                      placeholder="244"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-usable-width">Ancho útil (cm)</Label>
                    <Input
                      id="new-usable-width"
                      type="number"
                      value={newMaterial.usable_width}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, usable_width: e.target.value }))}
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-usable-height">Alto útil (cm)</Label>
                    <Input
                      id="new-usable-height"
                      type="number"
                      value={newMaterial.usable_height}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, usable_height: e.target.value }))}
                      placeholder="240"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Precio por lámina ($)</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      value={newMaterial.price_per_sheet}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, price_per_sheet: e.target.value }))}
                      placeholder="150.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-color">Color</Label>
                    <Input
                      id="new-color"
                      value={newMaterial.color}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="Blanco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-finish">Acabado</Label>
                    <Input
                      id="new-finish"
                      value={newMaterial.finish}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, finish: e.target.value }))}
                      placeholder="Mate"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMaterial}>
                    Crear Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{material.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {material.thickness}mm - Lámina: {material.sheet_width} × {material.sheet_height} cm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Área útil: {material.usable_width} × {material.usable_height} cm
                    {material.color && ` - Color: ${material.color}`}
                    {material.finish && ` - Acabado: ${material.finish}`}
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
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          {editingMaterial && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-thickness">Espesor (mm)</Label>
                <Input
                  id="edit-thickness"
                  type="number"
                  step="0.1"
                  value={editingMaterial.thickness}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, thickness: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sheet-width">Ancho lámina (cm)</Label>
                <Input
                  id="edit-sheet-width"
                  type="number"
                  value={editingMaterial.sheet_width}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, sheet_width: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sheet-height">Alto lámina (cm)</Label>
                <Input
                  id="edit-sheet-height"
                  type="number"
                  value={editingMaterial.sheet_height}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, sheet_height: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usable-width">Ancho útil (cm)</Label>
                <Input
                  id="edit-usable-width"
                  type="number"
                  value={editingMaterial.usable_width}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, usable_width: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usable-height">Alto útil (cm)</Label>
                <Input
                  id="edit-usable-height"
                  type="number"
                  value={editingMaterial.usable_height}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, usable_height: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Precio por lámina ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingMaterial.price_per_sheet}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, price_per_sheet: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  value={editingMaterial.color || ''}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, color: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-finish">Acabado</Label>
                <Input
                  id="edit-finish"
                  value={editingMaterial.finish || ''}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, finish: e.target.value } : null)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditMaterial}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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