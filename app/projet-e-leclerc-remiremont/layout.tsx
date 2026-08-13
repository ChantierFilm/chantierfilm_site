import type { Metadata } from 'next';

const title = 'Projet E. Leclerc Remiremont';

export const metadata: Metadata = {
  title,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
