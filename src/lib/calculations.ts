import { Material, QuoteData } from '@/types';

const PRICES = {
  vinil: { normal: 150, promotion: 120 }, // 150cm width, MXN/linear meter
  lona: { normal: 135, promotion: 120 }, // 180cm width, MXN/linear meter
  vinil_transparente: { normal: 180, promotion: 160 } // 150cm width, MXN/linear meter
};

export const calculateQuote = (width: number, height: number, material: Material, isPromotion: boolean = false): QuoteData => {
  // All materials calculate by linear meters (height)
  const area = height / 100; // linear meters
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