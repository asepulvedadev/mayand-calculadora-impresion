import { NextRequest, NextResponse } from 'next/server';
import { updateSetting, getSetting } from '@/lib/laserApi';

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

    // Guardar configuración en Supabase
    await updateSetting('cutting_rate_per_minute', cutting_rate_per_minute);
    await updateSetting('profit_margin', profit_margin);

    const data = {
      cutting_rate_per_minute,
      profit_margin,
      updated_at: new Date().toISOString(),
    };

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
    // Obtener configuración de Supabase
    const cutting_rate_per_minute = await getSetting('cutting_rate_per_minute');
    const profit_margin = await getSetting('profit_margin');

    const config = {
      cutting_rate_per_minute,
      profit_margin,
      updated_at: new Date().toISOString(),
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