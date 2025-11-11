import { NextRequest, NextResponse } from 'next/server';
import { updateMaterial, deleteMaterial, getAllMaterials } from '@/lib/laserApi';
import { LaserMaterial } from '@/types/laser';

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

    // Actualizar precio usando Supabase
    const updatedMaterial = await updateMaterial(id, { price_per_sheet });

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

    // Actualizar material completo usando Supabase
    const updatedMaterial = await updateMaterial(id, {
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
    });

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

    // Eliminar material usando Supabase (eliminar físicamente)
    await deleteMaterial(id);

    return NextResponse.json({
      success: true,
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
