export type Material = 'vinil' | 'lona';

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
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
}