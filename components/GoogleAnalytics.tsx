'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga4';
import { CONSENT_EVENT, getConsent, type ConsentValue } from './CookieConsent';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  // Lecture paresseuse du consentement stocké (le composant ne rend rien,
  // donc pas de risque de mismatch d'hydration).
  const [consentGranted, setConsentGranted] = useState(() => getConsent() === 'granted');
  const initialized = useRef(false);

  // Écoute des changements de consentement en direct
  useEffect(() => {
    const handleChange = (event: Event) => {
      const value = (event as CustomEvent<ConsentValue>).detail;
      setConsentGranted(value === 'granted');
    };
    window.addEventListener(CONSENT_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_EVENT, handleChange);
  }, []);

  // Initialisation uniquement après consentement explicite (CNIL)
  useEffect(() => {
    if (consentGranted && GA_MEASUREMENT_ID && !initialized.current) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      initialized.current = true;
    }
  }, [consentGranted, GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (initialized.current) {
      ReactGA.send({ hitType: 'pageview', page: pathname });
    }
  }, [pathname, consentGranted]);

  return null;
}
