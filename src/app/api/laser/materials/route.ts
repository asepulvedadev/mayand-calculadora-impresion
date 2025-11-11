import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Crear material
    const { data, error } = await supabase
      .from('laser_materials')
      .insert({
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
      })
      .select();

    if (error) {
      console.error('Error creating material:', error);
      return NextResponse.json(
        { error: 'Error al crear el material' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
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
    const { data, error } = await supabase
      .from('laser_materials')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching materials:', error);
      return NextResponse.json(
        { error: 'Error al obtener los materiales' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('Error in materials GET API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}