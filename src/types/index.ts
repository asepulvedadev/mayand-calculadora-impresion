export type Material = 'vinil' | 'lona' | 'vinil_transparente';

export interface QuoteData {
  width: number;
  height: number;
  material: Material;
  area: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
  hasBulkDiscount: boolean;
  isPromotion: boolean;
}
