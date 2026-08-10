const baseUrl = 'https://www.chantierfilm.com';

interface WebPageJsonLdProps {
  path: string;
  name: string;
  description: string;
}

/**
 * JSON-LD WebPage spécifique à une page (rendu côté serveur).
 * À placer dans le layout/page de chaque route.
 */
export function WebPageJsonLd({ path, name, description }: WebPageJsonLdProps) {
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
    inLanguage: 'fr-FR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
