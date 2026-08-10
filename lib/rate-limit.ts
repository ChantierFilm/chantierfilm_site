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

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Nettoyage opportuniste pour éviter une croissance mémoire infinie
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, bucket] of buckets) {
      if (bucket.timestamps.every((t) => t <= windowStart)) {
        buckets.delete(k);
      }
    }
  }

  const bucket = buckets.get(key) ?? { timestamps: [] };
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
  buckets.set(key, bucket);

  return {
    success: true,
    remaining: limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
