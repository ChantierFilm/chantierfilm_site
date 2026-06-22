import DevisWizard from '@/components/devis/DevisWizard';

export default function DevisPage() {
  return (
    <main className="bg-chantier-off-white min-h-screen">
      {/* Header de page (offset navbar) */}
      <section className="bg-white border-b border-chantier-light-grey pt-32 pb-10 lg:pt-36 lg:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-chantier-yellow bg-chantier-asphalt px-3 py-1.5 rounded-full mb-4">
              Devis en ligne
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-chantier-asphalt leading-tight">
              Estimez votre projet en quelques clics
            </h1>
            <p className="mt-4 text-base sm:text-lg text-chantier-concrete leading-relaxed">
              Sélectionnez vos prestations, visualisez le total estimé HT en temps réel,
              puis recevez votre récapitulatif par mail. Notre équipe vous recontacte
              sous 48h ouvrées pour affiner votre devis.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <DevisWizard />
        </div>
      </section>
    </main>
  );
}
