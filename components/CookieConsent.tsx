'use client';

import { useEffect, useState } from 'react';

export const CONSENT_KEY = 'cf-cookie-consent';
export const CONSENT_EVENT = 'cf-consent-change';

export type ConsentValue = 'granted' | 'denied';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
}

function setConsent(value: ConsentValue) {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}

/**
 * Bandeau de consentement CNIL : Google Analytics n'est chargé qu'après
 * acceptation explicite. Le refus ne dépose aucun cookie de mesure.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Affichage différé volontaire après hydratation : le HTML SSR ne doit
    // pas contenir le bandeau pour éviter un mismatch d'hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getConsent() === null);
  }, []);

  const choose = (value: ConsentValue) => {
    setConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Bandeau de consentement aux cookies"
      className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-industrial-lg border border-chantier-light-grey p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-chantier-concrete leading-relaxed flex-1">
          Nous utilisons <strong className="text-chantier-asphalt">Google Analytics</strong> pour
          mesurer l'audience du site (pages visitées, durée de visite). Ces cookies ne sont
          déposés qu'avec votre accord. Vous pouvez accepter ou refuser librement.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="px-5 py-2.5 rounded-lg border-2 border-chantier-light-grey text-chantier-asphalt font-semibold text-sm hover:border-chantier-steel transition-colors"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="px-5 py-2.5 rounded-lg bg-chantier-yellow hover:bg-chantier-yellow-dark text-chantier-asphalt font-bold text-sm shadow-industrial transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
