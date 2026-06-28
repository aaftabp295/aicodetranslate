import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Home, Sparkles, HelpCircle } from 'lucide-react'
import { LANGUAGES, getLangDisplayName, getFromPageTitle, getFromPageDescription, getPopularTargetsFor, Language } from '@/lib/languages'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LanguageIcon } from '@/components/converter/LanguageIcon'

interface PageProps {
  params: Promise<{ language: string }>
}

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({
    language: lang,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params
  const isValid = LANGUAGES.includes(language as Language)
  if (!isValid) return {}

  const title = getFromPageTitle(language)
  const description = getFromPageDescription(language)
  const canonical = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/convert-from-${language}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: `/api/og?from=${language}&mode=from`,
          width: 1200,
          height: 630,
          alt: `Convert ${getLangDisplayName(language)} Code Online`,
        },
      ],
    },
  }
}

const USE_CASES: Record<string, string> = {
  python: 'Python is the leading language for machine learning, data science, and scripting. Translate to JavaScript if you are building frontend interfaces, or to Go/Rust for building high-concurrency backend microservices.',
  javascript: 'JavaScript is the core runtime of the web. Translate to TypeScript to introduce static type safety for large codebases, or to Python for scripting, scripting pipelines, and data tasks.',
  typescript: 'TypeScript introduces type-safety to JavaScript. Translate to JavaScript to run scripts directly without transpile steps, or to Python for machine learning workflows.',
  java: 'Java powers enterprise-grade backends and Android applications. Translate to Kotlin for modern Android conventions, or to Python for rapid prototyping and helper scripts.',
  cpp: 'C++ is optimized for memory-control and speed. Translate to Rust for modern memory-safety guarantees, or to Python for wrapping low-level logic into high-level APIs.',
  csharp: 'C# dominates the Microsoft developer landscape and Unity game dev. Translate to Java for cross-platform enterprise backends, or to C++ for game engine integrations.',
  go: 'Go is designed for lightweight, high-performance web servers and microservices. Translate to Rust for low-level systems utilities, or to Python for automation tasks.',
  rust: 'Rust offers bare-metal speed with memory safety. Translate to Go for simple backend REST APIs, or to Python for scripting integrations.',
}

export default async function ConvertFromPage({ params }: PageProps) {
  const { language } = await params
  const isValid = LANGUAGES.includes(language as Language)

  if (!isValid) {
    notFound()
  }

  const from = language as Language
  const fromDisplay = getLangDisplayName(from)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'

  // Get popular targets
  const popularTargets = getPopularTargetsFor(from)

  // Get remaining targets
  const remainingTargets = LANGUAGES.filter(
    (lang) => lang !== from && !popularTargets.includes(lang)
  )

  // Format schema ItemList elements (Step 8)
  const allTargets = LANGUAGES.filter((lang) => lang !== from)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `Convert ${fromDisplay} Code To...`,
    'numberOfItems': allTargets.length,
    'itemListElement': allTargets.map((target, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': `${fromDisplay} to ${getLangDisplayName(target)}`,
      'url': `${appUrl}/convert/${from}-to-${target}`,
    })),
  }

  return (
    <div className="py-10 space-y-12 max-w-6xl mx-auto px-4 animate-in fade-in duration-300">
      {/* JSON-LD ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary flex items-center gap-1">
          <Home className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="font-semibold text-foreground">Convert from {fromDisplay}</span>
      </nav>

      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Convert {fromDisplay} Code to Any Language
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Choose your target language below. Our AI converts your {fromDisplay} code to idiomatic, production-ready code in seconds. No signup required.
        </p>
      </div>

      {/* Popular Targets Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Popular conversions from {fromDisplay}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {popularTargets.map((target, index) => {
            const targetDisplay = getLangDisplayName(target)
            return (
              <Link key={target} href={`/convert/${from}-to-${target}`} className="group relative">
                {index < 3 && (
                  <span className="absolute -top-2 left-4 z-10 bg-primary text-[9px] text-primary-foreground font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Popular
                  </span>
                )}
                <Card className="relative overflow-hidden border-border bg-card group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <CardContent className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <LanguageIcon lang={target} size={22} useBrandColor />
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {targetDisplay}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* All Available Targets Grid */}
      <div className="space-y-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-xl font-bold tracking-tight">All available target languages</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{remainingTargets.length} more languages available</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {remainingTargets.map((target) => {
            const targetDisplay = getLangDisplayName(target)
            return (
              <Link key={target} href={`/convert/${from}-to-${target}`} className="group">
                <Card className="border-border bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden">
                  {/* Subtle coral left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <CardContent className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <LanguageIcon lang={target} size={22} useBrandColor />
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {targetDisplay}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom Use Case CTA */}
      <Card className="border border-border bg-card/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-lg mt-8 shadow-sm">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <HelpCircle className="h-4 w-4" />
            <span>Not sure which language to choose?</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            {USE_CASES[from] || `Translate ${fromDisplay} scripts to other modern stacks to take advantage of cross-platform libraries, microservice tooling, or language performance gains.`}
          </p>
        </div>
        <Button asChild className="cursor-pointer font-bold shrink-0 bg-primary text-primary-foreground hover:bg-primary/95 text-xs sm:text-sm">
          <Link href={`/convert/${from}-to-${popularTargets[0]}`}>
            Try {fromDisplay} &rarr; {getLangDisplayName(popularTargets[0])}
          </Link>
        </Button>
      </Card>
    </div>
  )
}
