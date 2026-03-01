'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8140076026';

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle size={22} />
    </a>
  );
}
