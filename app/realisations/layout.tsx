import { Metadata } from 'next';
import { WebPageJsonLd } from '@/components/JsonLd';

const title = "Portfolio Chantier Film : L'Expertise Vidéo au service de la Construction";
const description =
  'Timelapses de chantiers, vues drone et reportages BTP : découvrez nos réalisations pour Norske Skog, les collectivités et les entreprises de construction.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/realisations',
  },
  openGraph: {
    url: '/realisations',
    title,
    description,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd path="/realisations" name={title} description={description} />
      {children}
    </>
  );
}
