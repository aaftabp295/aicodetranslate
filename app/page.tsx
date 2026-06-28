import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Code2, Shield, Heart } from 'lucide-react'
import { ConverterPanel } from '@/components/converter/ConverterPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getLangDisplayName } from '@/lib/languages'

export const metadata = {
  title: 'AI Code Converter – Translate Programming Languages Online',
  description: 'Convert code from one programming language to another instantly using AI. Supports 18 languages, idiomatic output, explanations, and dynamic rate limits.',
}

export default function Home() {
  const popularPairs = [
    { from: 'python', to: 'javascript' },
    { from: 'javascript', to: 'python' },
    { from: 'python', to: 'typescript' },
    { from: 'typescript', to: 'python' },
    { from: 'javascript', to: 'typescript' },
    { from: 'typescript', to: 'javascript' },
    { from: 'java', to: 'python' },
    { from: 'python', to: 'java' },
    { from: 'python', to: 'go' },
    { from: 'go', to: 'python' },
    { from: 'python', to: 'rust' },
    { from: 'rust', to: 'python' },
    { from: 'java', to: 'javascript' },
    { from: 'javascript', to: 'java' },
    { from: 'c', to: 'cpp' },
    { from: 'cpp', to: 'c' },
    { from: 'csharp', to: 'java' },
    { from: 'java', to: 'csharp' },
    { from: 'python', to: 'csharp' },
    { from: 'csharp', to: 'python' },
    { from: 'sql', to: 'python' },
    { from: 'bash', to: 'python' },
    { from: 'kotlin', to: 'java' },
    { from: 'swift', to: 'kotlin' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 text-center bg-radial-gradient">
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next Generation AI Converter</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Convert Code Between Languages <span className="text-primary">Instantly</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Free AI-powered code converter. Paste your code, select languages, and get clean, idiomatic output in seconds. Supported by explanations and side-by-side highlighting.
          </p>
          <div className="pt-4 flex justify-center">
            <Button size="lg" asChild className="cursor-pointer font-bold gap-2 text-primary-foreground bg-primary hover:bg-primary/95 shadow-lg">
              <a href="#converter-section">
                <span>Start Converting</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Converter Section */}
      <section id="converter-section" className="py-12 bg-background border-t border-border/40 scroll-mt-20">
        <ConverterPanel defaultFrom="python" defaultTo="javascript" />
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center tracking-tight mb-12">Designed for Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Real-Time Performance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Highlighting occurs directly on the client with zero network latency. Experience instant editor feedback as you type.
              </p>
            </div>
            <div className="space-y-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Idiomatic Translations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We leverage Gemini models to rewrite structures, map dependencies, and write native constructs rather than naive word map translates.
              </p>
            </div>
            <div className="space-y-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">Privacy First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your code belongs to you. Conversion source files are never saved to database servers or logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Pairs Combinations */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">306 Language Combinations Supported</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              Explore dedicated conversion landing pages for the most popular language pairs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularPairs.map((pair) => {
              const fromDisplay = getLangDisplayName(pair.from)
              const toDisplay = getLangDisplayName(pair.to)
              const slug = `${pair.from}-to-${pair.to}`
              return (
                <Link key={slug} href={`/convert/${slug}`} className="group">
                  <Card className="border-border bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {fromDisplay} to {toDisplay}
                        </span>
                        <p className="text-xs text-muted-foreground">AI code conversion</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
