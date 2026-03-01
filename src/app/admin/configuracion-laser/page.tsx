'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Save, Loader2, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { LaserMaterial } from '@/types/laser';
import { getActiveMaterials } from '@/lib/laserApi';

interface LaserConfig {
  cutting_rate_per_minute: number;
  profit_margin: number;
  materials: LaserMaterial[];
}

const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors';
const labelClass = 'block text-[10px] sm:text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider';

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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LaserMaterial | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '', thickness: '', sheet_width: '', sheet_height: '',
    usable_width: '', usable_height: '', price_per_sheet: '', color: '', finish: '',
  });

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const data = await getActiveMaterials();
      setMaterials(data);

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
          setConfig(prev => ({ ...prev, cutting_rate_per_minute: 8, profit_margin: 0.50, materials: data }));
        }
      } catch (configError) {
        console.error('Error loading config:', configError);
        setConfig(prev => ({ ...prev, cutting_rate_per_minute: 8, profit_margin: 0.50, materials: data }));
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
        material.id === materialId ? { ...material, price_per_sheet: price } : material
      ),
    }));
  };

  const handleConfigChange = (field: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue < 0) return;
    setConfig(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const generalConfigResponse = await fetch('/api/laser/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      await loadConfiguration();
      setSuccessMessage('Configuración guardada exitosamente');
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
      for (const material of config.materials) {
        const materialResponse = await fetch(`/api/laser/materials/${material.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price_per_sheet: material.price_per_sheet }),
        });

        if (!materialResponse.ok) {
          let errorMessage = `Error al guardar precio del material ${material.name}`;
          try {
            const errorData = await materialResponse.json();
            errorMessage = `${errorMessage}: ${errorData.error || 'Material no encontrado'}`;
          } catch (jsonError) {
            console.error('Error parsing material error response:', jsonError);
          }
          throw new Error(errorMessage);
        }
      }

      await loadConfiguration();
      setSuccessMessage('Precios de materiales guardados exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving materials:', error);
      setErrors([error instanceof Error ? error.message : 'Error al guardar los precios de materiales']);
    } finally {
      setSaving(false);
    }
  };

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
        headers: { 'Content-Type': 'application/json' },
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

      setNewMaterial({ name: '', thickness: '', sheet_width: '', sheet_height: '', usable_width: '', usable_height: '', price_per_sheet: '', color: '', finish: '' });
      setIsCreateDialogOpen(false);
      await loadConfiguration();
      setSuccessMessage('Material creado exitosamente');
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
        headers: { 'Content-Type': 'application/json' },
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
      setSuccessMessage('Material actualizado exitosamente');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error updating material:', error);
      setErrors([error instanceof Error ? error.message : 'Error al actualizar el material']);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este material?')) return;

    try {
      const response = await fetch(`/api/laser/materials/${materialId}`, { method: 'DELETE' });

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
      setSuccessMessage('Material eliminado exitosamente');
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
      <div className="space-y-5">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
          <div className="animate-pulse space-y-4">
            <div className="h-7 bg-white/[0.06] rounded-lg w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.04] rounded w-1/4"></div>
              <div className="h-10 bg-white/[0.04] rounded-xl"></div>
              <div className="h-4 bg-white/[0.04] rounded w-1/4"></div>
              <div className="h-10 bg-white/[0.04] rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const MaterialFormFields = ({ data, onChange, prefix }: {
    data: Record<string, unknown>;
    onChange: (field: string, value: string | number) => void;
    prefix: string;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
      <div>
        <label className={labelClass} htmlFor={`${prefix}-name`}>Nombre *</label>
        <input id={`${prefix}-name`} value={String(data.name || '')} onChange={(e) => onChange('name', e.target.value)} placeholder="MDF 3mm Blanco" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-thickness`}>Espesor (mm) *</label>
        <input id={`${prefix}-thickness`} type="number" step="0.1" value={String(data.thickness || '')} onChange={(e) => onChange('thickness', e.target.value)} placeholder="3.0" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-sw`}>Ancho lámina (cm) *</label>
        <input id={`${prefix}-sw`} type="number" value={String(data.sheet_width || '')} onChange={(e) => onChange('sheet_width', e.target.value)} placeholder="122" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-sh`}>Alto lámina (cm) *</label>
        <input id={`${prefix}-sh`} type="number" value={String(data.sheet_height || '')} onChange={(e) => onChange('sheet_height', e.target.value)} placeholder="244" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-uw`}>Ancho útil (cm) *</label>
        <input id={`${prefix}-uw`} type="number" value={String(data.usable_width || '')} onChange={(e) => onChange('usable_width', e.target.value)} placeholder="120" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-uh`}>Alto útil (cm) *</label>
        <input id={`${prefix}-uh`} type="number" value={String(data.usable_height || '')} onChange={(e) => onChange('usable_height', e.target.value)} placeholder="240" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-price`}>Precio/lámina ($) *</label>
        <input id={`${prefix}-price`} type="number" step="0.01" value={String(data.price_per_sheet || '')} onChange={(e) => onChange('price_per_sheet', e.target.value)} placeholder="150.00" className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${prefix}-color`}>Color</label>
        <input id={`${prefix}-color`} value={String(data.color || '')} onChange={(e) => onChange('color', e.target.value)} placeholder="Blanco" className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor={`${prefix}-finish`}>Acabado</label>
        <input id={`${prefix}-finish`} value={String(data.finish || '')} onChange={(e) => onChange('finish', e.target.value)} placeholder="Mate" className={inputClass} />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Configuración Láser</h1>
        <p className="text-white/30 text-xs sm:text-sm mt-1">Ajusta precios y configuraciones</p>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 text-xs font-bold">&#10003;</span>
          </div>
          <span className="text-emerald-400 text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-400 font-semibold text-sm">Errores:</span>
          </div>
          <ul className="text-sm text-red-400/80 space-y-0.5 ml-6">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* General Config */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center gap-2">
          <Settings size={16} className="text-white/30" />
          <h2 className="text-sm sm:text-base font-bold text-white">Configuración General</h2>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="cutting_rate">Costo corte/minuto ($)</label>
              <input
                id="cutting_rate"
                type="number"
                step="0.01"
                value={config.cutting_rate_per_minute}
                onChange={(e) => handleConfigChange('cutting_rate_per_minute', e.target.value)}
                placeholder="8.00"
                className={inputClass}
              />
              <p className="text-[10px] text-white/20 mt-1">${config.cutting_rate_per_minute.toFixed(2)} MXN/min</p>
            </div>
            <div>
              <label className={labelClass} htmlFor="profit_margin">Margen utilidad (%)</label>
              <input
                id="profit_margin"
                type="number"
                step="0.01"
                value={(config.profit_margin * 100).toFixed(2)}
                onChange={(e) => handleConfigChange('profit_margin', parseFloat(e.target.value) / 100)}
                placeholder="50.00"
                className={inputClass}
              />
              <p className="text-[10px] text-white/20 mt-1">{(config.profit_margin * 100).toFixed(2)}%</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveConfig}
              disabled={saving}
              className="bg-[#458FFF] hover:bg-[#3a7de6] text-white rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              {saving ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Save size={15} className="mr-1.5" />}
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white">Materiales</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold rounded-xl transition-colors">
                <Plus size={14} />
                Nuevo
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0735] border-white/[0.08]">
              <DialogHeader>
                <DialogTitle className="text-white">Crear Material</DialogTitle>
              </DialogHeader>
              <MaterialFormFields
                data={newMaterial}
                onChange={(field, value) => setNewMaterial(prev => ({ ...prev, [field]: String(value) }))}
                prefix="new"
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl border-white/[0.08] text-white/40 hover:text-white/70">
                  Cancelar
                </Button>
                <Button onClick={handleCreateMaterial} disabled={saving} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                  {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />}
                  Crear
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {config.materials.map((material) => (
            <div key={material.id} className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold">{material.name}</h4>
                  <p className="text-white/25 text-xs mt-0.5">
                    {material.thickness}mm · Lámina: {material.sheet_width} x {material.sheet_height} cm
                  </p>
                  <p className="text-white/20 text-xs">
                    Útil: {material.usable_width} x {material.usable_height} cm
                    {material.color && ` · ${material.color}`}
                    {material.finish && ` · ${material.finish}`}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 sm:flex-none">
                    <label className="text-[9px] text-white/20 uppercase tracking-wider">$/lámina</label>
                    <input
                      type="number"
                      step="0.01"
                      value={material.price_per_sheet.toFixed(2)}
                      onChange={(e) => handleMaterialPriceChange(material.id, e.target.value)}
                      className="w-full sm:w-28 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:border-[#458FFF]/40 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-1 mt-4">
                    <button
                      onClick={() => openEditDialog(material)}
                      className="p-2 text-white/20 hover:text-[#458FFF] transition-colors rounded-lg hover:bg-white/[0.04]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0735] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Material</DialogTitle>
          </DialogHeader>
          {editingMaterial && (
            <MaterialFormFields
              data={{ ...editingMaterial } as Record<string, unknown>}
              onChange={(field, value) => {
                const numFields = ['thickness', 'sheet_width', 'sheet_height', 'usable_width', 'usable_height', 'price_per_sheet'];
                const val = numFields.includes(field) ? (parseFloat(String(value)) || 0) : value;
                setEditingMaterial(prev => prev ? { ...prev, [field]: val } : null);
              }}
              prefix="edit"
            />
          )}
          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-white/[0.08] text-white/40 hover:text-white/70">
              Cancelar
            </Button>
            <Button onClick={handleEditMaterial} disabled={saving} className="bg-[#458FFF] hover:bg-[#3a7de6] text-white rounded-xl">
              {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save materials button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSaveMaterials}
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-3 text-sm font-semibold"
        >
          {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
          {saving ? 'Guardando...' : 'Guardar Precios de Materiales'}
        </Button>
      </div>
    </div>
  );
}
