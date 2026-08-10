import { Metadata } from 'next';
import { WebPageJsonLd } from '@/components/JsonLd';

const title = 'Réservez votre Audit de Suivi de Chantier Vidéo & Timelapse';
const description =
  'Réservez un appel découverte gratuit : nous analysons votre projet de chantier et vous conseillons la meilleure solution de suivi timelapse et drone.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/rendez-vous',
  },
  openGraph: {
    url: '/rendez-vous',
    title,
    description,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd path="/rendez-vous" name={title} description={description} />
      {children}
    </>
  );
}
