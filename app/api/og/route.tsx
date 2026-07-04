import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { LANGUAGE_DISPLAY } from '@/lib/languages'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const mode = searchParams.get('mode')

    const getLangDisplayName = (lang: string | null) => {
      if (!lang) return ''
      return LANGUAGE_DISPLAY[lang as keyof typeof LANGUAGE_DISPLAY] || lang.charAt(0).toUpperCase() + lang.slice(1)
    }

    let element: React.JSX.Element

    if (from && to) {
      // Pair OG Image
      const fromName = getLangDisplayName(from)
      const toName = getLangDisplayName(to)
      element = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf9f5',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 'bold', color: '#141413' }}>
              {fromName}
            </span>
            <span style={{ fontSize: 72, color: '#d97757', marginLeft: 24, marginRight: 24 }}>
              →
            </span>
            <span style={{ fontSize: 72, fontWeight: 'bold', color: '#141413' }}>
              {toName}
            </span>
          </div>
          <div style={{ fontSize: 28, color: '#b0aea5' }}>
            Free AI Code Converter
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              fontSize: 24,
              fontWeight: 'bold',
              color: '#d97757',
            }}
          >
            CodeConvert
          </div>
        </div>
      )
    } else if (from && mode === 'from') {
      // From-only OG Image
      const fromName = getLangDisplayName(from)
      element = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf9f5',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', color: '#141413', marginBottom: 10 }}>
            Convert {fromName} Code
          </div>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#d97757', marginBottom: 20 }}>
            to 17 languages
          </div>
          <div style={{ fontSize: 28, color: '#b0aea5' }}>
            Free AI Code Converter
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              fontSize: 24,
              fontWeight: 'bold',
              color: '#d97757',
            }}
          >
            CodeConvert
          </div>
        </div>
      )
    } else {
      // Default OG Image
      element = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#faf9f5',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', color: '#141413', marginBottom: 20 }}>
            Free AI Code Converter
          </div>
          <div style={{ fontSize: 32, color: '#d97757', textAlign: 'center', maxWidth: '80%' }}>
            Convert Python, JS, TS, Java, Rust & more instantly
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              fontSize: 24,
              fontWeight: 'bold',
              color: '#d97757',
            }}
          >
            CodeConvert
          </div>
        </div>
      )
    }

    return new ImageResponse(element, {
      width: 1200,
      height: 630,
    })
  } catch (err: any) {
    console.error('OG generation error:', err)
    return new Response('Failed to generate image', { status: 500 })
  }
}
