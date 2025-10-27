import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 150, bulk: 150 }, // 150cm width, 150 MXN/linear meter
  lona: { normal: 80, bulk: 80 }, // 180cm width, 80 MXN/linear meter
  vinil_transparente: { normal: 180, bulk: 180 } // 150cm width, 180 MXN/linear meter
};

export const calculateQuote = (width: number, height: number, material: Material): QuoteData => {
  // All materials calculate by linear meters (height in meters)
  const area = height / 100; // height in cm to meters (linear meters)
  const unitPrice = PRICES[material].normal;
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
    hasBulkDiscount
  };
};