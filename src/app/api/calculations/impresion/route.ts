import { NextRequest, NextResponse } from 'next/server';
import { Material, QuoteData } from '@/types';

// Precios de materiales (podrían venir de BD en el futuro)
const PRICES = {
  vinil: { normal: 150, promotion: 120 }, // 150cm width, MXN/linear meter
  lona: { normal: 75, promotion: 70 }, // 180cm width, MXN/square meter
  vinil_transparente: { normal: 180, promotion: 160 } // 150cm width, MXN/linear meter
};

/**
 * Función para calcular la cotización de impresión
 * @param width Ancho en cm
 * @param height Alto en cm
 * @param material Material seleccionado
 * @param isPromotion Si es precio promocional
 * @returns QuoteData con todos los cálculos
 */
function calculateQuote(width: number, height: number, material: Material, isPromotion: boolean = false): QuoteData {
  // Vinil and vinil_transparente calculate by linear meters, lona by square meters
  const area = material === 'lona' ? (width / 100) * (height / 100) : height / 100; // for lona: square meters, others: linear meters
  const unitPrice = isPromotion ? PRICES[material].promotion : PRICES[material].normal;
  const subtotal = area * unitPrice;
  const hasBulkDiscount = false;

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return {
    width,
    height,
    material,
    area,
    unitPrice,
    subtotal,
    iva,
    total,
    hasBulkDiscount,
    isPromotion
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { width, height, material, isPromotion } = body;

    // Validaciones básicas
    if (typeof width !== 'number' || width <= 0) {
      return NextResponse.json({ error: 'Ancho debe ser un número positivo' }, { status: 400 });
    }
    if (typeof height !== 'number' || height <= 0) {
      return NextResponse.json({ error: 'Alto debe ser un número positivo' }, { status: 400 });
    }
    if (!['vinil', 'lona', 'vinil_transparente'].includes(material)) {
      return NextResponse.json({ error: 'Material no válido' }, { status: 400 });
    }

    // Calcular la cotización
    const quote = calculateQuote(width, height, material, isPromotion || false);

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error calculating print quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}