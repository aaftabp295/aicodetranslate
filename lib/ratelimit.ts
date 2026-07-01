import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Guest limiter: 2 conversions per 24 hours
export const guestLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '86400 s'),
  analytics: true,
  prefix: 'ratelimit:guest',
})

// Free account limiter: 5 conversions per 24 hours
export const freeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '86400 s'),
  analytics: true,
  prefix: 'ratelimit:free',
})

// Pro account limiter: disabled (mapped to free for now)
export const proLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '86400 s'),
  analytics: true,
  prefix: 'ratelimit:pro',
})

/**
 * Checks if a user or visitor has exceeded their rate limit.
 * Fault-tolerant wrapper that bypasses rate limiting if Redis is down or unconfigured.
 */
export async function checkRateLimit(identifier: string, plan: 'guest' | 'free' | 'pro') {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('Upstash Redis environment variables are missing. Bypassing rate limit.')
      return { success: true, remaining: 5, reset: Date.now() + 86400000 }
    }

    let limiter: Ratelimit
    if (plan === 'pro') {
      limiter = proLimiter
    } else if (plan === 'free') {
      limiter = freeLimiter
    } else {
      limiter = guestLimiter
    }

    const { success, remaining, reset } = await limiter.limit(identifier)
    return { success, remaining, reset }
  } catch (err) {
    console.error('Ratelimit execution failed. Bypassing rate limit.', err)
    // Fall back to allowing request so application remains operational
    return { success: true, remaining: 5, reset: Date.now() + 86400000 }
  }
}

/**
 * Helper to extract rate-limiting identifier and type from the request context.
 */
export function getIdentifier(
  request: Request,
  userId?: string,
  isPro: boolean = false
): { identifier: string; type: 'guest' | 'free' | 'pro' } {
  if (userId) {
    return { identifier: userId, type: 'free' }
  }

  const cfIp = request.headers.get('cf-connecting-ip')
  const xForwarded = request.headers.get('x-forwarded-for')
  const ip = cfIp || (xForwarded ? xForwarded.split(',')[0].trim() : '127.0.0.1')

  return { identifier: ip, type: 'guest' }
}
