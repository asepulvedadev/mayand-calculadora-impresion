import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 150, promotion: 120 }, // 150cm width, MXN/linear meter
  lona: { normal: 75, promotion: 70 }, // 180cm width, MXN/square meter
  vinil_transparente: { normal: 180, promotion: 160 } // 150cm width, MXN/linear meter
};

export const calculateQuote = (width: number, height: number, material: Material, isPromotion: boolean = false): QuoteData => {
  // Vinil and vinil_transparente calculate by linear meters, lona by square meters
  const area = material === 'lona' ? (width / 100) * (height / 100) : height / 100; // for lona: square meters, others: linear meters
  const unitPrice = isPromotion ? PRICES[material].promotion : PRICES[material].normal;
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
    hasBulkDiscount,
    isPromotion
  };
};