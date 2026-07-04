import { NextResponse, type NextRequest } from 'next/server'
import { highlightCode } from '@/lib/highlight'


export async function POST(request: NextRequest) {
  try {
    const { code, lang } = await request.json()
    
    if (typeof code !== 'string' || !lang) {
      return NextResponse.json(
        { error: 'Invalid payload.' },
        { status: 400 }
      )
    }

    const highlightedHtml = await highlightCode(code, lang)
    
    return NextResponse.json({ highlightedHtml })
  } catch (err: any) {
    console.error('Highlight API error:', err)
    return NextResponse.json(
      { error: err?.message || 'Highlight failed.' },
      { status: 500 }
    )
  }
}
