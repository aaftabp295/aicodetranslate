import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPairFromSlug, getPageTitle, getPageDescription, getLangDisplayName, PAIRS } from '@/lib/languages'
import { ConverterPanel } from '@/components/converter/ConverterPanel'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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

  const seoTitle = `Convert ${fromDisplay} to ${toDisplay} Online`
  const metaDescription = getPageDescription(from, to)

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

  return (
    <div className="py-10 space-y-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Segment */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {seoTitle}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Welcome to the easiest {from} to {to} converter built for developers. While {fromDisplay} excels in its specific runtime environment and syntax style, {toDisplay} offers unique language primitives, optimizations, and standard idioms. This tool bridges the gap by translating your codebases and structures between them in milliseconds.
        </p>
      </div>

      {/* Converter Component */}
      <div>
        <ConverterPanel defaultFrom={from} defaultTo={to} />
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full border border-border rounded-lg bg-card px-4 divide-y divide-border">
          <AccordionItem value="faq-1" className="border-0 py-2">
            <AccordionTrigger className="text-left font-semibold text-sm cursor-pointer hover:no-underline hover:text-primary">
              Is this {fromDisplay} to {toDisplay} converter free?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Yes! Our {fromDisplay} to {toDisplay} converter is completely free to use. You can run up to 5 conversions per day without even needing to create an account. For unlimited conversions, you can choose one of our affordable premium subscriptions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border-0 py-2">
            <AccordionTrigger className="text-left font-semibold text-sm cursor-pointer hover:no-underline hover:text-primary">
              How accurate is the {fromDisplay} to {toDisplay} conversion?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The conversion is powered by Gemini, Google's advanced language model. It produces highly accurate, idiomatic, and syntactically valid code by mapping corresponding libraries, types, and logic constructs between the two languages.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border-0 py-2">
            <AccordionTrigger className="text-left font-semibold text-sm cursor-pointer hover:no-underline hover:text-primary">
              What types of {fromDisplay} code can I convert to {toDisplay}?
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can convert any standard {fromDisplay} code, including individual helper functions, complex classes, standard algorithms, data structure operations, and business logic. The converter handles scoping, syntax, and keyword translations automatically.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
