'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  current: number; // 0-indexed
  completed: number[]; // 0-indexed completed steps
}

export default function Stepper({ steps, current, completed }: StepperProps) {
  return (
    <nav aria-label="Étapes du devis" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((label, idx) => {
          const isCompleted = completed.includes(idx);
          const isCurrent = idx === current;
          const isPast = idx < current;
          const state = isCompleted || isPast ? 'done' : isCurrent ? 'current' : 'upcoming';

          return (
            <li key={idx} className="flex-1 flex items-center">
              <div className="flex flex-col items-center text-center min-w-0">
                <div
                  className={cn(
                    'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-sm border-2 transition-colors flex-shrink-0',
                    state === 'done' && 'bg-chantier-yellow border-chantier-yellow text-chantier-asphalt',
                    state === 'current' && 'bg-chantier-asphalt border-chantier-asphalt text-white',
                    state === 'upcoming' && 'bg-white border-chantier-light-grey text-chantier-steel'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted || isPast ? <Check size={18} /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'hidden sm:block mt-2 text-xs font-semibold leading-tight max-w-[110px]',
                    state === 'current' && 'text-chantier-asphalt',
                    state === 'done' && 'text-chantier-asphalt',
                    state === 'upcoming' && 'text-chantier-steel'
                  )}
                >
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2 -mt-5 sm:-mt-7 rounded-full transition-colors',
                    idx < current ? 'bg-chantier-yellow' : 'bg-chantier-light-grey'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
