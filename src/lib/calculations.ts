import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 150, bulk: 150 }, // 150cm width, 150 MXN/linear meter
  lona: { normal: 75, bulk: 75 }, // 180cm width, 75 MXN/linear meter
  vinil_transparente: { normal: 180, bulk: 180 } // 150cm width, 180 MXN/linear meter
};

export const calculateQuote = (width: number, height: number, material: Material): QuoteData => {
  let area: number;
  let unitPrice: number;
  let subtotal: number;
  let hasBulkDiscount: boolean;

  // All materials now calculate by linear meters (height in meters)
  area = height / 100; // height in cm to meters (linear meters)
  unitPrice = PRICES[material].normal; // No bulk discount logic for now
  subtotal = area * unitPrice;
  hasBulkDiscount = false; // Remove bulk discount for simplicity

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