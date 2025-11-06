import { LaserMaterial, LaserQuote, LaserQuoteInput } from '@/types/laser';

export function calculateLaserQuote(
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

export function calculatePiecesPerSheet(
  pieceWidth: number,
  pieceHeight: number,
  sheetUsableWidth: number,
  sheetUsableHeight: number
): number {
  // Calcular cuántas piezas caben en una lámina
  // Considerando rotación (horizontal y vertical)
  const horizontalFit = Math.floor(sheetUsableWidth / pieceWidth);
  const verticalFit = Math.floor(sheetUsableHeight / pieceHeight);
  const piecesHorizontal = horizontalFit * verticalFit;

  // Rotadas 90 grados
  const horizontalFitRotated = Math.floor(sheetUsableWidth / pieceHeight);
  const verticalFitRotated = Math.floor(sheetUsableHeight / pieceWidth);
  const piecesRotated = horizontalFitRotated * verticalFitRotated;

  return Math.max(piecesHorizontal, piecesRotated);
}

export function validateLaserQuoteInput(input: LaserQuoteInput): string[] {
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