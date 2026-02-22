'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Add, Edit, Delete, Settings } from '@mui/icons-material';
import { LaserMaterial } from '@/types/laser';
import { getAllMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/lib/laserApi';
import { toast } from 'sonner';

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<LaserMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LaserMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    thickness: '',
    sheet_width: '',
    sheet_height: '',
    usable_width: '',
    usable_height: '',
    price_per_sheet: '',
    color: '',
    finish: '',
    is_active: true,
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
      name: '',
      thickness: '',
      sheet_width: '',
      sheet_height: '',
      usable_width: '',
      usable_height: '',
      price_per_sheet: '',
      color: '',
      finish: '',
      is_active: true,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Gestión de Materiales</h1>
            <p className="text-muted-foreground">Administra los materiales disponibles para corte láser</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Add className="h-4 w-4 mr-2" />
                Nuevo Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMaterial ? 'Editar Material' : 'Nuevo Material'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Material</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="thickness">Grosor (mm)</Label>
                    <Input
                      id="thickness"
                      type="number"
                      step="0.01"
                      value={formData.thickness}
                      onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sheet_width">Ancho de Lámina (cm)</Label>
                    <Input
                      id="sheet_width"
                      type="number"
                      step="0.01"
                      value={formData.sheet_width}
                      onChange={(e) => setFormData({ ...formData, sheet_width: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sheet_height">Alto de Lámina (cm)</Label>
                    <Input
                      id="sheet_height"
                      type="number"
                      step="0.01"
                      value={formData.sheet_height}
                      onChange={(e) => setFormData({ ...formData, sheet_height: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="usable_width">Ancho Útil (cm)</Label>
                    <Input
                      id="usable_width"
                      type="number"
                      step="0.01"
                      value={formData.usable_width}
                      onChange={(e) => setFormData({ ...formData, usable_width: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="usable_height">Alto Útil (cm)</Label>
                    <Input
                      id="usable_height"
                      type="number"
                      step="0.01"
                      value={formData.usable_height}
                      onChange={(e) => setFormData({ ...formData, usable_height: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_per_sheet">Precio por Lámina ($)</Label>
                    <Input
                      id="price_per_sheet"
                      type="number"
                      step="0.01"
                      value={formData.price_per_sheet}
                      onChange={(e) => setFormData({ ...formData, price_per_sheet: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="finish">Acabado</Label>
                    <Input
                      id="finish"
                      value={formData.finish}
                      onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Activo</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingMaterial ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Materiales Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Grosor</TableHead>
                  <TableHead>Dimensiones</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{material.name}</div>
                        {material.color && (
                          <div className="text-sm text-muted-foreground">{material.color}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{material.thickness} mm</TableCell>
                    <TableCell>
                      {material.sheet_width} × {material.sheet_height} cm
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Útil: {material.usable_width} × {material.usable_height} cm
                      </span>
                    </TableCell>
                    <TableCell>${material.price_per_sheet.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={material.is_active ? 'default' : 'secondary'}>
                        {material.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(material)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Delete className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}