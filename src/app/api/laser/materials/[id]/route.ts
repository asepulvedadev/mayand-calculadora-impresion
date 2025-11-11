import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { price_per_sheet } = await request.json();

    // Validar datos
    if (typeof price_per_sheet !== 'number' || price_per_sheet < 0) {
      return NextResponse.json(
        { error: 'Precio inválido' },
        { status: 400 }
      );
    }

    // Actualizar precio del material
    const { data, error } = await supabase
      .from('laser_materials')
      .update({
        price_per_sheet,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating material price:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el precio del material' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Actualizar material completo
    const { data, error } = await supabase
      .from('laser_materials')
      .update({
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
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating material:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el material' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // En lugar de eliminar físicamente, marcar como inactivo
    const { data, error } = await supabase
      .from('laser_materials')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deactivating material:', error);
      return NextResponse.json(
        { error: 'Error al eliminar el material' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Material no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
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