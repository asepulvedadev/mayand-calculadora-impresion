import { NextRequest, NextResponse } from 'next/server';
import { LaserMaterial } from '@/types/laser';

// Almacenamiento temporal de materiales en memoria (reemplazar con DB cuando esté disponible)
// Usar global para compartir entre diferentes rutas
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

    // TODO: Guardar en base de datos cuando esté disponible
    // Por ahora, guardar en memoria
    const materials = getMaterials();
    const newMaterial: LaserMaterial = {
      id: String(Date.now()),
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    materials.push(newMaterial);

    // Asegurarse de que se guarde en el global
    (global as { laserMaterials?: LaserMaterial[] }).laserMaterials = materials;

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
    // TODO: Obtener de base de datos cuando esté disponible
    // Por ahora, retornar materiales en memoria
    const materials = getMaterials();
    const activeMaterials = materials
      .filter(m => m.is_active)
      .sort((a, b) => a.name.localeCompare(b.name));

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