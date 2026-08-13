/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cal.com https://*.cal.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://cal.com https://*.cal.com;
  frame-src https://www.youtube-nocookie.com https://www.youtube.com https://cal.com https://*.cal.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

// Les assets public/ ne sont pas fingerprintés : cache d'1 jour avec
// revalidation en arrière-plan pendant 7 jours (au lieu de max-age=0).
const staticAssetHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, stale-while-revalidate=604800',
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/projet-e-leclerc-remiremont/:path*',
        headers: [
          ...securityHeaders,
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/images/:path*',
        headers: staticAssetHeaders,
      },
      {
        source: '/logos/:path*',
        headers: staticAssetHeaders,
      },
      {
        source: '/favicons/:path*',
        headers: staticAssetHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/prise-de-rendez-vous',
        destination: '/rendez-vous',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
