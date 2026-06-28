import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { LANGUAGES, getLangDisplayName } from '@/lib/languages'
import { LanguageIcon } from '@/components/converter/LanguageIcon'

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

          return (
            <Link key={lang} href={`/convert-from-${lang}`} className="group">
              <Card className="relative overflow-hidden h-full border-border bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-in-out cursor-pointer">
                {/* Subtle coral left-border accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                <CardContent className="p-4 flex items-center justify-between gap-3 h-full">
                  <div className="flex items-center gap-3">
                    <LanguageIcon lang={lang} size={28} useBrandColor />
                    <div className="space-y-0.5">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors block">
                        {displayName}
                      </span>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary translate-x-0 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

