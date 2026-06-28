import { Metadata } from 'next'
import { Zap, Code2, Shield } from 'lucide-react'
import { ConverterPanel } from '@/components/converter/ConverterPanel'
import { LanguageFromGrid } from '@/components/converter/LanguageFromGrid'

export const metadata: Metadata = {
  title: 'Free Code Converter – AI-Powered Language Translation Online',
  description:
    'Instantly convert code between 18 programming languages for free. Paste your code, pick source and target, and get clean idiomatic output powered by Gemini AI.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/free-code-converter`,
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
