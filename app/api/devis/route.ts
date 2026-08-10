import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import DevisConfirmationEmail from '@/components/emails/DevisConfirmationEmail';
import DevisNotificationEmail from '@/components/emails/DevisNotificationEmail';
import {
  DevisData,
  MIN_MONTHS,
  MAX_MONTHS_CUSTOM,
  MAX_CAMERAS,
  MAX_REPORTAGES,
  computeTotal,
} from '@/lib/devis';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Chantier Film <contact@chantierfilm.com>';
const INTERNAL_TO = 'contact@chantierfilm.com';

// 5 demandes max par IP et par tranche de 10 minutes
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) return false;
  if (domain.length > 253) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`devis:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: 'Trop de demandes envoyées. Veuillez réessayer dans quelques minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = await request.json();

    // Honeypot anti-spam : champ invisible rempli uniquement par les bots.
    // On simule un succès pour ne pas leur signaler le blocage.
    if (typeof body?.website === 'string' && body.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Votre estimation a été envoyée par mail.',
      });
    }

    const months = Number(body?.months);
    const cameras = Number(body?.cameras);
    const reportagesComplementaires = Number(body?.reportagesComplementaires);
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const company = typeof body?.company === 'string' ? body.company.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    // Validation
    if (!fullName || fullName.length === 0 || fullName.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Le nom complet est requis (max 120 caractères).' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Un email valide est requis.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(months) || months < MIN_MONTHS || months > MAX_MONTHS_CUSTOM) {
      return NextResponse.json(
        { success: false, error: `La durée doit être entre ${MIN_MONTHS} et ${MAX_MONTHS_CUSTOM} mois.` },
        { status: 400 }
      );
    }

    if (!Number.isInteger(cameras) || cameras < 1 || cameras > MAX_CAMERAS) {
      return NextResponse.json(
        { success: false, error: `Le nombre de caméras doit être entre 1 et ${MAX_CAMERAS}.` },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(reportagesComplementaires) ||
      reportagesComplementaires < 0 ||
      reportagesComplementaires > MAX_REPORTAGES
    ) {
      return NextResponse.json(
        { success: false, error: 'Le nombre de reportages complémentaires est invalide.' },
        { status: 400 }
      );
    }

    if (company.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Le nom de l\'entreprise est trop long (max 200 caractères).' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Le message est trop long (max 2000 caractères).' },
        { status: 400 }
      );
    }

    const data: DevisData = {
      months,
      cameras,
      camerasUnknown: Boolean(body?.camerasUnknown),
      reportageComplet: Boolean(body?.reportageComplet),
      reportagesComplementaires,
      fullName,
      email,
      company: company || undefined,
      message: message || undefined,
    };

    // Au moins une sélection : l'installation est toujours présente donc le total est > 0
    if (computeTotal(data) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune prestation sélectionnée.' },
        { status: 400 }
      );
    }

    const subjectCompany = data.company ? ` — ${data.company}` : '';
    const prospectSubject = `Votre estimation Chantier Film — ${data.fullName}`;
    const internalSubject = `Nouveau devis en ligne — ${data.fullName}${subjectCompany}`;

    const [prospectResult, internalResult] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: [email],
        replyTo: INTERNAL_TO,
        subject: prospectSubject,
        react: DevisConfirmationEmail({ data }),
      }),
      resend.emails.send({
        from: FROM,
        to: [INTERNAL_TO],
        replyTo: email,
        subject: internalSubject,
        react: DevisNotificationEmail({ data }),
      }),
    ]);

    if (prospectResult.error || internalResult.error) {
      console.error('Resend errors:', {
        prospect: prospectResult.error,
        internal: internalResult.error,
      });
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'envoi des emails. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Votre estimation a été envoyée par mail.',
    });
  } catch (error) {
    console.error('Unexpected error in /api/devis:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
