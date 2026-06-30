import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – AI Code Translate',
  description:
    'Privacy policy for AI Code Translate. Learn what data we collect, what we never store, and how your information is handled.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'}/privacy`,
  },
}

const CONTACT_EMAIL = 'hello@aicodetranslate.com'
const EFFECTIVE_DATE = 'June 29, 2025'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This Privacy Policy explains what information AI Code Translate collects, how it is used, and
          what choices you have. We believe in radical transparency — especially about data.
        </p>
      </div>

      <Section title="1. What we collect">
        <p>We collect the minimum data needed to operate the service:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong className="text-foreground">Email address</strong> — only if you create an
            account. Used for authentication, account management, and transactional emails (e.g.
            subscription receipts).
          </li>
          <li>
            <strong className="text-foreground">Conversion metadata</strong> — source language,
            target language, timestamp, and character count per conversion. This is used solely to
            enforce daily usage quotas.
          </li>
          <li>
            <strong className="text-foreground">Payment data</strong> — if you subscribe to a paid
            plan, payment is processed by a third-party provider (e.g. Stripe). We do not store
            card numbers or payment details.
          </li>
        </ul>
      </Section>

      <Section title="2. What we never collect">
        <p>
          <strong className="text-foreground">We never store, log, or retain the actual code
          you submit.</strong> The code you paste into the editor is sent to the Gemini API for
          conversion and is not persisted anywhere in our infrastructure. We have no access to
          your source code after the conversion response is returned.
        </p>
      </Section>

      <Section title="3. How data is stored">
        <p>
          User accounts, quota counters, and subscription records are stored in{' '}
          <strong className="text-foreground">Supabase</strong>, a managed PostgreSQL database
          platform. Supabase encrypts data at rest and in transit. You can read their security
          practices at{' '}
          <a
            href="https://supabase.com/security"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            supabase.com/security
          </a>
          .
        </p>
        <p className="mt-2">
          We do not sell, rent, or share your personal information with third parties for marketing
          purposes.
        </p>
      </Section>

      <Section title="4. Cookies">
        <p>We use a minimal set of cookies:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>
            <strong className="text-foreground">Authentication cookie</strong> — set by Supabase
            Auth when you log in. Required for the session to function. Expires when you log out or
            after 7 days of inactivity.
          </li>
          <li>
            <strong className="text-foreground">No analytics or advertising cookies.</strong> We do
            not use Google Analytics, Facebook Pixel, or any third-party ad tracking.
          </li>
        </ul>
      </Section>

      <Section title="5. Third-party services">
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong className="text-foreground">Google Gemini API</strong> — processes your code
            conversion requests. Subject to{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:opacity-80"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong className="text-foreground">Supabase</strong> — user data storage and
            authentication.
          </li>
          <li>
            <strong className="text-foreground">Cloudflare</strong> — CDN, DDoS protection, and
            edge delivery. Subject to Cloudflare&apos;s privacy policy.
          </li>
        </ul>
      </Section>

      <Section title="6. Your rights">
        <p>
          You may request deletion of your account and all associated data at any time by emailing{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            {CONTACT_EMAIL}
          </a>
          . We will process deletion requests within 30 days.
        </p>
      </Section>

      <Section title="7. Changes to this policy">
        <p>
          We may update this policy occasionally. Material changes will be communicated via email
          to registered users. Continued use of AI Code Translate after changes constitutes acceptance
          of the updated policy.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions about this policy?{' '}
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
