// Tarifs officiels Chantier Film (HT)
export const PRICING = {
  installation: 1390, // forfait unique, quel que soit le nombre de caméras
  subscriptionPerMonthPerCamera: 290,
  reportageComplet: 2990,
  reportageComplementaire: 1990,
} as const;

export const CAMERA_OPTIONS = [1, 2, 3, 4] as const;
export const MAX_MONTHS = 36;
export const MIN_MONTHS = 1;
export const MAX_CAMERAS = 999;
export const MAX_MONTHS_CUSTOM = 999;
export const MAX_REPORTAGES = 999;

export interface DevisData {
  months: number;
  cameras: number;
  camerasUnknown: boolean;
  reportageComplet: boolean;
  reportagesComplementaires: number;
  fullName: string;
  email: string;
  company?: string;
  message?: string;
}

export interface DevisLine {
  label: string;
  detail?: string;
  amount: number;
}

export function getInstallationLine(): DevisLine {
  return {
    label: "Installation / Désinstallation caméra(s) timelapse",
    detail: "Forfait unique",
    amount: PRICING.installation,
  };
}

export function getSubscriptionLine(d: Pick<DevisData, 'cameras' | 'months'>): DevisLine {
  return {
    label: "Abonnement timelapse",
    detail: `${d.cameras} caméra${d.cameras > 1 ? 's' : ''} × ${d.months} mois × ${formatEuro(PRICING.subscriptionPerMonthPerCamera)}`,
    amount: d.cameras * d.months * PRICING.subscriptionPerMonthPerCamera,
  };
}

export function getReportageCompletLine(d: Pick<DevisData, 'reportageComplet'>): DevisLine | null {
  if (!d.reportageComplet) return null;
  return {
    label: "Reportage complet de chantier",
    detail: "2 demi-journées + drone inclus",
    amount: PRICING.reportageComplet,
  };
}

export function getReportagesComplementairesLine(
  d: Pick<DevisData, 'reportagesComplementaires'>
): DevisLine | null {
  if (!d.reportagesComplementaires) return null;
  return {
    label: "Reportages complémentaires",
    detail: `${d.reportagesComplementaires} × ${formatEuro(PRICING.reportageComplementaire)}`,
    amount: d.reportagesComplementaires * PRICING.reportageComplementaire,
  };
}

export function buildDevisLines(d: DevisData): DevisLine[] {
  const lines: DevisLine[] = [];
  const rc = getReportageCompletLine(d);
  if (rc) lines.push(rc);
  lines.push(getInstallationLine());
  lines.push(getSubscriptionLine(d));
  const rcomp = getReportagesComplementairesLine(d);
  if (rcomp) lines.push(rcomp);
  return lines;
}

// Récap progressif : chaque ligne n'apparaît qu'une fois l'étape
// où elle est choisie atteinte/dépassée.
//   - Reportage complet : étape 0 (visible immédiatement, live)
//   - Installation      : dès qu'un nombre de caméras est sélectionné
//                         (étape 1 avec cameras>0 ou camerasUnknown)
//   - Abonnement        : étape ≥ 2 (sur l'étape durée, live)
//   - Reportages compl. : étape ≥ 3 (sur l'étape, live)
export function buildDevisLinesForStep(d: DevisData, step: number): DevisLine[] {
  const lines: DevisLine[] = [];
  if (step >= 0) {
    const rc = getReportageCompletLine(d);
    if (rc) lines.push(rc);
  }
  const camerasChosen = d.camerasUnknown || d.cameras > 0;
  if (camerasChosen) {
    lines.push(getInstallationLine());
  }
  if (step >= 2 && camerasChosen) {
    lines.push(getSubscriptionLine(d));
  }
  if (step >= 3) {
    const rcomp = getReportagesComplementairesLine(d);
    if (rcomp) lines.push(rcomp);
  }
  return lines;
}

export function computeTotalForStep(d: DevisData, step: number): number {
  return buildDevisLinesForStep(d, step).reduce((sum, l) => sum + l.amount, 0);
}

export function computeTotal(d: DevisData): number {
  return buildDevisLines(d).reduce((sum, l) => sum + l.amount, 0);
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const CONTACT_INFO = {
  phone: '+33 6 51 30 18 93',
  phoneHref: 'tel:+33651301893',
  email: 'contact@chantierfilm.com',
  address: '39 rue Jean Mermoz, 88190 Golbey, France',
  site: 'www.chantierfilm.com',
};
