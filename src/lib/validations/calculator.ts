import { z } from 'zod';

// Esquemas de validación para la calculadora de impresión
export const printCalculatorSchema = z.object({
  width: z.number().min(0, 'El ancho no puede ser negativo').max(3600, 'El ancho máximo es 3600 cm'),
  height: z.number().min(0, 'El alto no puede ser negativo').max(3600, 'El alto máximo es 3600 cm'),
  material: z.enum(['vinil', 'lona', 'vinil_transparente'], {
    message: 'Material no válido'
  }),
  isPromotion: z.boolean(),
}).refine((data) => {
  // Validación adicional: el ancho no puede exceder el límite del material seleccionado
  const maxWidthForMaterial = data.material === 'lona' ? 180 : 150;
  return data.width <= maxWidthForMaterial;
}, {
  message: 'El ancho excede el límite para el material seleccionado',
  path: ['width'], // Error se asigna al campo width
});

export type PrintCalculatorInput = z.infer<typeof printCalculatorSchema>;

// Esquemas de validación para la calculadora de corte láser
export const laserCalculatorSchema = z.object({
  material_id: z.string().min(1, 'Selecciona un material'),
  piece_width: z.number().min(0.01, 'El ancho debe ser mayor a 0').max(120, 'El ancho máximo es 120 cm'),
  piece_height: z.number().min(0.01, 'El alto debe ser mayor a 0').max(80, 'El alto máximo es 80 cm'),
  quantity: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  cutting_minutes: z.number().min(0.01, 'Los minutos de corte deben ser mayores a 0'),
  requires_assembly: z.boolean(),
  assembly_cost_per_piece: z.number().min(0, 'El costo de ensamblaje no puede ser negativo').optional(),
}).refine((_data) => {
  // Validación adicional: verificar que las dimensiones no excedan las del material seleccionado
  // Esta validación se haría en el componente usando la información del material
  return true; // Por ahora, siempre pasa - se valida en el componente
}, {
  message: 'Las dimensiones exceden las del material seleccionado',
  path: ['piece_width'], // Error se asigna al campo piece_width
});

export type LaserCalculatorInput = z.infer<typeof laserCalculatorSchema>;

// Tipos de respuesta de las APIs
export const printQuoteResponseSchema = z.object({
  width: z.number(),
  height: z.number(),
  material: z.string(),
  area: z.number(),
  unitPrice: z.number(),
  subtotal: z.number(),
  iva: z.number(),
  total: z.number(),
  hasBulkDiscount: z.boolean(),
  isPromotion: z.boolean(),
});

export type PrintQuoteResponse = z.infer<typeof printQuoteResponseSchema>;

export const laserQuoteResponseSchema = z.object({
  id: z.string(),
  material_id: z.string(),
  material: z.object({
    id: z.string(),
    name: z.string(),
    thickness: z.number(),
    sheet_width: z.number(),
    sheet_height: z.number(),
    usable_width: z.number(),
    usable_height: z.number(),
    price_per_sheet: z.number(),
    color: z.string().optional(),
    finish: z.string().optional(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
  piece_width: z.number(),
  piece_height: z.number(),
  quantity: z.number(),
  cutting_minutes: z.number(),
  requires_assembly: z.boolean(),
  assembly_cost_per_piece: z.number().nullable(),
  cutting_rate_per_minute: z.number(),
  sheets_needed: z.number(),
  material_cost: z.number(),
  cutting_cost: z.number(),
  assembly_cost: z.number(),
  subtotal: z.number(),
  iva: z.number(),
  total: z.number(),
  created_at: z.string(),
});

export type LaserQuoteResponse = z.infer<typeof laserQuoteResponseSchema>;