'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Layers } from 'lucide-react';
import { LaserMaterial } from '@/types/laser';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/lib/laserApi';
import { toast } from 'sonner';

const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors';
const labelClass = 'block text-[10px] sm:text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider';

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<LaserMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LaserMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '', thickness: '', sheet_width: '', sheet_height: '',
    usable_width: '', usable_height: '', price_per_sheet: '',
    color: '', finish: '', is_active: true,
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const data = await getAllMaterials();
      setMaterials(data);
    } catch (error) {
      toast.error('Error al cargar materiales');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', thickness: '', sheet_width: '', sheet_height: '',
      usable_width: '', usable_height: '', price_per_sheet: '',
      color: '', finish: '', is_active: true,
    });
    setEditingMaterial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const materialData = {
      name: formData.name,
      thickness: parseFloat(formData.thickness),
      sheet_width: parseFloat(formData.sheet_width),
      sheet_height: parseFloat(formData.sheet_height),
      usable_width: parseFloat(formData.usable_width),
      usable_height: parseFloat(formData.usable_height),
      price_per_sheet: parseFloat(formData.price_per_sheet),
      color: formData.color || undefined,
      finish: formData.finish || undefined,
      is_active: formData.is_active,
    };

    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, materialData);
        toast.success('Material actualizado correctamente');
      } else {
        await createMaterial(materialData);
        toast.success('Material creado correctamente');
      }
      setDialogOpen(false);
      resetForm();
      loadMaterials();
    } catch (error) {
      toast.error('Error al guardar material');
      console.error(error);
    }
  };

  const handleEdit = (material: LaserMaterial) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      thickness: material.thickness.toString(),
      sheet_width: material.sheet_width.toString(),
      sheet_height: material.sheet_height.toString(),
      usable_width: material.usable_width.toString(),
      usable_height: material.usable_height.toString(),
      price_per_sheet: material.price_per_sheet.toString(),
      color: material.color || '',
      finish: material.finish || '',
      is_active: material.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este material?')) return;

    try {
      await deleteMaterial(id);
      toast.success('Material eliminado correctamente');
      loadMaterials();
    } catch (error) {
      toast.error('Error al eliminar material');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#458FFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Materiales</h1>
          <p className="text-white/30 text-xs sm:text-sm mt-1">Administra materiales para corte láser</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#458FFF] hover:bg-[#3a7de6] text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Nuevo Material</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0735] border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingMaterial ? 'Editar Material' : 'Nuevo Material'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Grosor (mm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.thickness}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ancho lámina (cm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sheet_width}
                    onChange={(e) => setFormData({ ...formData, sheet_width: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Alto lámina (cm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sheet_height}
                    onChange={(e) => setFormData({ ...formData, sheet_height: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Ancho útil (cm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.usable_width}
                    onChange={(e) => setFormData({ ...formData, usable_width: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Alto útil (cm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.usable_height}
                    onChange={(e) => setFormData({ ...formData, usable_height: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Precio/lámina ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_per_sheet}
                    onChange={(e) => setFormData({ ...formData, price_per_sheet: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Acabado</label>
                  <input
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <label htmlFor="is_active" className="text-white/40 text-sm">Activo</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl border-white/[0.08] text-white/40 hover:text-white/70">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#458FFF] hover:bg-[#3a7de6] text-white rounded-xl">
                  {editingMaterial ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Materials list */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Nombre</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Grosor</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Dimensiones</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Precio</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Estado</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/25">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-white text-sm font-medium">{material.name}</p>
                    {material.color && <p className="text-white/20 text-xs">{material.color}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-white/40 text-sm">{material.thickness} mm</td>
                  <td className="px-4 py-3.5">
                    <p className="text-white/40 text-sm">{material.sheet_width} x {material.sheet_height} cm</p>
                    <p className="text-white/20 text-xs">Útil: {material.usable_width} x {material.usable_height} cm</p>
                  </td>
                  <td className="px-4 py-3.5 text-white text-sm font-medium">${material.price_per_sheet.toFixed(2)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      material.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    }`}>
                      {material.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(material)}
                        className="p-2 text-white/20 hover:text-[#458FFF] transition-colors rounded-lg hover:bg-white/[0.04]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-white/[0.04]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {materials.map((material) => (
            <div key={material.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">{material.name}</p>
                  <p className="text-white/25 text-xs mt-0.5">
                    {material.thickness}mm · {material.sheet_width} x {material.sheet_height} cm
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-white font-bold text-sm">${material.price_per_sheet.toFixed(2)}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                      material.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                    }`}>
                      {material.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(material)}
                    className="p-2 text-white/20 hover:text-[#458FFF] transition-colors rounded-lg"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="text-center py-12">
            <Layers size={32} className="mx-auto text-white/10 mb-2" />
            <p className="text-white/25 text-sm">No hay materiales</p>
          </div>
        )}
      </div>
    </div>
  );
}
