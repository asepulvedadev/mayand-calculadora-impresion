import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { cutting_rate_per_minute, profit_margin } = await request.json();

    // Validar datos
    if (typeof cutting_rate_per_minute !== 'number' || cutting_rate_per_minute < 0) {
      return NextResponse.json(
        { error: 'Costo de corte inválido' },
        { status: 400 }
      );
    }

    if (typeof profit_margin !== 'number' || profit_margin < 0 || profit_margin > 1) {
      return NextResponse.json(
        { error: 'Margen de utilidad inválido (debe estar entre 0 y 1)' },
        { status: 400 }
      );
    }

    // Guardar configuración en la base de datos
    const { data, error } = await supabase
      .from('laser_config')
      .upsert({
        id: 1, // Usar ID fijo para configuración global
        cutting_rate_per_minute,
        profit_margin,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error saving laser config:', error);
      return NextResponse.json(
        { error: 'Error al guardar la configuración' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Configuración guardada exitosamente'
    });

  } catch (error) {
    console.error('Error in laser config API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('laser_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching laser config:', error);
      return NextResponse.json(
        { error: 'Error al obtener la configuración' },
        { status: 500 }
      );
    }

    // Si no existe configuración, devolver valores por defecto
    const config = data || {
      cutting_rate_per_minute: 8,
      profit_margin: 0.50,
    };

    return NextResponse.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('Error in laser config GET API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}