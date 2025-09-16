'use client';

import { ContactForm } from '@/components/ContactForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuoteData } from '@/types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData | null;
  pdfFile: File | null;
}

export function ContactModal({ isOpen, onClose, quote, pdfFile }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Solicitar Cotización
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ContactForm quote={quote} pdfFile={pdfFile} />
        </div>
      </DialogContent>
    </Dialog>
  );
}