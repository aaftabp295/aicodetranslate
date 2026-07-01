import { Metadata } from 'next'
import { Zap, Code2, Shield } from 'lucide-react'
import { ConverterPanel } from '@/components/converter/ConverterPanel'
import { LanguageFromGrid } from '@/components/converter/LanguageFromGrid'

export const metadata: Metadata = {
  title: 'Free Code Converter — Convert Between 18 Languages Online',
  description: 'Free online AI code converter. Convert Python, JavaScript, TypeScript, Java, Go, Rust and more. Paste your code and get idiomatic output instantly.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'}/free-code-converter`,
  },
}

export default function FreeCodeConverterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Converter Section */}
      <section className="py-12 bg-background border-b border-border/40">
        <ConverterPanel defaultFrom="python" defaultTo="javascript" />
      </section>

      {/* Choose a language to convert from grid */}
      <section className="py-20 bg-background border-b border-border/40">
        <LanguageFromGrid />
      </section>
    </div>
  )
}
