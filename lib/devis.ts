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
export const MAX_REPORTAGES_COMPLEMENTAIRES = 5;

export interface DevisData {
  months: number;
  cameras: number; // 1-4 (1 par défaut si "je ne sais pas")
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
  const lines: DevisLine[] = [
    getInstallationLine(),
    getSubscriptionLine(d),
  ];
  const rc = getReportageCompletLine(d);
  if (rc) lines.push(rc);
  const rcomp = getReportagesComplementairesLine(d);
  if (rcomp) lines.push(rcomp);
  return lines;
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
