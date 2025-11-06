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

    const message = `🖼️ *Cotización Corte Láser Mayand*

📏 *Especificaciones:*
• Material: ${quote.material.name} ${quote.material.thickness}mm
• Dimensiones por pieza: ${quote.piece_width} × ${quote.piece_height} cm
• Cantidad: ${quote.quantity} piezas
• Minutos de corte: ${quote.cutting_minutes}

📊 *Material necesario:*
• Láminas requeridas: ${quote.sheets_needed}
• Área total: ${(quote.piece_width * quote.piece_height * quote.quantity / 10000).toFixed(2)} m²

💰 *Costos:*
• Material: $${quote.material_cost.toFixed(2)} MXN
• Corte láser: $${quote.cutting_cost.toFixed(2)} MXN
${quote.assembly_cost > 0 ? `• Ensamblaje: $${quote.assembly_cost.toFixed(2)} MXN` : ''}
• Subtotal: $${quote.subtotal.toFixed(2)} MXN
• IVA (16%): $${quote.iva.toFixed(2)} MXN
• *Total: $${quote.total.toFixed(2)} MXN*

📱 Generado por Mayand`;

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const generatePDF = () => {
    // TODO: Implementar generación de PDF
    toast.info('Función de PDF próximamente disponible');
  };

  const handleQuoteGenerated = async (quote: LaserQuote) => {
    try {
      console.log('Intentando guardar cotización:', quote);
      // Guardar la cotización en la base de datos
      await createQuote(quote);
      toast.success('Cotización guardada correctamente');
    } catch (error) {
      console.error('Error saving quote:', error);
      console.error('Detalles del error:', JSON.stringify(error, null, 2));
      toast.error('Error al guardar la cotización');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calculadora de Corte Láser</h1>
          <p className="text-white/80 mt-2">Obtén una cotización precisa para tus proyectos de corte láser</p>
        </div>
        {quote && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={generatePDF}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full px-4 py-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={shareOnWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <LaserCalculator onQuoteGenerated={handleQuoteGenerated} />
      </div>
    </div>
  );
}