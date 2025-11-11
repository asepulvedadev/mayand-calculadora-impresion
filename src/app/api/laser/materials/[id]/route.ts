import { NextRequest, NextResponse } from 'next/server';
import { LaserMaterial } from '@/types/laser';

// Nota: Este es un almacenamiento temporal. Los datos se comparten con ../route.ts
// En producción, usar una base de datos real
const getMaterials = (): LaserMaterial[] => {
  if (typeof (global as { laserMaterials?: LaserMaterial[] }).laserMaterials === 'undefined') {
    (global as { laserMaterials?: LaserMaterial[] }).laserMaterials = [
      {
        id: '1',
        name: 'MDF 3mm Blanco',
        thickness: 3,
        sheet_width: 122,
        sheet_height: 244,
        usable_width: 120,
        usable_height: 240,
        price_per_sheet: 250,
        color: 'Blanco',
        finish: 'Mate',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Acrílico 3mm Transparente',
        thickness: 3,
        sheet_width: 122,
        sheet_height: 244,
        usable_width: 120,
        usable_height: 240,
        price_per_sheet: 450,
        color: 'Transparente',
        finish: 'Brillante',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
  return (global as { laserMaterials?: LaserMaterial[] }).laserMaterials || [];
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { price_per_sheet } = await request.json();

    // Validar datos
    if (typeof price_per_sheet !== 'number' || price_per_sheet < 0) {
      return NextResponse.json(
        { error: 'Precio inválido' },
        { status: 400 }
      );
    }

    // TODO: Actualizar en base de datos cuando esté disponible
    // Por ahora, actualizar en memoria
    const materials = getMaterials();
    const materialIndex = materials.findIndex(m => m.id === id);

    if (materialIndex === -1) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el material en el global
    const updatedMaterial = {
      ...materials[materialIndex],
      price_per_sheet,
      updated_at: new Date().toISOString(),
    };

    materials[materialIndex] = updatedMaterial;

    // Asegurarse de que se guarde en el global
    (global as { laserMaterials?: LaserMaterial[] }).laserMaterials = materials;

    return NextResponse.json({
      success: true,
      data: updatedMaterial,
      message: 'Precio actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error in material update API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      name,
      thickness,
      sheet_width,
      sheet_height,
      usable_width,
      usable_height,
      price_per_sheet,
      color,
      finish,
      is_active,
    } = await request.json();

    // Validar datos requeridos
    if (!name || !thickness || !sheet_width || !sheet_height || !usable_width || !usable_height || price_per_sheet === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar tipos de datos
    if (typeof thickness !== 'number' || typeof sheet_width !== 'number' || typeof sheet_height !== 'number' ||
        typeof usable_width !== 'number' || typeof usable_height !== 'number' || typeof price_per_sheet !== 'number') {
      return NextResponse.json(
        { error: 'Tipos de datos inválidos' },
        { status: 400 }
      );
    }

    // TODO: Actualizar en base de datos cuando esté disponible
    // Por ahora, actualizar en memoria
    const materials = getMaterials();
    const materialIndex = materials.findIndex(m => m.id === id);

    if (materialIndex === -1) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el material completo
    const updatedMaterial = {
      ...materials[materialIndex],
      name,
      thickness,
      sheet_width,
      sheet_height,
      usable_width,
      usable_height,
      price_per_sheet,
      color,
      finish,
      is_active,
      updated_at: new Date().toISOString(),
    };

    materials[materialIndex] = updatedMaterial;

    // Asegurarse de que se guarde en el global
    (global as { laserMaterials?: LaserMaterial[] }).laserMaterials = materials;

    return NextResponse.json({
      success: true,
      data: updatedMaterial,
      message: 'Material actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error in material update API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Eliminar en base de datos cuando esté disponible
    // Por ahora, marcar como inactivo en memoria
    const materials = getMaterials();
    const materialIndex = materials.findIndex(m => m.id === id);

    if (materialIndex === -1) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    // Marcar como inactivo
    const updatedMaterial = {
      ...materials[materialIndex],
      is_active: false,
      updated_at: new Date().toISOString(),
    };

    materials[materialIndex] = updatedMaterial;

    // Asegurarse de que se guarde en el global
    (global as { laserMaterials?: LaserMaterial[] }).laserMaterials = materials;

    return NextResponse.json({
      success: true,
      data: updatedMaterial,
      message: 'Material eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error in material delete API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
