import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import { getPairFromSlug, getPageTitle, getPageDescription, getLangDisplayName, getPopularTargetsFor, PAIRS } from '@/lib/languages'
import { getPairIntro, getPairContent, getDefaultFaqs } from '@/lib/pairContent'
import { ConverterPanel } from '@/components/converter/ConverterPanel'
import { PairPageContent } from '@/components/converter/PairPageContent'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ pair: string }>
}

export async function generateStaticParams() {
  return PAIRS.map((pair) => ({
    pair: `${pair.from}-to-${pair.to}`,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params
  const decoded = getPairFromSlug(pair)
  if (!decoded) return {}

  const { from, to } = decoded
  const title = getPageTitle(from, to)
  const description = getPageDescription(from, to)
  const canonical = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/convert-${pair}`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    other: {
      'last-modified': new Date().toUTCString(),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: `/api/og?from=${from}&to=${to}`,
          width: 1200,
          height: 630,
          alt: `${getLangDisplayName(from)} to ${getLangDisplayName(to)} Code Converter`,
        },
      ],
    },
  }
}

export default async function ConvertPage({ params }: PageProps) {
  const { pair } = await params
  const decoded = getPairFromSlug(pair)

  if (!decoded) {
    notFound()
  }

  const { from, to } = decoded
  const fromDisplay = getLangDisplayName(from)
  const toDisplay = getLangDisplayName(to)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'

  const content = getPairContent(from, to)
  const introParagraph =
    content?.intro ??
    `While ${fromDisplay} excels in its specific runtime environment and syntax style, ${toDisplay} offers unique language primitives, optimizations, and standard idioms. This converter bridges the gap by translating your ${fromDisplay} code to idiomatic ${toDisplay} — handling library mappings, type system differences, and structural patterns automatically.`
  const seoTitle = `Convert ${fromDisplay} to ${toDisplay} Online`
  const metaDescription = getPageDescription(from, to)

  const faqs = content?.faqs ?? getDefaultFaqs(fromDisplay, toDisplay)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': `${fromDisplay} to ${toDisplay} Converter`,
    'applicationCategory': 'DeveloperApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'description': metaDescription,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': appUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': `Convert from ${fromDisplay}`,
        'item': `${appUrl}/convert-from-${from}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${fromDisplay} to ${toDisplay}`,
        'item': `${appUrl}/convert-${pair}`,
      },
    ],
  }

  // Get other popular target conversions from same source
  const otherPopularTargets = getPopularTargetsFor(from).filter((t) => t !== to)

  return (
    <div className="py-10 space-y-12">
      {/* JSON-LD SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* JSON-LD BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-3 w-3" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href={`/convert-from-${from}`} className="hover:text-primary">
            Convert from {fromDisplay}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="font-semibold text-foreground">{fromDisplay} to {toDisplay}</span>
        </nav>
      </div>

      {/* Header Segment */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {seoTitle}
        </h1>
      </div>

      {/* Converter Component */}
      <div>
        <ConverterPanel defaultFrom={from} defaultTo={to} />
      </div>

      {/* Intro Paragraph (Moved below converter for better UX/First Paint) */}
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {introParagraph}
        </p>
      </div>

      {/* Per-Pair SEO Content: diffs, code examples, migration tips */}
      <PairPageContent from={from} to={to} fromDisplay={fromDisplay} toDisplay={toDisplay} />

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full border border-border rounded-lg bg-card px-4 divide-y divide-border">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index + 1}`} className="border-0 py-2">
              <AccordionTrigger className="text-left font-semibold text-sm cursor-pointer hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Alternative Conversions Section */}
      <div className="max-w-3xl mx-auto px-4 py-8 border-t border-border/40 space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Convert {fromDisplay} to a different language
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {otherPopularTargets.map((target) => {
            const targetDisplay = getLangDisplayName(target)
            return (
              <Button
                key={target}
                variant="outline"
                size="sm"
                asChild
                className="rounded-full border-border bg-card hover:bg-primary dark:hover:bg-primary hover:text-primary-foreground dark:hover:text-primary-foreground hover:border-transparent dark:hover:border-transparent cursor-pointer text-xs transition-all font-semibold"
              >
                <Link href={`/convert-${from}-to-${target}`}>
                  {fromDisplay} &rarr; {targetDisplay}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
