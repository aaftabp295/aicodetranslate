import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getIdentifier, guestLimiter, freeLimiter, proLimiter } from '@/lib/ratelimit'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // 1. Get auth state
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 2. Determine plan
    let plan: 'guest' | 'free' | 'pro' = 'guest'
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      plan = 'pro'
    } else if (user) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, expires_at')
        .eq('user_id', user.id)
        .maybeSingle()

      if (subscription && subscription.plan === 'pro') {
        const expiresAt = subscription.expires_at
          ? new Date(subscription.expires_at).getTime()
          : 0
        if (expiresAt > Date.now()) {
          plan = 'pro'
        } else {
          plan = 'free'
        }
      } else {
        plan = 'free'
      }
    }

    // 3. Get rate-limiting identifier
    const { identifier } = getIdentifier(request, user?.id, plan === 'pro')

    // 4. Fetch quota
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return NextResponse.json({
        remaining: 5,
        limit: 5,
        plan,
      })
    }

    let limiter = guestLimiter
    let maxLimit = 3
    if (plan === 'pro') {
      limiter = proLimiter
      maxLimit = 500
    } else if (plan === 'free') {
      limiter = freeLimiter
      maxLimit = 10
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
