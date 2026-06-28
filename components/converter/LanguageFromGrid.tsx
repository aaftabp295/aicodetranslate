import Link from 'next/link'
import { ArrowRight, Code2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { LANGUAGES, getLangDisplayName } from '@/lib/languages'

const TAGLINES: Record<string, string> = {
  python: 'Simple, readable, widely used',
  javascript: 'The language of the web',
  typescript: 'JavaScript with types',
  java: 'Enterprise-grade, cross-platform',
  cpp: 'Performance-critical systems',
  csharp: 'Microsoft ecosystem',
  go: 'Fast, simple, concurrent',
  rust: 'Memory-safe systems language',
  php: 'Server-side web scripting',
  ruby: 'Developer happiness first',
  swift: 'Apple platforms',
  kotlin: 'Modern Android & JVM',
  scala: 'Functional JVM language',
  r: 'Statistical computing',
  bash: 'Shell scripting & automation',
  sql: 'Relational database queries',
  dart: 'Flutter & cross-platform',
  c: 'Low-level systems programming',
}

export function LanguageFromGrid() {
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3.5xl font-bold tracking-tight">
          Choose a language to convert from
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
          Select your source language to see all available target conversions and optimize your workflows.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {LANGUAGES.map((lang) => {
          const displayName = getLangDisplayName(lang)
          const tagline = TAGLINES[lang] || 'AI code conversion'
          // Two-letter initials helper
          const initials = displayName.substring(0, 2)

          return (
            <Link key={lang} href={`/convert-from-${lang}`} className="group">
              <Card className="h-full border-border bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between gap-3 h-full">
                  <div className="flex items-center gap-3">
                    {/* Circle badge */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {initials}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block">
                        {displayName}
                      </span>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
