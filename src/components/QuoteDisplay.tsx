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
    <div className="w-full h-full flex flex-col p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Cotización
        </h2>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-2 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">
              {quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 'Metros lineales' : 'Área calculada'}
            </p>
            <p className="text-lg font-bold">
              {quote.area.toFixed(2)} {quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 'm' : 'm²'}
            </p>
          </div>
          <div className="bg-muted/50 p-2 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">Material</p>
            <Badge variant={quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 'default' : 'secondary'} className="mt-1 text-xs">
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
            <span>${quote.unitPrice.toFixed(2)} MXN/{quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 'm' : 'm²'}</span>
          </div>
          {quote.hasBulkDiscount && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Descuento ({quote.material === 'vinil' || quote.material === 'vinil_transparente' ? '≥10m' : '≥10m²'})</span>
              <span>-${((quote.material === 'vinil' || quote.material === 'vinil_transparente' ? 180 : 80) - quote.unitPrice).toFixed(2)}</span>
            </div>
          )}
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

        {quote.hasBulkDiscount && (
          <Badge variant="outline" className="w-full justify-center bg-green-50 text-green-700 border-2 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 animate-pulse shadow-sm">
            🎉 ¡Descuento aplicado por volumen!
          </Badge>
        )}
      </div>
    </div>
  );
}