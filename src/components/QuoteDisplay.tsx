'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AttachMoney, Calculate, AutoAwesome, Chat } from '@mui/icons-material';
import { usePrintCalculatorStore } from '@/lib/stores/printCalculatorStore';

interface QuoteDisplayProps {
  quote?: import('@/lib/validations/calculator').PrintQuoteResponse | null; // Para compatibilidad con el componente padre
}

export function QuoteDisplay({ quote: propQuote }: QuoteDisplayProps) {
  const { quote: storeQuote } = usePrintCalculatorStore();
  const quote = propQuote || storeQuote;

  const shareOnWhatsApp = () => {
    if (!quote) return;

    const message = `🖨️ *Cotización Mayand*${quote.isPromotion ? ' ✨' : ''}

📏 *Dimensiones:*
• Ancho: ${quote.width} cm
• Alto: ${quote.height} cm
• Metros lineales: ${quote.area.toFixed(2)} m

🏷️ *Material:* ${quote.material === 'vinil' ? 'Vinil' :
                quote.material === 'vinil_transparente' ? 'Vinil Transparente' :
                'Lona'}${quote.isPromotion ? ' _(Precio Promocional)_' : ''}

💰 *Precios:*
• Precio unitario: $${quote.unitPrice.toFixed(2)} MXN/m
• Subtotal: $${quote.subtotal.toFixed(2)} MXN
• IVA (16%): $${quote.iva.toFixed(2)} MXN
• *Total con IVA: $${quote.total.toFixed(2)} MXN*

📱 Generado por Mayand`;

    // Detect if it's mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let whatsappUrl;
    if (isMobile) {
      // Use WhatsApp app URL for mobile
      whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    } else {
      // Use WhatsApp Web for desktop
      whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(whatsappUrl, '_blank');
  };

  if (!quote) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Calculate className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
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
            <AttachMoney className="h-4 w-4 text-primary" />
            Cotización
          </h2>
          {quote.isPromotion && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md animate-pulse">
              <AutoAwesome className="h-3 w-3 mr-1" />
              Promoción
            </Badge>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-2 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">Metros lineales</p>
            <p className="text-lg font-bold">{quote.area.toFixed(2)} m</p>
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
            <span>${quote.unitPrice.toFixed(2)} MXN/m</span>
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

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span>Total sin IVA</span>
            <span>${quote.subtotal.toFixed(2)} MXN</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary bg-primary/10 p-2 rounded-lg border-2 border-primary/30 shadow-sm">
            <span>Total con IVA</span>
            <span>${quote.total.toFixed(2)} MXN</span>
          </div>

          {/* Botón de compartir debajo del precio */}
          <Button
            onClick={shareOnWhatsApp}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-accent/50 hover:border-accent"
          >
            <Chat className="h-4 w-4 mr-2" />
            Compartir Cotización
          </Button>
        </div>

      </div>
    </div>
  );
}