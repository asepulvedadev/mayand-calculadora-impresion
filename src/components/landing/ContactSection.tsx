'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'impresion', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8140076026';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', service: 'impresion', message: '' });
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const contactCards = [
    { icon: Phone, label: 'Teléfono', value: `+52 ${whatsappNumber}`, href: `https://wa.me/${whatsappNumber}`, color: '#25D366' },
    { icon: Mail, label: 'Email', value: `ventas@${domain}`, href: `mailto:ventas@${domain}`, color: '#458FFF' },
    { icon: MapPin, label: 'Ubicación', value: 'Monterrey, N.L.', href: '#', color: '#A855F7' },
    { icon: Clock, label: 'Horario', value: 'Lun-Vie 9am-6pm', href: '#', color: '#FFD700' },
  ];

  return (
    <section id="contacto" className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">
        {/* Left — info */}
        <div className="lg:col-span-2">
          <span className="text-[#458FFF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Contacto</span>
          <h2 className="text-white text-2xl sm:text-4xl font-black tracking-tight leading-[1.1] mb-3 sm:mb-4">
            Hablemos de tu proyecto
          </h2>
          <p className="text-white/35 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
            Nuestro equipo está listo para asesorarte. Escríbenos y te respondemos en menos de 24 horas.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
            {contactCards.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all"
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: item.color + '15', color: item.color }}
                >
                  <item.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="text-white text-xs sm:text-sm font-semibold truncate">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-white text-base sm:text-lg font-bold mb-5 sm:mb-6">Envíanos un mensaje</h3>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-white/40 text-[10px] sm:text-xs font-medium mb-1.5 uppercase tracking-wider">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] sm:text-xs font-medium mb-1.5 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-white/40 text-[10px] sm:text-xs font-medium mb-1.5 uppercase tracking-wider">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors"
                  placeholder="+52 (81) 0000-0000"
                />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] sm:text-xs font-medium mb-1.5 uppercase tracking-wider">Servicio</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-[#458FFF]/40 focus:outline-none transition-colors"
                >
                  <option value="impresion">Impresión Gran Formato</option>
                  <option value="laser">Corte Láser</option>
                  <option value="ambos">Ambos servicios</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mb-5 sm:mb-6">
              <label className="block text-white/40 text-[10px] sm:text-xs font-medium mb-1.5 uppercase tracking-wider">Mensaje *</label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors resize-none"
                placeholder="Cuéntanos sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 rounded-xl bg-[#458FFF] text-white font-bold text-sm hover:bg-[#3a7de6] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Enviar Mensaje
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <p className="text-center text-emerald-400 mt-3 text-xs font-medium">
                Mensaje enviado. Te contactaremos pronto.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
