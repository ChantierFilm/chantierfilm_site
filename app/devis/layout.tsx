import { Metadata } from 'next';
import { WebPageJsonLd } from '@/components/JsonLd';

const title = 'Devis en ligne — Estimez votre projet';
const description =
  'Estimez en quelques clics le coût de votre suivi de chantier timelapse et de vos reportages drone. Recevez votre estimation par mail sous 48h.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/devis',
  },
  openGraph: {
    url: '/devis',
    title,
    description,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd path="/devis" name={title} description={description} />
      {children}
    </>
  );
}
