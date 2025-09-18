import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 120, bulk: 100 },
  lona: { normal: 80, bulk: 65 },
  vinil_transparente: { normal: 120, bulk: 100 }
};

export const calculateQuote = (width: number, height: number, material: Material): QuoteData => {
  let area: number;
  let unitPrice: number;
  let subtotal: number;
  let hasBulkDiscount: boolean;

  // For vinyl materials, calculate by linear meters (height in meters)
  if (material === 'vinil' || material === 'vinil_transparente') {
    area = height / 100; // height in cm to meters (linear meters)
    unitPrice = area >= 10 ? PRICES[material].bulk : PRICES[material].normal;
    subtotal = area * unitPrice;
    hasBulkDiscount = area >= 10;
  } else {
    // For canvas, calculate by square meters
    area = (width * height) / 10000; // cm² to m²
    unitPrice = area >= 10 ? PRICES[material].bulk : PRICES[material].normal;
    subtotal = area * unitPrice;
    hasBulkDiscount = area >= 10;
  }

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
    hasBulkDiscount
  };
};