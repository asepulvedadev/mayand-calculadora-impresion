'use client';

import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { PortfolioSection } from '@/components/landing/PortfolioSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { FloatingActions } from '@/components/landing/FloatingActions';
import { Footer } from '@/components/landing/Footer';

const SECTION_IDS = ['hero', 'servicios', 'portafolio', 'contacto', 'footer'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080422]">
      <Header />
      <main>
        <div id="hero"><Hero /></div>
        <div id="servicios"><ServicesSection /></div>
        <div id="portafolio"><PortfolioSection /></div>
        <div id="contacto"><ContactSection /></div>
      </main>
      <FloatingActions sectionIds={SECTION_IDS} />
      <div id="footer"><Footer /></div>
    </div>
  );
}
