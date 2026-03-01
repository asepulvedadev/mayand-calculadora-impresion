'use client';

import dynamic from 'next/dynamic';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';

const DimensionCalculator = dynamic(
  () => import('@/components/DimensionCalculator').then(mod => ({ default: mod.DimensionCalculator })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 animate-pulse">
        <div className="h-7 bg-white/[0.06] rounded-lg mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-14 bg-white/[0.04] rounded-xl"></div>
          <div className="h-14 bg-white/[0.04] rounded-xl"></div>
          <div className="h-11 bg-white/[0.04] rounded-xl"></div>
        </div>
      </div>
    )
  }
);

export default function CalculatorPage() {
  const { quote } = usePrintCalculatorStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Impresión Gran Formato</h1>
        <p className="text-white/30 text-xs sm:text-sm mt-1">Cotiza tu impresión con Mayand</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <DimensionCalculator />
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5">
          <QuoteDisplay quote={quote} />
        </div>
      </div>
    </div>
  );
}
