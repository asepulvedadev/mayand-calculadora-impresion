import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Implementar guardado en base de datos cuando esté disponible
    // Por ahora, la configuración se maneja localmente en el cliente
    const data = {
      id: 1,
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
    // TODO: Obtener configuración de base de datos cuando esté disponible
    // Por ahora, devolver valores por defecto
    const config = {
      id: 1,
      cutting_rate_per_minute: 8,
      profit_margin: 0.50,
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