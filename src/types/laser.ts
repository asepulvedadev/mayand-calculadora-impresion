export interface LaserMaterial {
  id: string;
  name: string;
  thickness: number; // en mm
  sheet_width: number; // en cm
  sheet_height: number; // en cm
  usable_width: number; // en cm
  usable_height: number; // en cm
  price_per_sheet: number; // en MXN
  color?: string;
  finish?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaserQuote {
  id: string;
  material_id: string;
  material: LaserMaterial;
  piece_width: number; // en cm
  piece_height: number; // en cm
  cutting_minutes: number;
  requires_assembly: boolean;
  assembly_cost_per_piece?: number;
  cutting_rate_per_minute: number; // $8 MXN por defecto
  sheets_needed: number;
  material_cost: number;
  cutting_cost: number;
  assembly_cost: number;
  subtotal: number;
  iva: number;
  total: number;
  created_at: string;
}

export interface LaserQuoteInput {
  material_id: string;
  piece_width: number;
  piece_height: number;
  quantity: number;
  cutting_minutes: number;
  requires_assembly: boolean;
  assembly_cost_per_piece?: number;
}