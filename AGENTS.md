# Chantier Film — Règles du projet

Site vitrine Next.js 16 (App Router) + React 19 + Tailwind, déployé sur Vercel.
Domaine canonique : `https://www.chantierfilm.com`.

## Structure

- `app/` : une route = un dossier `app/<slug>/` avec `layout.tsx` (métadonnées) + `page.tsx` (contenu).
- `components/` : blocs UI réutilisables ; `components/projets/` pour les pages projet.
- `public/projets/<slug>/` : assets d'une page projet (photos, `.dzi` + tiles).
- `components/JsonLd.tsx` : `WebPageJsonLd` pour le JSON-LD par page.

## Conventions SEO obligatoires (toute nouvelle page)

1. **Canonical auto-référencé** dans le `layout.tsx` de la route :
   ```ts
   export const metadata: Metadata = {
     title,
     description,
     alternates: { canonical: '/<slug>' },
     openGraph: { url: '/<slug>', title, description },
   };
   ```
   (`metadataBase` est déjà `https://www.chantierfilm.com` dans `app/layout.tsx`.)
2. **Entrée dans `app/sitemap.ts`** pour les pages indexables.
3. **JSON-LD WebPage** via `<WebPageJsonLd path="/<slug>" … />`.
4. **Redirections permanentes uniquement** (301/308), jamais de 307 pour la
   canonisation — cf. l'incident « page en double sans canonical » de 2026.
5. Une seule URL par contenu : pas de doublon www/non-www, http/https, ni trailing slash.

## Page qui ne doit PAS être indexée (page projet confidentielle)

Suivre le modèle de `app/projet-e-leclerc-remiremont/` :

1. Dans le `layout.tsx` de la route, désactiver l'indexation via les métadonnées :
   ```ts
   export const metadata: Metadata = {
     title,
     robots: {
       index: false,
       follow: false,
       googleBot: { index: false, follow: false },
     },
   };
   ```
   → génère `<meta name="robots" content="noindex, nofollow">`.
2. **Optionnel mais recommandé** : renforcer avec un header dans `next.config.js` :
   ```js
   { source: '/<slug>/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }
   ```
3. **NE PAS** ajouter la page dans `disallow` de `app/robots.ts`.
   Le `disallow` empêche Google de crawler la page, donc il ne voit jamais le
   `noindex` et la page peut rester indexée (bug corrigé en 2026). Pour
   désindexer, il faut laisser la page **crawlable** et s'appuyer sur le `noindex`.
4. **Ne pas** l'ajouter au `sitemap.ts`.

## Page de projet (confidentielle / non indexée)

Les pages projet sont des documents clients confidentiels : elles ne sont **pas
publiques** et ne doivent **pas être indexées**. Elles suivent le modèle « page
non indexée » ci-dessus. Structure :

1. Créer `app/projet-<slug>/` avec `layout.tsx` + `page.tsx`.
2. `layout.tsx` : titre + `robots: { index: false, follow: false }` (pas de
   `alternates.canonical`, pas d'openGraph public, pas de `WebPageJsonLd`).
3. `page.tsx` : contenu, en réutilisant si besoin :
   - `components/projets/DeepZoomViewer.tsx` (zoom profond OpenSeadragon),
   - `components/projets/CameraGallery.tsx` (galerie de vues + lightbox).
4. Assets dans `public/projets/<slug>/` (`.dzi` + dossier `<slug>_files/` pour le plan).
5. **Ne pas** l'ajouter au `sitemap.ts`, et **ne pas** la mettre en `disallow`
   dans `app/robots.ts` (sinon le `noindex` n'est jamais lu).
6. Optionnel : renforcer avec le header `X-Robots-Tag: noindex, nofollow` dans
   `next.config.js` (cf. `projet-e-leclerc-remiremont`).

## Pages de blog

À venir. TODO — documenter les conventions (routing, métadonnées, indexation,
sitemap) au moment de leur mise en place.
