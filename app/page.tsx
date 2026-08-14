import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { SectionSeparator } from '@/components/ui/SectionSeparator';
import { WebPageJsonLd } from '@/components/JsonLd';

export default function Home() {
  return (
    <main className="bg-chantier-off-white min-h-screen">
      <WebPageJsonLd
        path="/"
        name="Chantier Film - Immortalisez Votre Chantier en Vidéo"
        description="La solution de suivi de chantier, timelapse et drone dédiée aux pros du BTP. Visualisez l'avancement de vos travaux et valorisez votre savoir-faire technique."
        primaryImageOfPage={{
          url: 'https://www.chantierfilm.com/images/home/hero/suivi-chantier-drone-vue-aerienne-btp-1.webp',
          width: 1920,
          height: 952,
          alt: 'Vue aérienne par drone d\'un chantier BTP en cours - Suivi de chantier Chantier Film',
        }}
      />
      {/* Hero Section - Premier point de contact */}
      <HeroSection />
      
      <SectionSeparator />
      
      {/* Problem Section - Exposition des défis et solutions */}
      <ProblemSection />
      
      <SectionSeparator />
      
      {/* Services Section - Notre offre détaillée */}
      <ServicesSection />
      
      <SectionSeparator />
      
      {/* Section Avant/Après (Comparateur visuel) */}
      <BeforeAfterSection />

      <SectionSeparator />

      {/* Section Processus (Étapes de collaboration) */}
      <ProcessSection />
      
      <SectionSeparator />
      
      {/* Section CTA/Contact (Formulaire et conversion) - LE GRAND FINAL */}
      <ContactSection />
    </main>
  );
}