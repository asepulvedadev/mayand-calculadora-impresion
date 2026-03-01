'use client';

import { Button } from '@/components/ui/button';
import { LaserCalculator } from '@/components/LaserCalculator';
import { createQuote } from '@/lib/laserApi';
import { useLaserCalculatorStore } from '@/lib/stores/laserCalculatorStore';
import { LaserQuote } from '@/types/laser';
import { MessageCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function CorteLaserPage() {
  const { quote } = useLaserCalculatorStore();

  const shareOnWhatsApp = () => {
    if (!quote) return;

    const message = `*Cotización Corte Láser Mayand*

*Especificaciones:*
- Material: ${quote.material.name} ${quote.material.thickness}mm
- Dimensiones por pieza: ${quote.piece_width} x ${quote.piece_height} cm
- Cantidad: ${quote.quantity} piezas
- Minutos de corte: ${quote.cutting_minutes}

*Material necesario:*
- Láminas requeridas: ${quote.sheets_needed}
- Área total: ${(quote.piece_width * quote.piece_height * quote.quantity / 10000).toFixed(2)} m²

*Costos:*
- Material: $${quote.material_cost.toFixed(2)} MXN
- Corte láser: $${quote.cutting_cost.toFixed(2)} MXN
${quote.assembly_cost > 0 ? `- Ensamblaje: $${quote.assembly_cost.toFixed(2)} MXN` : ''}
- Subtotal: $${quote.subtotal.toFixed(2)} MXN
- IVA (16%): $${quote.iva.toFixed(2)} MXN
- *Total: $${quote.total.toFixed(2)} MXN*

Generado por Mayand`;

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const generatePDF = () => {
    toast.info('Función de PDF próximamente disponible');
  };

  const handleQuoteGenerated = async (quote: LaserQuote) => {
    try {
      await createQuote(quote);
      toast.success('Cotización guardada correctamente');
    } catch (error) {
      console.error('Error saving quote:', error);
      toast.error('Error al guardar la cotización');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Corte Láser</h1>
          <p className="text-white/30 text-xs sm:text-sm mt-1">Cotización precisa para tus proyectos</p>
        </div>
        {quote && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generatePDF}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border-white/[0.08] rounded-xl px-3 py-2 text-xs sm:text-sm"
            >
              <FileText size={15} className="mr-1.5" />
              PDF
            </Button>
            <Button
              onClick={shareOnWhatsApp}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white rounded-xl px-3 py-2 text-xs sm:text-sm shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle size={15} className="mr-1.5" />
              Compartir
            </Button>
          </div>
        )}
      </div>

      {/* Calculator */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-6">
        <LaserCalculator onQuoteGenerated={handleQuoteGenerated} />
      </div>
    </div>
  );
}
