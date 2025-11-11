import { NextRequest, NextResponse } from 'next/server';
import { createMaterial, getActiveMaterials, getAllMaterials } from '@/lib/laserApi';
import { LaserMaterial } from '@/types/laser';

export async function POST(request: NextRequest) {
  try {
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
      is_active = true,
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

    // Crear material usando Supabase
    const newMaterial = await createMaterial({
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
      data: newMaterial,
      message: 'Material creado exitosamente'
    });

  } catch (error) {
    console.error('Error in material creation API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener materiales activos usando Supabase
    const activeMaterials = await getActiveMaterials();

    return NextResponse.json({
      success: true,
      data: activeMaterials,
    });

  } catch (error) {
    console.error('Error in materials GET API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}