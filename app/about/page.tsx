import { Metadata } from 'next'
import { Code2, Zap, Globe, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About AI Code Translate – AI-Powered Code Conversion Tool',
  description:
    'Learn about AI Code Translate, the AI-powered code translation tool built for developers. Who built it, why it exists, and the technology powering it.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          <Code2 className="h-3.5 w-3.5" />
          <span>About Us</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          What is AI Code Translate?
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
          AI Code Translate is a free, AI-powered tool that translates source code between programming
          languages — instantly, accurately, and idiomatically.
        </p>
      </div>

      {/* Who built it */}
      <section className="space-y-4 border-t border-border pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Who built this?</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          AI Code Translate was built by an independent developer with a background in software
          engineering and developer tooling. Having spent years switching between Python, Go,
          TypeScript, and Rust across different projects, the tedium of manually translating idioms,
          patterns, and library calls between languages was a constant friction point.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Existing tools either produced naive, line-by-line transliterations that didn&apos;t
          respect the target language&apos;s conventions, or required a full IDE setup and plugin
          chain. AI Code Translate exists to solve that — a clean, zero-setup converter that understands
          the semantic differences between languages, not just their syntax.
        </p>
      </section>

      {/* Why it exists */}
      <section className="space-y-4 border-t border-border pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Why does AI Code Translate exist?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2 p-4 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">Save Hours of Work</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Porting a module from one language to another shouldn&apos;t take a full day.
              AI Code Translate handles the boilerplate in seconds so you can focus on the hard parts.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">Learn by Example</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seeing your own familiar code translated into a new language is one of the fastest
              ways to learn its idioms, patterns, and standard library conventions.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">Idiomatic Output</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Powered by Gemini, the converter doesn&apos;t just swap syntax — it maps data
              structures, library calls, and patterns to their natural equivalents in the target
              language.
            </p>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="space-y-4 border-t border-border pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Technology</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          AI Code Translate is built on <strong className="text-foreground">Next.js</strong> (deployed on
          Cloudflare Pages with Edge runtime), uses{' '}
          <strong className="text-foreground">Google Gemini</strong> for AI-powered translation, and{' '}
          <strong className="text-foreground">Supabase</strong> for user accounts and quota
          tracking. Code highlighting is handled entirely client-side for zero latency.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The AI model is prompted specifically to produce idiomatic, production-quality output —
          not a token-by-token substitution. Results should always be reviewed and tested before
          use in production.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-3 border-t border-border pt-10">
        <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Questions, feedback, or bug reports?{' '}
          <a
            href="mailto:hello@aicodetranslate.com"
            className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            hello@aicodetranslate.com
          </a>
        </p>
      </section>
    </div>
  )
}
