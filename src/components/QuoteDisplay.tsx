'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Calculator, Sparkles } from 'lucide-react';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';

interface QuoteDisplayProps {
  quote?: import('@/lib/validations/calculator').PrintQuoteResponse | null; // Para compatibilidad con el componente padre
}

export function QuoteDisplay({ quote: propQuote }: QuoteDisplayProps) {
  const { quote: storeQuote } = usePrintCalculatorStore();
  const quote = propQuote || storeQuote;
  if (!quote) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Calculator className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground text-lg font-medium">Ingresa las dimensiones para ver la cotización</p>
          <p className="text-muted-foreground/70 text-sm mt-2">Los cálculos se actualizarán automáticamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Cotización
          </h2>
          {quote.isPromotion && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Promoción
            </Badge>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-2 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">{quote.material === 'lona' ? 'Metros cuadrados' : 'Metros lineales'}</p>
            <p className="text-lg font-bold">{quote.area.toFixed(2)} {quote.material === 'lona' ? 'm²' : 'm'}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">Material</p>
            <Badge variant="default" className="mt-1 text-xs">
              {quote.material === 'vinil' ? 'Vinil' :
               quote.material === 'vinil_transparente' ? 'Vinil Transparente' :
               'Lona'}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Precio unitario</span>
            <span>${quote.unitPrice.toFixed(2)} MXN/{quote.material === 'lona' ? 'm²' : 'm'}</span>
          </div>
          <div className="flex justify-between font-medium text-sm">
            <span>Subtotal</span>
            <span>${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IVA (16%)</span>
            <span>${quote.iva.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between text-sm font-semibold">
            <span>Total sin IVA</span>
            <span>${quote.subtotal.toFixed(2)} MXN</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary bg-primary/10 p-2 rounded-lg border-2 border-primary/30 shadow-sm">
            <span>Total con IVA</span>
            <span>${quote.total.toFixed(2)} MXN</span>
          </div>
        </div>

      </div>
    </div>
  );
}