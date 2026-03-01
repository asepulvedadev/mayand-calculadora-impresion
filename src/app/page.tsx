'use client';

import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { PortfolioSection } from '@/components/landing/PortfolioSection';
import { CTASection } from '@/components/landing/CTASection';
import { ContactSection } from '@/components/landing/ContactSection';
import { WhatsAppFloating } from '@/components/landing/WhatsAppFloating';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080422]">
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
        <CTASection />
      </main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );
}
