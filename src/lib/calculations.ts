import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 180, bulk: 140 },
  lona: { normal: 80, bulk: 65 }
};

export const calculateQuote = (width: number, height: number, material: Material): QuoteData => {
  const area = (width * height) / 10000; // cm² to m²
  const unitPrice = area >= 10 ? PRICES[material].bulk : PRICES[material].normal;
  const subtotal = area * unitPrice;
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
    hasBulkDiscount: area >= 10
  };
};