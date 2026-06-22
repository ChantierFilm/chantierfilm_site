'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DevisData,
  buildDevisLinesForStep,
  computeTotalForStep,
  formatEuro,
} from '@/lib/devis';
import { cn } from '@/lib/utils';

interface RecapPanelProps {
  data: DevisData;
  step: number;
}

export default function RecapPanel({ data, step }: RecapPanelProps) {
  const [open, setOpen] = useState(false);
  const lines = buildDevisLinesForStep(data, step);
  const total = computeTotalForStep(data, step);
  const hasContent = lines.length > 0;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white rounded-2xl shadow-industrial border border-chantier-light-grey overflow-hidden">
        {/* En-tête — toujours visible */}
        <div className="bg-chantier-asphalt px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Votre estimation</h3>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-white p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Afficher / masquer le récapitulatif"
              aria-expanded={open}
            >
              <ChevronDown
                size={20}
                className={cn('transition-transform', open && 'rotate-180')}
              />
            </button>
          </div>
          <p className="text-chantier-yellow font-bold text-2xl mt-2">{formatEuro(total)} HT</p>
        </div>

        {/* Détail — visible desktop, accordéon mobile */}
        <div className={cn('p-6', open ? 'block' : 'hidden lg:block')}>
          {!hasContent ? (
            <p className="text-chantier-steel text-sm italic">
              Votre estimation apparaîtra ici.
            </p>
          ) : (
            <ul className="space-y-3">
              {lines.map((line, i) => (
                <li key={i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-chantier-asphalt leading-snug">
                      {line.label}
                    </p>
                    {line.detail && (
                      <p className="text-xs text-chantier-steel mt-0.5">{line.detail}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-chantier-asphalt whitespace-nowrap">
                    {formatEuro(line.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 pt-4 border-t-2 border-chantier-yellow">
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-chantier-asphalt uppercase tracking-wide">
                Total HT
              </span>
              <span className="text-xl font-extrabold text-chantier-asphalt">
                {formatEuro(total)}
              </span>
            </div>
            <p className="text-xs text-chantier-steel italic mt-2">
              Estimation indicative HT. Un devis personnalisé vous sera envoyé par mail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
