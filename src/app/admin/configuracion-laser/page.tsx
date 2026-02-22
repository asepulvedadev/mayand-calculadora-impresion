'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, Refresh, Error as ErrorIcon, Add, Edit, Delete, Visibility } from '@mui/icons-material';
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
    cutting_rate_per_minute: 0,
    profit_margin: 0,
    materials: [],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

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
      // Cargar materiales
      const data = await getActiveMaterials();
      setMaterials(data);

      // Cargar configuración general
      try {
        const configResponse = await fetch('/api/laser/config');
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setConfig(prev => ({
            ...prev,
            cutting_rate_per_minute: configData.data.cutting_rate_per_minute,
            profit_margin: configData.data.profit_margin,
            materials: data
          }));
        } else {
          // Valores por defecto si no hay configuración guardada
          setConfig(prev => ({
            ...prev,
            cutting_rate_per_minute: 8,
            profit_margin: 0.50,
            materials: data
          }));
        }
      } catch (configError) {
        console.error('Error loading config:', configError);
        // Valores por defecto en caso de error
        setConfig(prev => ({
          ...prev,
          cutting_rate_per_minute: 8,
          profit_margin: 0.50,
          materials: data
        }));
      }
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

  const handleSaveConfig = async () => {
    setSaving(true);
    setErrors([]);
    setSuccessMessage('');

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
        let errorMessage: string = 'Error al guardar configuración general';
        try {
          const errorData = await generalConfigResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      // Recargar configuración para confirmar cambios
      await loadConfiguration();

      // Mostrar notificación de éxito
      setSuccessMessage('✅ Configuración guardada exitosamente');

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error saving configuration:', error);
      setErrors([error instanceof Error ? error.message : 'Error al guardar la configuración']);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMaterials = async () => {
    setSaving(true);
    setErrors([]);
    setSuccessMessage('');

    try {
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
          let errorMessage = `Error al guardar precio del material ${material.name}`;
          try {
            const errorData = await materialResponse.json();
            console.error('Error response:', errorData);
            errorMessage = `${errorMessage}: ${errorData.error || 'Material no encontrado'}`;
          } catch (jsonError) {
            console.error('Error parsing material error response:', jsonError);
          }
          throw new Error(errorMessage);
        }
      }

      // Recargar configuración para confirmar cambios
      await loadConfiguration();

      // Mostrar notificación de éxito
      setSuccessMessage('✅ Precios de materiales guardados exitosamente');

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('Error saving materials:', error);
      setErrors([error instanceof Error ? error.message : 'Error al guardar los precios de materiales']);
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
        let errorMessage = 'Error al crear el material';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing create material error response:', jsonError);
        }
        throw new Error(errorMessage);
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

      // Mostrar notificación de éxito
      setSuccessMessage('✅ Material creado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);

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
        let errorMessage = 'Error al actualizar el material';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing update material error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      setIsEditDialogOpen(false);
      setEditingMaterial(null);
      await loadConfiguration();

      // Mostrar notificación de éxito
      setSuccessMessage('✅ Material actualizado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);

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
        let errorMessage = 'Error al eliminar el material';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing delete material error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      await loadConfiguration();

      // Mostrar notificación de éxito
      setSuccessMessage('✅ Material eliminado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);

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
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <Refresh className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
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
                  <Add className="h-4 w-4 mr-2" />
                  Nuevo Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Crear Nuevo Material</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-4">
                  <div className="space-y-3">
                    <Label htmlFor="new-name" className="text-sm font-medium">Nombre del Material *</Label>
                    <Input
                      id="new-name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: MDF 3mm Blanco"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-thickness" className="text-sm font-medium">Espesor (mm) *</Label>
                    <Input
                      id="new-thickness"
                      type="number"
                      step="0.1"
                      value={newMaterial.thickness}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, thickness: e.target.value }))}
                      placeholder="3.0"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-sheet-width" className="text-sm font-medium">Ancho lámina (cm) *</Label>
                    <Input
                      id="new-sheet-width"
                      type="number"
                      value={newMaterial.sheet_width}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, sheet_width: e.target.value }))}
                      placeholder="122"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-sheet-height" className="text-sm font-medium">Alto lámina (cm) *</Label>
                    <Input
                      id="new-sheet-height"
                      type="number"
                      value={newMaterial.sheet_height}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, sheet_height: e.target.value }))}
                      placeholder="244"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-usable-width" className="text-sm font-medium">Ancho útil (cm) *</Label>
                    <Input
                      id="new-usable-width"
                      type="number"
                      value={newMaterial.usable_width}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, usable_width: e.target.value }))}
                      placeholder="120"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-usable-height" className="text-sm font-medium">Alto útil (cm) *</Label>
                    <Input
                      id="new-usable-height"
                      type="number"
                      value={newMaterial.usable_height}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, usable_height: e.target.value }))}
                      placeholder="240"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-price" className="text-sm font-medium">Precio por lámina ($) *</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      value={newMaterial.price_per_sheet}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, price_per_sheet: e.target.value }))}
                      placeholder="150.00"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="new-color" className="text-sm font-medium">Color</Label>
                    <Input
                      id="new-color"
                      value={newMaterial.color}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="Blanco"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3 col-span-2">
                    <Label htmlFor="new-finish" className="text-sm font-medium">Acabado</Label>
                    <Input
                      id="new-finish"
                      value={newMaterial.finish}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, finish: e.target.value }))}
                      placeholder="Mate"
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="px-6 py-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateMaterial}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <>
                        <Refresh className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Add className="h-4 w-4 mr-2" />
                        Crear Material
                      </>
                    )}
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
                      <Delete className="h-4 w-4" />
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Editar Material</DialogTitle>
          </DialogHeader>
          {editingMaterial && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="edit-name" className="text-sm font-medium">Nombre del Material *</Label>
                <Input
                  id="edit-name"
                  value={editingMaterial.name}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-thickness" className="text-sm font-medium">Espesor (mm) *</Label>
                <Input
                  id="edit-thickness"
                  type="number"
                  step="0.1"
                  value={editingMaterial.thickness}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, thickness: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-sheet-width" className="text-sm font-medium">Ancho lámina (cm) *</Label>
                <Input
                  id="edit-sheet-width"
                  type="number"
                  value={editingMaterial.sheet_width}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, sheet_width: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-sheet-height" className="text-sm font-medium">Alto lámina (cm) *</Label>
                <Input
                  id="edit-sheet-height"
                  type="number"
                  value={editingMaterial.sheet_height}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, sheet_height: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-usable-width" className="text-sm font-medium">Ancho útil (cm) *</Label>
                <Input
                  id="edit-usable-width"
                  type="number"
                  value={editingMaterial.usable_width}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, usable_width: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-usable-height" className="text-sm font-medium">Alto útil (cm) *</Label>
                <Input
                  id="edit-usable-height"
                  type="number"
                  value={editingMaterial.usable_height}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, usable_height: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-price" className="text-sm font-medium">Precio por lámina ($) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingMaterial.price_per_sheet}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, price_per_sheet: parseFloat(e.target.value) || 0 } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-color" className="text-sm font-medium">Color</Label>
                <Input
                  id="edit-color"
                  value={editingMaterial.color || ''}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, color: e.target.value } : null)}
                  className="h-10"
                />
              </div>
              <div className="space-y-3 col-span-2">
                <Label htmlFor="edit-finish" className="text-sm font-medium">Acabado</Label>
                <Input
                  id="edit-finish"
                  value={editingMaterial.finish || ''}
                  onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, finish: e.target.value } : null)}
                  className="h-10"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditMaterial}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <>
                  <Refresh className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mensaje de éxito */}
      {successMessage && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errores */}
      {errors.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <ErrorIcon className="h-5 w-5" />
              <span className="font-semibold text-lg">Errores:</span>
            </div>
            <ul className="mt-3 text-sm text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Botón de guardar materiales */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSaveMaterials}
          disabled={saving}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
        >
          {saving ? (
            <Refresh className="h-5 w-5 mr-3 animate-spin" />
          ) : (
            <Save className="h-5 w-5 mr-3" />
          )}
          {saving ? 'Guardando...' : 'Guardar Precios de Materiales'}
        </Button>
      </div>
    </div>
  );
}