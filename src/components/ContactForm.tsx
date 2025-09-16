'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContactFormData, QuoteData } from '@/types';
import { contactSchema } from '@/lib/validations';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactFormProps {
  quote: QuoteData | null;
  pdfFile: File | null;
}

export function ContactForm({ quote, pdfFile }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'validation_error' | 'pdf_error'>('idle');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    // Validation: Check if dimensions are calculated
    if (!quote || !quote.width || !quote.height) {
      setSubmitStatus('validation_error');
      return;
    }

    // Validation: Check if PDF file is uploaded
    if (!pdfFile) {
      setSubmitStatus('pdf_error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create HTML email template
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Cotización - Printología</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .quote-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .quote-header { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 15px; }
            .quote-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .detail-item { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .detail-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
            .detail-value { font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 4px; }
            .total-section { background: #1e293b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
            .total-amount { font-size: 28px; font-weight: bold; color: #fbbf24; }
            .contact-info { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .contact-item { margin-bottom: 10px; }
            .contact-label { font-weight: bold; color: #374151; }
            .contact-value { color: #6b7280; }
            .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🖨️ Printología</h1>
              <p>Nueva Solicitud de Cotización</p>
            </div>

            <div class="content">
              <div class="quote-card">
                <div class="quote-header">📋 Detalles de la Cotización</div>

                <div class="quote-details">
                  <div class="detail-item">
                    <div class="detail-label">Dimensiones</div>
                    <div class="detail-value">${quote.width}cm × ${quote.height}cm</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Área Total</div>
                    <div class="detail-value">${quote.area.toFixed(2)} m²</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Material</div>
                    <div class="detail-value">${quote.material === 'vinil' ? 'Vinil' : 'Lona'}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Precio Unitario</div>
                    <div class="detail-value">$${quote.unitPrice.toFixed(2)} MXN/m²</div>
                  </div>
                </div>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>$${quote.subtotal.toFixed(2)} MXN</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>IVA (16%):</span>
                    <span>$${quote.iva.toFixed(2)} MXN</span>
                  </div>
                  ${quote.hasBulkDiscount ? '<div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #10b981;"><span>Descuento (≥10m²):</span><span>-$' + ((quote.material === 'vinil' ? 180 : 80) - quote.unitPrice).toFixed(2) + '</span></div>' : ''}
                </div>

                <div class="total-section">
                  <div style="font-size: 16px; margin-bottom: 10px;">TOTAL A PAGAR</div>
                  <div class="total-amount">$${quote.total.toFixed(2)} MXN</div>
                  ${quote.hasBulkDiscount ? '<div class="badge" style="margin-top: 10px;">🎉 Descuento Aplicado</div>' : ''}
                </div>
              </div>

              <div class="contact-info">
                <h3 style="margin-top: 0; color: #1e293b;">📞 Información de Contacto</h3>
                <div class="contact-item">
                  <span class="contact-label">Nombre:</span>
                  <span class="contact-value">${data.name}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">Email:</span>
                  <span class="contact-value">${data.email}</span>
                </div>
                <div class="contact-item">
                  <span class="contact-label">Teléfono:</span>
                  <span class="contact-value">${data.phone}</span>
                </div>
                ${data.message ? `
                <div class="contact-item">
                  <span class="contact-label">Mensaje:</span>
                  <span class="contact-value">${data.message}</span>
                </div>
                ` : ''}
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <strong>📎 Archivo Adjunto:</strong> ${pdfFile.name} (${(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </div>

            <div class="footer">
              <p>Esta cotización fue generada automáticamente desde el sitio web de Printología</p>
              <p>Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const templateParams = {
        to_name: 'Printología',
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        message: data.message,
        html_content: htmlTemplate,
        pdf_filename: pdfFile.name,
        pdf_size: `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`,
        quote_summary: `Cotización: ${quote.width}cm × ${quote.height}cm, ${quote.material === 'vinil' ? 'Vinil' : 'Lona'}, Total: $${quote.total.toFixed(2)} MXN`
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" className="border-2 border-border/80 focus:border-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" className="border-2 border-border/80 focus:border-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+52 55 1234 5678" className="border-2 border-border/80 focus:border-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comentarios adicionales..."
                      className="resize-none border-2 border-border/80 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full hover-lift border-2 border-primary/20" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Enviando...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Cotización
                </>
              )}
            </Button>

            {submitStatus === 'success' && (
              <Alert className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <AlertDescription>
                  ¡Cotización enviada exitosamente! Nos pondremos en contacto contigo pronto.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert variant="destructive" className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription>
                  Error al enviar la cotización. Por favor, intenta de nuevo.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'validation_error' && (
              <Alert variant="destructive" className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription>
                  ⚠️ Debes ingresar las dimensiones (ancho y alto) antes de enviar la cotización.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'pdf_error' && (
              <Alert variant="destructive" className="border-2 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription>
                  📎 Debes subir un archivo PDF antes de enviar la cotización.
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
    </div>
  );
}