import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/projet-e-leclerc-remiremont'],
      },
    ],
    sitemap: 'https://www.chantierfilm.com/sitemap.xml',
  }
}