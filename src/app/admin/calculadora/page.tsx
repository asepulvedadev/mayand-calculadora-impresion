'use client';

import dynamic from 'next/dynamic';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';

const DimensionCalculator = dynamic(
  () => import('@/components/DimensionCalculator').then(mod => ({ default: mod.DimensionCalculator })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full glassmorphism fade-in hover-lift p-6 animate-pulse">
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    )
  }
);

export default function CalculatorPage() {
  const { quote } = usePrintCalculatorStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Calculadora de Impresión</h1>
        <p className="text-white/80 mt-2">Cotiza tu impresión gran formato con Mayand</p>
      </div>

      {/* Desktop Layout - Equal Size Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Calculator */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <DimensionCalculator />
        </div>

        {/* Right Panel - Quote */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <QuoteDisplay quote={quote} />
        </div>
      </div>
    </div>
  );
}