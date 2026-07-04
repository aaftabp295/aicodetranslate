import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIdentifier, guestLimiter, freeLimiter, proLimiter } from '@/lib/ratelimit'


export async function GET(request: NextRequest) {
  try {
    // 1. Get auth state
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 2. Determine plan (disable pro for now, mapping logged in to free)
    let plan: 'guest' | 'free' | 'pro' = 'guest'
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      plan = 'free'
    } else if (user) {
      plan = 'free'
    }

    // 3. Get rate-limiting identifier
    const { identifier } = getIdentifier(request, user?.id, false)

    // 4. Fetch quota fallbacks if Redis is unconfigured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return NextResponse.json({
        remaining: plan === 'guest' ? 2 : 5,
        limit: plan === 'guest' ? 2 : 5,
        plan,
      })
    }

    let limiter = guestLimiter
    let maxLimit = 2
    if (plan === 'free') {
      limiter = freeLimiter
      maxLimit = 5
    }

    // Check quota directly from Redis without consuming a token
    const { remaining } = await limiter.getRemaining(identifier)

    return NextResponse.json({
      remaining,
      limit: maxLimit,
      plan,
    })
  } catch (err: any) {
    console.error('Error fetching quota:', err)
    return NextResponse.json(
      { error: 'Failed to fetch quota information' },
      { status: 500 }
    )
  }
}
