import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service – AI Code Translate',
  description:
    'Terms of service for AI Code Translate. Acceptable use policy, no-warranty clause on AI output, and subscription terms.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'}/terms`,
  },
}

const CONTACT_EMAIL = 'hello@aicodetranslate.com'
const EFFECTIVE_DATE = 'June 29, 2025'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          By using AI Code Translate (&quot;the Service&quot;), you agree to these Terms of Service.
          Please read them carefully.
        </p>
      </div>

      <Section title="1. Acceptable use">
        <p>You may use AI Code Translate to convert code for personal or commercial projects. You agree not to:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Use the Service to generate or translate malicious code, malware, or exploits.</li>
          <li>Attempt to reverse-engineer, scrape, or abuse the API in ways that degrade service for other users.</li>
          <li>Circumvent rate limits or quota enforcement through automated means (bots, scrapers).</li>
          <li>Submit code that violates applicable laws or third-party intellectual property rights.</li>
          <li>Resell or white-label the raw API without written permission.</li>
        </ul>
        <p className="mt-2">
          We reserve the right to suspend or terminate accounts that violate these terms at our
          sole discretion, without prior notice.
        </p>
      </Section>

      <Section title="2. No warranty on AI output">
        <p>
          AI Code Translate uses AI (Google Gemini) to generate code translations.{' '}
          <strong className="text-foreground">
            All output is provided &quot;as is&quot; without any warranty of correctness,
            completeness, or fitness for a particular purpose.
          </strong>
        </p>
        <p className="mt-2">
          AI-generated code can and does make mistakes. Logic errors, missing edge cases, incorrect
          library mappings, and security flaws may appear in output.{' '}
          <strong className="text-foreground">
            You are solely responsible for reviewing, testing, and validating all converted code
            before deploying it in any environment.
          </strong>
        </p>
        <p className="mt-2">
          AI Code Translate shall not be liable for any damages — including but not limited to data loss,
          security incidents, or financial loss — arising from reliance on AI-generated output.
        </p>
      </Section>

      <Section title="3. Free tier usage">
        <p>
          The free tier allows up to 5 code conversions per day without an account. Free tier usage
          is subject to fair-use enforcement. We reserve the right to adjust free tier limits at
          any time with reasonable notice.
        </p>
      </Section>

      <Section title="4. Subscription terms">
        <p>
          Paid subscriptions grant higher or unlimited conversion quotas. By subscribing you agree:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong className="text-foreground">Billing.</strong> Subscriptions are billed monthly
            or annually in advance. Prices are listed on the{' '}
            <a href="/pricing" className="text-primary underline underline-offset-4 hover:opacity-80">
              Pricing page
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Cancellation.</strong> You may cancel at any time.
            Access continues until the end of the current billing period. No partial refunds are
            issued for unused portions of a billing cycle.
          </li>
          <li>
            <strong className="text-foreground">Refunds.</strong> Refund requests within 7 days
            of initial purchase may be honoured at our discretion. Contact{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Price changes.</strong> We will provide at least
            30 days notice before changing subscription prices.
          </li>
        </ul>
      </Section>

      <Section title="5. Intellectual property">
        <p>
          You retain full ownership of any code you submit. We make no claim over your input or
          the converted output. The AI Code Translate brand, UI, and underlying platform code remain the
          property of AI Code Translate.
        </p>
      </Section>

      <Section title="6. Limitation of liability">
        <p>
          To the maximum extent permitted by law, AI Code Translate&apos;s total liability to you for any
          claim arising out of or related to these terms or use of the Service shall not exceed the
          greater of (a) the amount you paid us in the 3 months preceding the claim, or (b) $10 USD.
        </p>
      </Section>

      <Section title="7. Changes to these terms">
        <p>
          We may update these terms from time to time. Material changes will be communicated to
          registered users by email at least 14 days before they take effect. Continued use of the
          Service after changes constitutes acceptance.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions about these terms?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-border pt-8">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  )
}
