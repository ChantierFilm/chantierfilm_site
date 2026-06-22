import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devis en ligne — Estimez votre projet',
  description:
    'Estimez en quelques clics le coût de votre suivi de chantier timelapse et de vos reportages drone. Recevez votre estimation par mail sous 48h.',
  alternates: {
    canonical: '/devis',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
