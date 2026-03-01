'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export function ContactSection() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '528140076026';

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // TODO: integrate with real backend
    await new Promise(resolve => setTimeout(resolve, 1200));
    setStatus('sent');
    setEmail('');
    setPhone('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const channels = [
    {
      icon: Phone,
      label: 'Llámanos',
      value: `+52 ${whatsappNumber}`,
      href: `tel:+52${whatsappNumber}`,
      color: '#A855F7',
      bg: 'from-[#A855F7]/20 to-[#A855F7]/5',
      border: 'border-[#A855F7]/15 hover:border-[#A855F7]/30',
    },
    {
      icon: Mail,
      label: 'Email',
      value: `ventas@${domain}`,
      href: `mailto:ventas@${domain}`,
      color: '#458FFF',
      bg: 'from-[#458FFF]/20 to-[#458FFF]/5',
      border: 'border-[#458FFF]/15 hover:border-[#458FFF]/30',
    },
    {
      icon: MapPin,
      label: 'Ubicación',
      value: 'Monterrey, N.L.',
      href: '#',
      color: '#FFD700',
      bg: 'from-[#FFD700]/15 to-[#FFD700]/5',
      border: 'border-[#FFD700]/15 hover:border-[#FFD700]/30',
    },
    {
      icon: Clock,
      label: 'Horario',
      value: 'Lun-Vie 9am-6pm',
      href: '#',
      color: '#10B981',
      bg: 'from-emerald-500/15 to-emerald-500/5',
      border: 'border-emerald-500/15 hover:border-emerald-500/30',
    },
  ];

  return (
    <section className="relative w-full h-[calc(100svh-56px)] sm:h-[calc(100svh-64px)] flex flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#458FFF]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A855F7]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[#458FFF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Contacto</span>
          <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-3">
            Hablemos
          </h2>
          <p className="text-white/35 text-xs sm:text-sm max-w-md mx-auto">
            Déjanos tus datos y nuestro equipo se pondrá en contacto contigo.
          </p>
        </div>

        {/* Contact form — inline */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-3">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder-white/25 focus:border-[#458FFF]/40 focus:bg-white/[0.07] focus:outline-none transition-all"
              />
            </div>
            <div className="relative flex-1">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 (81) 0000-0000"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder-white/25 focus:border-[#458FFF]/40 focus:bg-white/[0.07] focus:outline-none transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed ${
              status === 'sent'
                ? 'bg-emerald-500 text-white'
                : 'bg-[#458FFF] text-white hover:bg-[#3a7de6] disabled:opacity-60'
            }`}
          >
            {status === 'sending' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : status === 'sent' ? (
              <>
                <CheckCircle size={16} />
                Te contactaremos pronto
              </>
            ) : (
              <>
                <Send size={15} />
                Solicitar contacto
              </>
            )}
          </button>
        </form>

        {/* Contact channels grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith('http') || ch.href.startsWith('mailto') || ch.href.startsWith('tel') ? '_blank' : '_self'}
              rel={ch.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${ch.bg} border ${ch.border} p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]`}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: ch.color + '20', color: ch.color }}
              >
                <ch.icon size={22} />
              </div>
              <p className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium mb-1">{ch.label}</p>
              <p className="text-white text-xs sm:text-sm font-bold truncate w-full">{ch.value}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
