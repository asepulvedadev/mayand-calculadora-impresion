import { NextRequest, NextResponse } from 'next/server';
import { LaserMaterial, LaserQuote, LaserQuoteInput } from '@/types/laser';
import { supabase } from '@/lib/supabase';

/**
 * Función para calcular la cotización de corte láser
 * @param input Datos de entrada para la cotización
 * @param material Material seleccionado
 * @param cuttingRatePerMinute Tarifa de corte por minuto
 * @param assemblyCostPerPiece Costo de ensamblaje por pieza
 * @param profitMargin Margen de utilidad
 * @returns LaserQuote con todos los cálculos
 */
function calculateLaserQuote(
  input: LaserQuoteInput,
  material: LaserMaterial,
  cuttingRatePerMinute: number = 8,
  assemblyCostPerPiece: number = 0,
  profitMargin: number = 0.50 // 50% margen de utilidad
): LaserQuote {
  // PASO 1: Calcular área y material necesario
  const pieceArea = input.piece_width * input.piece_height; // cm²
  const totalAreaNeeded = pieceArea * input.quantity; // cm²
  const sheetArea = material.sheet_width * material.sheet_height; // cm²

  // Precio por cm²
  const pricePerCm2 = material.price_per_sheet / sheetArea;

  // Número de láminas necesarias (redondear hacia arriba basado en área útil)
  const usableArea = material.usable_width * material.usable_height; // cm²
  const sheetsNeeded = Math.ceil(totalAreaNeeded / usableArea);

  // PASO 2: Calcular costos directos
  const materialCost = totalAreaNeeded * pricePerCm2; // Costo real del material usado
  const cuttingCost = input.cutting_minutes * cuttingRatePerMinute;
  const assemblyCost = input.requires_assembly
    ? input.quantity * (input.assembly_cost_per_piece || assemblyCostPerPiece)
    : 0;

  // PASO 3: Subtotal de costos directos
  const directCostsSubtotal = materialCost + cuttingCost + assemblyCost;

  // PASO 4: Margen de utilidad
  const profit = directCostsSubtotal * profitMargin;

  // PASO 5: Precio de venta sin IVA
  const priceWithoutIVA = directCostsSubtotal + profit;

  // PASO 6: IVA sobre precio de venta
  const iva = priceWithoutIVA * 0.16;

  // PASO 7: Total final
  const total = priceWithoutIVA + iva;

  return {
    id: '', // Se asignará al guardar
    material_id: input.material_id,
    material,
    piece_width: input.piece_width,
    piece_height: input.piece_height,
    quantity: input.quantity,
    cutting_minutes: input.cutting_minutes,
    requires_assembly: input.requires_assembly,
    assembly_cost_per_piece: input.assembly_cost_per_piece || assemblyCostPerPiece,
    cutting_rate_per_minute: cuttingRatePerMinute,
    sheets_needed: sheetsNeeded,
    material_cost: materialCost,
    cutting_cost: cuttingCost,
    assembly_cost: assemblyCost,
    subtotal: priceWithoutIVA, // Ahora incluye utilidad
    iva,
    total,
    created_at: new Date().toISOString(),
  };
}

/**
 * Función para validar entrada de cotización láser
 * @param input Datos de entrada
 * @returns Array de errores
 */
function validateLaserQuoteInput(input: LaserQuoteInput): string[] {
  const errors: string[] = [];

  if (input.piece_width <= 0) errors.push('El ancho debe ser mayor a 0');
  if (input.piece_height <= 0) errors.push('El alto debe ser mayor a 0');
  if (input.quantity <= 0) errors.push('La cantidad debe ser mayor a 0');
  if (input.cutting_minutes <= 0) errors.push('Los minutos de corte deben ser mayores a 0');

  // Validaciones de límites de máquina
  if (input.piece_width > 120) errors.push('El ancho máximo es 120 cm');
  if (input.piece_height > 80) errors.push('El alto máximo es 80 cm');

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      material_id,
      piece_width,
      piece_height,
      quantity,
      cutting_minutes,
      requires_assembly,
      assembly_cost_per_piece,
      cutting_rate_per_minute = 8,
      profit_margin = 0.50
    } = body;

    // Validar entrada básica
    const parsedQuantity = parseInt(quantity);
    const parsedPieceWidth = parseFloat(piece_width);
    const parsedPieceHeight = parseFloat(piece_height);
    const parsedCuttingMinutes = parseFloat(cutting_minutes);
    const parsedAssemblyCost = assembly_cost_per_piece ? parseFloat(assembly_cost_per_piece) : undefined;

    // Validar que los parses sean números válidos
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ error: 'Cantidad debe ser un número entero positivo' }, { status: 400 });
    }
    if (isNaN(parsedPieceWidth) || parsedPieceWidth <= 0) {
      return NextResponse.json({ error: 'Ancho de pieza debe ser un número positivo' }, { status: 400 });
    }
    if (isNaN(parsedPieceHeight) || parsedPieceHeight <= 0) {
      return NextResponse.json({ error: 'Alto de pieza debe ser un número positivo' }, { status: 400 });
    }
    if (isNaN(parsedCuttingMinutes) || parsedCuttingMinutes <= 0) {
      return NextResponse.json({ error: 'Minutos de corte deben ser un número positivo' }, { status: 400 });
    }
    if (parsedAssemblyCost !== undefined && isNaN(parsedAssemblyCost)) {
      return NextResponse.json({ error: 'Costo de ensamblaje debe ser un número válido' }, { status: 400 });
    }

    const input: LaserQuoteInput = {
      material_id,
      piece_width: parsedPieceWidth,
      piece_height: parsedPieceHeight,
      quantity: parsedQuantity,
      cutting_minutes: parsedCuttingMinutes,
      requires_assembly: Boolean(requires_assembly),
      assembly_cost_per_piece: parsedAssemblyCost,
    };

    const validationErrors = validateLaserQuoteInput(input);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    // Obtener material desde Supabase
    const { data: material, error: materialError } = await supabase
      .from('laser_materials')
      .select('*')
      .eq('id', material_id)
      .eq('is_active', true)
      .single();

    if (materialError || !material) {
      return NextResponse.json({ error: 'Material no encontrado o inactivo' }, { status: 404 });
    }

    // Calcular la cotización
    const quote = calculateLaserQuote(
      input,
      material,
      cutting_rate_per_minute,
      assembly_cost_per_piece || 0,
      profit_margin
    );

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error calculating laser quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}