import { NextResponse, type NextRequest } from 'next/server'
import { LANGUAGES } from '@/lib/languages'
import { createClient } from '@/lib/supabase/server'
import { getIdentifier, checkRateLimit } from '@/lib/ratelimit'
import { explainConversion } from '@/lib/gemini'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()
    const { fromLang, toLang, originalCode, convertedCode } = body

    // 2. Validate inputs
    if (typeof originalCode !== 'string' || !originalCode.trim()) {
      return NextResponse.json(
        { error: 'Original code content must be a non-empty string.' },
        { status: 400 }
      )
    }

    if (originalCode.length > 10000) {
      return NextResponse.json(
        { error: 'Original code exceeds 10,000 character limit' },
        { status: 400 }
      )
    }

    if (typeof convertedCode !== 'string' || !convertedCode.trim()) {
      return NextResponse.json(
        { error: 'Converted code content must be a non-empty string.' },
        { status: 400 }
      )
    }

    if (convertedCode.length > 10000) {
      return NextResponse.json(
        { error: 'Converted code exceeds 10,000 character limit' },
        { status: 400 }
      )
    }

    const isValidLang = (lang: any): lang is typeof LANGUAGES[number] => {
      return LANGUAGES.includes(lang)
    }

    if (!isValidLang(fromLang) || !isValidLang(toLang)) {
      return NextResponse.json(
        { error: 'Invalid language' },
        { status: 400 }
      )
    }

    if (fromLang === toLang) {
      return NextResponse.json(
        { error: 'Source and target language must be different' },
        { status: 400 }
      )
    }

    // 3. Get auth state
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 4. Determine plan
    let plan: 'guest' | 'free' | 'pro' = 'guest'
    if (user) {
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

    // 5. Rate limit check
    const { identifier } = getIdentifier(request, user?.id, plan === 'pro')
    const { success, remaining, reset } = await checkRateLimit(identifier, plan)

    if (!success) {
      return NextResponse.json(
        { error: 'Daily limit reached', remaining: 0, reset },
        { status: 429 }
      )
    }

    // 6. Call explainConversion()
    const { explanation, error: geminiError } = await explainConversion(
      fromLang,
      toLang,
      originalCode,
      convertedCode
    )

    if (geminiError || !explanation) {
      return NextResponse.json(
        { error: 'Failed to generate explanation. Please try again.' },
        { status: 500 }
      )
    }

    // 7. Return response
    return NextResponse.json({
      explanation,
    })
  } catch (err: any) {
    console.error('Unexpected error in explain route:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
