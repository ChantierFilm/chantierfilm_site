// Rate limiting en mémoire (fenêtre glissante), sans dépendance externe.
//
// Limitation connue : sur Vercel (serverless), chaque instance a sa propre
// mémoire — la limite est donc appliquée "par instance". Cela reste un
// rempart efficace contre les scripts de spam naïfs. Pour une protection
// distribuée, brancher Upstash Ratelimit ou Cloudflare Turnstile.

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;
// Balayage de purge au plus une fois par minute (évite le balayage O(n)
// de toute la Map à chaque requête une fois le seuil dépassé).
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = 0;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Purge périodique des buckets entièrement expirés (au plus une fois par
  // minute, au lieu d'un balayage O(n) de toute la Map à chaque requête).
  if (now - lastCleanup >= CLEANUP_INTERVAL_MS) {
    for (const [k, bucket] of buckets) {
      if (bucket.timestamps.every((t) => t <= windowStart)) {
        buckets.delete(k);
      }
    }
    lastCleanup = now;
  }

  let bucket = buckets.get(key);
  if (!bucket) {
    // La Map reste bornée : au-delà de MAX_BUCKETS, la clé la plus ancienne
    // est évincée plutôt que de laisser la mémoire croître sans limite.
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) {
        buckets.delete(oldestKey);
      }
    }
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  bucket.timestamps.push(now);
  return {
    success: true,
    remaining: limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}

export function getClientIp(request: Request): string {
  // Seul le dernier élément de X-Forwarded-For est ajouté par le proxy de
  // confiance (Vercel/CDN) ; les précédents sont contrôlables par le client.
  // Les valeurs sont validées et bornées (45 caractères max) pour empêcher
  // l'injection de clés arbitraires ou surdimensionnées.
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const candidates = forwardedFor.split(',');
    for (let i = candidates.length - 1; i >= 0; i--) {
      const candidate = candidates[i].trim();
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp && isValidIp(realIp)) {
    return realIp;
  }
  return 'unknown';
}

function isValidIp(value: string): boolean {
  return value.length <= 45 && /^[0-9a-fA-F:.]+$/.test(value);
}
