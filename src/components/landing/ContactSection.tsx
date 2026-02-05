'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'impresion',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8140076026';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', phone: '', service: 'impresion', message: '' });
    
    // Resetear estado después de 3 segundos
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: `+52 ${whatsappNumber}`,
      href: `https://wa.me/${whatsappNumber}`
    },
    {
      icon: Mail,
      title: 'Email',
      value: `ventas@${domain}`,
      href: `mailto:ventas@${domain}`
    },
    {
      icon: MapPin,
      title: 'Dirección',
      value: 'Av. Principal 123, Ciudad de México',
      href: '#'
    },
    {
      icon: Clock,
      title: 'Horario',
      value: 'Lun - Vie: 9am - 6pm',
      href: '#'
    }
  ];

  return (
    <section id="contacto" className="max-w-[1300px] mx-auto px-6 py-32">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Información de contacto */}
        <div className="lg:w-5/12">
          <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-6">
            Contáctanos
          </h2>
          <div className="h-2 w-32 bg-[#458FFF] rounded-full mb-8"></div>
          <p className="text-white/60 text-lg mb-10">
            ¿Tienes un proyecto en mente? Escríbenos y te ayudaremos a hacerlo realidad. Nuestro equipo de expertos está listo para asesorarte.
          </p>

          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1d2e]/40 border border-white/5 hover:border-[#458FFF]/50 transition-all group"
              >
                <div className="size-12 rounded-lg bg-[#458FFF]/20 flex items-center justify-center text-[#458FFF] group-hover:bg-[#458FFF] group-hover:text-white transition-all">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/50 text-sm uppercase tracking-wider font-medium">{item.title}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="lg:w-7/12">
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#1a1d2e]/40 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0c10] border border-white/10 text-white placeholder-white/30 focus:border-[#458FFF] focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0c10] border border-white/10 text-white placeholder-white/30 focus:border-[#458FFF] focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0c10] border border-white/10 text-white placeholder-white/30 focus:border-[#458FFF] focus:outline-none transition-colors"
                  placeholder="+52 (55) 0000-0000"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Servicio de interés</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0c10] border border-white/10 text-white focus:border-[#458FFF] focus:outline-none transition-colors"
                >
                  <option value="impresion">Impresión Gran Formato</option>
                  <option value="laser">Corte Láser</option>
                  <option value="ambos">Ambos servicios</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-white/70 text-sm font-medium mb-2">Mensaje *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#0a0c10] border border-white/10 text-white placeholder-white/30 focus:border-[#458FFF] focus:outline-none transition-colors resize-none"
                placeholder="Cuéntanos sobre tu proyecto..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#458FFF] text-white font-bold text-lg hover:bg-[#458FFF]/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensaje
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <p className="text-center text-green-400 mt-4 font-medium">
                ✓ Mensaje enviado exitosamente. Te contactaremos pronto.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
