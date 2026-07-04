import { NextResponse, type NextRequest } from 'next/server'
import { LANGUAGES } from '@/lib/languages'
import { createClient } from '@/lib/supabase/server'
import { getIdentifier, checkRateLimit } from '@/lib/ratelimit'
import { convertCode } from '@/lib/gemini'
import { highlightCode } from '@/lib/highlight'


export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json()
    const { code, fromLang, toLang } = body

    // 2. Validate inputs
    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { error: 'Code content must be a non-empty string.' },
        { status: 400 }
      )
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: 'Code exceeds 10,000 character limit' },
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

    // 4. Determine plan (disable pro for now, mapping logged in to free)
    let plan: 'guest' | 'free' | 'pro' = 'guest'
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      plan = 'free'
    } else if (user) {
      plan = 'free'
    }

    // 5. Rate limit check
    const { identifier } = getIdentifier(request, user?.id, false)
    const { success, remaining, reset } = await checkRateLimit(identifier, plan)

    if (!success) {
      return NextResponse.json(
        { error: 'Daily limit reached', remaining: 0, reset },
        { status: 429 }
      )
    }

    // 6. Call convertCode()
    const { converted, error: geminiError } = await convertCode(fromLang, toLang, code)

    if (geminiError || !converted) {
      return NextResponse.json(
        { error: 'Conversion failed. Please try again.' },
        { status: 500 }
      )
    }

    // 7. Log metadata to Supabase (NEVER log the actual code)
    if (user) {
      const { error: dbError } = await supabase.from('conversions').insert({
        user_id: user.id,
        from_lang: fromLang,
        to_lang: toLang,
        char_count: code.length,
        used_explain: false,
      })

      if (dbError) {
        console.error('Failed to log conversion to database:', dbError)
      }
    }

    // Highlight the converted code on the server side
    const highlightedHtml = await highlightCode(converted, toLang)

    // 8. Return response
    return NextResponse.json({
      converted,
      highlightedHtml,
      remaining,
    })
  } catch (err: any) {
    console.error('Unexpected error in convert route:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
