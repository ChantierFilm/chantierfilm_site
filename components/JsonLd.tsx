const baseUrl = 'https://www.chantierfilm.com';

interface WebPageJsonLdProps {
  path: string;
  name: string;
  description: string;
  primaryImageOfPage?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}

/**
 * JSON-LD WebPage spécifique à une page (rendu côté serveur).
 * À placer dans le layout/page de chaque route.
 */
export function WebPageJsonLd({
  path,
  name,
  description,
  primaryImageOfPage,
}: WebPageJsonLdProps) {
  const url = `${baseUrl}${path}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@id': `${baseUrl}/#organization` },
    ...(primaryImageOfPage && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: primaryImageOfPage.url,
        width: primaryImageOfPage.width,
        height: primaryImageOfPage.height,
        caption: primaryImageOfPage.alt,
      },
    }),
    inLanguage: 'fr-FR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
