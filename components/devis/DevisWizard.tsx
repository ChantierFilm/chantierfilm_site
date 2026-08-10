'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  Camera,
  Film,
  ClipboardList,
  Mail,
} from 'lucide-react';
import {
  DevisData,
  CAMERA_OPTIONS,
  MIN_MONTHS,
  MAX_MONTHS,
  MAX_CAMERAS,
  MAX_MONTHS_CUSTOM,
  PRICING,
  formatEuro,
} from '@/lib/devis';
import Stepper from './Stepper';
import RecapPanel from './RecapPanel';
import { cn } from '@/lib/utils';

const STEPS = [
  'Reportage complet',
  'Caméras timelapse',
  'Durée du chantier',
  'Reportages complémentaires',
  'Coordonnées',
];

const INITIAL: DevisData = {
  months: 6,
  cameras: 0,
  camerasUnknown: false,
  reportageComplet: true,
  reportagesComplementaires: 0,
  fullName: '',
  email: '',
  company: '',
  message: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DevisWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DevisData>(INITIAL);
  const [cameraCustom, setCameraCustom] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const completed = useMemo(
    () => Array.from({ length: step }, (_, i) => i).filter((i) => i < step),
    [step]
  );

  const update = (patch: Partial<DevisData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    if (error) setError(null);
  };

  const canNext = (): boolean => {
    if (step === 0) return true; // Reportage complet : toggle oui/non
    if (step === 1)
      return data.cameras > 0 || data.camerasUnknown;
    if (step === 2) return data.months >= MIN_MONTHS;
    if (step === 3) return data.reportagesComplementaires >= 0;
    return false;
  };

  const canSubmit = (): boolean => {
    return (
      data.fullName.trim().length > 0 &&
      data.fullName.trim().length <= 120 &&
      emailRegex.test(data.email.trim()) &&
      (data.company?.trim().length ?? 0) <= 200 &&
      (data.message?.trim().length ?? 0) <= 2000
    );
  };

  const next = () => {
    if (step < STEPS.length - 1 && canNext()) {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      setError('Veuillez vérifier les champs obligatoires (nom et email valide).');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: honeypot }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (e) {
      console.error('Devis submit error:', e);
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setData(INITIAL);
    setCameraCustom(false);
    setHoneypot('');
    setStep(0);
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-industrial border border-chantier-light-grey p-8 sm:p-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-chantier-asphalt mb-4">
          Estimation envoyée
        </h2>
        <p className="text-chantier-concrete leading-relaxed mb-2">
          Votre estimation a été envoyée à{' '}
          <span className="font-bold text-chantier-asphalt">{data.email}</span>.
        </p>
        <p className="text-chantier-concrete leading-relaxed mb-8">
          Notre équipe revient vers vous sous 48h ouvrées pour affiner votre devis.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 bg-chantier-yellow hover:bg-chantier-yellow-dark text-chantier-asphalt font-bold px-6 py-3 rounded-lg shadow-industrial transition-all hover:scale-105"
        >
          Faire une nouvelle estimation
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
      {/* Colonne formulaire */}
      <div className="bg-white rounded-2xl shadow-industrial border border-chantier-light-grey p-6 sm:p-8">
        <Stepper steps={STEPS} current={step} completed={completed} />

        <div className="mt-8 min-h-[280px]">
          {/* Étape 1 — Reportage complet */}
          {step === 0 && (
            <StepShell
              icon={<Film className="w-6 h-6 text-chantier-yellow" />}
              title="Reportage complet de chantier"
              subtitle="La prestation phare de Chantier Film, incluse par défaut dans la plupart de nos projets. Vous pouvez la retirer si vous souhaitez uniquement le suivi timelapse."
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <ToggleCard
                    active={data.reportageComplet}
                    onClick={() => update({ reportageComplet: true })}
                    label="Inclus"
                    value={formatEuro(PRICING.reportageComplet)}
                  />
                  <ToggleCard
                    active={!data.reportageComplet}
                    onClick={() => update({ reportageComplet: false })}
                    label="Sans"
                    value="—"
                  />
                </div>

                <ul className="space-y-2 text-sm text-chantier-concrete bg-gray-50 rounded-lg p-4 border border-chantier-light-grey">
                  <li className="flex items-start gap-2">
                    <span className="text-chantier-yellow font-bold mt-0.5">•</span>
                    <span><strong className="text-chantier-asphalt">Tournage en deux demi-journées</strong> sur site : une au lancement du chantier, une à la livraison.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chantier-yellow font-bold mt-0.5">•</span>
                    <span><strong className="text-chantier-asphalt">Captation drone 4K</strong> : vues aériennes du site et de son environnement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chantier-yellow font-bold mt-0.5">•</span>
                    <span><strong className="text-chantier-asphalt">Montage et post-production</strong> : étalonnage, sound design, habillage graphique.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chantier-yellow font-bold mt-0.5">•</span>
                    <span><strong className="text-chantier-asphalt">Vidéo finale livrée</strong> : film de chantier complet prêt à diffuser (site web, réseaux, investisseurs).</span>
                  </li>
                </ul>

                <p className="text-xs text-chantier-steel">
                  Idéal pour valoriser votre projet de bout en bout et disposer d'un support de communication final professionnel.
                </p>
              </div>
            </StepShell>
          )}

          {/* Étape 2 — Caméras */}
          {step === 1 && (
            <StepShell
              icon={<Camera className="w-6 h-6 text-chantier-yellow" />}
              title="Nombre de caméras timelapse"
              subtitle="Forfait d'installation unique, quel que soit le nombre de caméras."
            >
              <div className="space-y-6">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {CAMERA_OPTIONS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setCameraCustom(false);
                        update({ cameras: n, camerasUnknown: false });
                      }}
                      className={cn(
                        'py-4 rounded-lg border-2 font-bold text-lg transition-all',
                        !data.camerasUnknown && !cameraCustom && data.cameras === n
                          ? 'bg-chantier-yellow border-chantier-yellow text-chantier-asphalt shadow-industrial'
                          : 'bg-white border-chantier-light-grey text-chantier-asphalt hover:border-chantier-yellow'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                  {cameraCustom && !data.camerasUnknown ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      maxLength={3}
                      value={data.cameras === 0 ? '' : data.cameras}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        update({
                          cameras: raw === '' ? 0 : Math.min(parseInt(raw, 10), MAX_CAMERAS),
                          camerasUnknown: false,
                        });
                      }}
                      aria-label="Nombre de caméras personnalisé"
                      className="py-4 rounded-lg border-2 border-chantier-yellow bg-chantier-yellow text-chantier-asphalt shadow-industrial text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-chantier-yellow-dark"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCameraCustom(true);
                        update({ cameras: Math.max(data.cameras, 5), camerasUnknown: false });
                      }}
                      className="py-4 rounded-lg border-2 bg-white border-chantier-light-grey text-chantier-asphalt hover:border-chantier-yellow font-bold text-lg transition-all"
                    >
                      5+
                    </button>
                  )}
                </div>
                {cameraCustom && !data.camerasUnknown && (
                  <p className="text-xs text-chantier-steel italic">
                    Saisissez le nombre exact de caméras souhaité.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCameraCustom(false);
                    update({ cameras: 1, camerasUnknown: true });
                  }}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border-2 transition-all',
                    data.camerasUnknown
                      ? 'bg-chantier-yellow/10 border-chantier-yellow'
                      : 'bg-white border-chantier-light-grey hover:border-chantier-yellow'
                  )}
                >
                  <span className="block font-semibold text-chantier-asphalt">
                    Je ne sais pas encore
                  </span>
                  <span className="block text-sm text-chantier-steel mt-1">
                    Nous compterons 1 caméra par défaut et ajusterons ensemble.
                  </span>
                </button>
                {data.camerasUnknown && (
                  <p className="text-xs text-chantier-steel italic">
                    Note : 1 caméra appliquée par défaut pour l'estimation.
                  </p>
                )}
                <div className="bg-gray-50 rounded-lg p-4 border border-chantier-light-grey">
                  <p className="text-sm text-chantier-concrete">
                    Installation / Désinstallation :{' '}
                    <span className="font-bold text-chantier-asphalt">
                      forfait unique {formatEuro(PRICING.installation)}
                    </span>{' '}
                    — indépendant du nombre de caméras.
                  </p>
                </div>
              </div>
            </StepShell>
          )}

          {/* Étape 3 — Durée du chantier */}
          {step === 2 && (
            <StepShell
              icon={<Calendar className="w-6 h-6 text-chantier-yellow" />}
              title="Durée estimée du chantier"
              subtitle="Indiquez la durée prévue de votre chantier en mois. L'abonnement timelapse est calculé sur cette durée."
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-chantier-concrete">
                      Nombre de mois
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={data.months === 0 ? '' : data.months}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          update({
                            months: raw === '' ? 0 : Math.min(parseInt(raw, 10), MAX_MONTHS_CUSTOM),
                          });
                        }}
                        onBlur={() => {
                          if (data.months < MIN_MONTHS) update({ months: MIN_MONTHS });
                        }}
                        aria-label="Durée du chantier en mois"
                        className="w-20 px-2 py-1 text-center text-2xl font-extrabold text-chantier-asphalt bg-gray-50 border border-chantier-light-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-chantier-yellow focus:border-transparent transition-all"
                      />
                      <span className="text-2xl font-extrabold text-chantier-asphalt">mois</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={MIN_MONTHS}
                    max={MAX_MONTHS}
                    value={Math.min(Math.max(data.months, MIN_MONTHS), MAX_MONTHS)}
                    onChange={(e) => update({ months: Number(e.target.value) })}
                    className="w-full accent-chantier-yellow cursor-pointer"
                    aria-label="Durée du chantier en mois (curseur)"
                  />
                  <div className="flex justify-between text-xs text-chantier-steel mt-2">
                    <span>{MIN_MONTHS} mois</span>
                    <span>{MAX_MONTHS} mois</span>
                  </div>
                </div>
                <p className="text-xs text-chantier-steel">
                  Au-delà de {MAX_MONTHS} mois, saisissez directement la durée souhaitée dans le champ ci-dessus.
                </p>
              </div>
            </StepShell>
          )}

          {/* Étape 4 — Reportages complémentaires */}
          {step === 3 && (
            <StepShell
              icon={<ClipboardList className="w-6 h-6 text-chantier-yellow" />}
              title="Reportages complémentaires"
              subtitle="Reportage intermédiaire avec drone, idéal pour jalons clés ou communication investisseurs."
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      update({
                        reportagesComplementaires: Math.max(
                          0,
                          data.reportagesComplementaires - 1
                        ),
                      })
                    }
                    className="w-11 h-11 rounded-lg border-2 border-chantier-light-grey text-chantier-asphalt font-bold text-xl hover:border-chantier-yellow transition-colors"
                    aria-label="Diminuer"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-extrabold text-chantier-asphalt">
                      {data.reportagesComplementaires}
                    </div>
                    <div className="text-xs text-chantier-steel">
                      {data.reportagesComplementaires} × {formatEuro(PRICING.reportageComplementaire)}
                    </div>
                  </div>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          reportagesComplementaires: data.reportagesComplementaires + 1,
                        })
                      }
                      className="w-11 h-11 rounded-lg border-2 border-chantier-light-grey text-chantier-asphalt font-bold text-xl hover:border-chantier-yellow transition-colors"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-transparent via-chantier-yellow/40 to-transparent" />
              </div>
            </StepShell>
          )}

          {/* Étape 5 — Coordonnées */}
          {step === 4 && (
            <StepShell
              icon={<Mail className="w-6 h-6 text-chantier-yellow" />}
              title="Vos coordonnées"
              subtitle="Recevez votre estimation par mail. Notre équipe vous recontacte sous 48h ouvrées."
            >
              <div className="space-y-4">
                {/* Honeypot anti-spam : invisible pour les humains, ne jamais remplir */}
                <div className="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="devis-website">Site web</label>
                  <input
                    type="text"
                    id="devis-website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <Field label="Nom complet" required>
                  <input
                    type="text"
                    value={data.fullName}
                    maxLength={120}
                    onChange={(e) => update({ fullName: e.target.value })}
                    placeholder="Jean Dupont"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={data.email}
                    maxLength={254}
                    onChange={(e) => update({ email: e.target.value })}
                    placeholder="jean.dupont@entreprise.fr"
                    aria-invalid={data.email.length > 0 && !emailRegex.test(data.email)}
                    aria-describedby="devis-email-error"
                    className={inputClass}
                  />
                  {data.email.length > 0 && !emailRegex.test(data.email) && (
                    <p id="devis-email-error" role="alert" className="text-xs text-red-600 mt-1">
                      Format d'email invalide.
                    </p>
                  )}
                </Field>
                <Field label="Entreprise (optionnel)">
                  <input
                    type="text"
                    value={data.company ?? ''}
                    maxLength={200}
                    onChange={(e) => update({ company: e.target.value })}
                    placeholder="Nom de l'entreprise"
                    className={inputClass}
                  />
                </Field>
                <Field label="Message (optionnel)">
                  <textarea
                    value={data.message ?? ''}
                    maxLength={2000}
                    rows={4}
                    onChange={(e) => update({ message: e.target.value })}
                    placeholder="Précisez votre projet si vous le souhaitez"
                    className={cn(inputClass, 'resize-none')}
                  />
                </Field>
              </div>
            </StepShell>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 border-2 border-red-300 text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-chantier-light-grey">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0 || submitting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-chantier-light-grey text-chantier-asphalt font-semibold hover:border-chantier-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            <span>Précédent</span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canNext()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-chantier-asphalt text-white font-bold hover:bg-chantier-concrete transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Suivant</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit() || submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-chantier-yellow hover:bg-chantier-yellow-dark text-chantier-asphalt font-bold shadow-industrial transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <Spinner /> Envoi en cours...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Recevoir mon estimation par mail
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Colonne récap */}
      <RecapPanel data={data} step={step} />
    </div>
  );
}

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-chantier-light-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-chantier-yellow focus:border-transparent transition-all text-chantier-asphalt placeholder:text-chantier-steel';

function StepShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="text-xl sm:text-2xl font-bold text-chantier-asphalt">{title}</h2>
      </div>
      <p className="text-sm text-chantier-concrete mb-6 max-w-xl">{subtitle}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-chantier-asphalt mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function ToggleCard({
  active,
  onClick,
  label,
  value,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'py-5 rounded-lg border-2 transition-all text-center',
        active
          ? 'bg-chantier-yellow border-chantier-yellow shadow-industrial'
          : 'bg-white border-chantier-light-grey hover:border-chantier-yellow'
      )}
    >
      <div className="text-lg font-bold text-chantier-asphalt">{label}</div>
      <div className="text-sm text-chantier-concrete mt-1">{value}</div>
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
