'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuoteData } from '@/types';
import { DollarSign, Calculator } from 'lucide-react';

interface QuoteDisplayProps {
  quote: QuoteData | null;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
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
    <div className="w-full h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Cotización
        </h2>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-lg border border-border/60">
            <p className="text-sm text-muted-foreground">Área calculada</p>
            <p className="text-2xl font-bold">{quote.area.toFixed(2)} m²</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg border border-border/60">
            <p className="text-sm text-muted-foreground">Material</p>
            <Badge variant={quote.material === 'vinil' ? 'default' : 'secondary'} className="mt-1">
              {quote.material === 'vinil' ? 'Vinil' : 'Lona'}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Precio unitario</span>
            <span>${quote.unitPrice.toFixed(2)} MXN/m²</span>
          </div>
          {quote.hasBulkDiscount && (
            <div className="flex justify-between text-green-600">
              <span>Descuento (≥10m²)</span>
              <span>-${((quote.material === 'vinil' ? 180 : 80) - quote.unitPrice).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (16%)</span>
            <span>${quote.iva.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total sin IVA</span>
            <span>${quote.subtotal.toFixed(2)} MXN</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-primary bg-primary/10 p-3 rounded-lg border-2 border-primary/30 shadow-sm">
            <span>Total con IVA</span>
            <span>${quote.total.toFixed(2)} MXN</span>
          </div>
        </div>

        {quote.hasBulkDiscount && (
          <Badge variant="outline" className="w-full justify-center bg-green-50 text-green-700 border-2 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 animate-pulse shadow-sm">
            🎉 ¡Descuento aplicado por volumen!
          </Badge>
        )}
      </div>
    </div>
  );
}