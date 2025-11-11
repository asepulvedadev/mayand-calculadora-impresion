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