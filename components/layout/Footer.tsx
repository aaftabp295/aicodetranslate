import Link from 'next/link'
import { Code2 } from 'lucide-react'

export function Footer() {
  const popularConversions = [
    { label: 'Python to JavaScript', href: '/convert-python-to-javascript' },
    { label: 'JavaScript to TypeScript', href: '/convert-javascript-to-typescript' },
    { label: 'Java to Python', href: '/convert-java-to-python' },
    { label: 'Python to Go', href: '/convert-python-to-go' },
    { label: 'JavaScript to Python', href: '/convert-javascript-to-python' },
    { label: 'TypeScript to JavaScript', href: '/convert-typescript-to-javascript' },
    { label: 'Python to Rust', href: '/convert-python-to-rust' },
    { label: 'Java to JavaScript', href: '/convert-java-to-javascript' },
  ]

  const productLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Converters', href: '/converters' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Free Converter', href: '/free-code-converter' },
  ]

  const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-sans text-lg font-bold tracking-tight text-foreground">
                AI Code Translate
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Convert code between languages instantly using AI. Fast, accurate, and completely free to try.
            </p>
          </div>

          {/* Column 2: Popular Conversions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Popular Conversions
            </h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              {popularConversions.map((conv) => (
                <li key={conv.href}>
                  <Link href={conv.href} className="hover:text-primary transition-colors">
                    {conv.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Links
            </h3>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-12 sm:space-y-0 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground text-xs uppercase tracking-tight opacity-80">Product</p>
                <ul className="space-y-2">
                  {productLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground text-xs uppercase tracking-tight opacity-80">Company</p>
                <ul className="space-y-2">
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-center space-x-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  </li>
                  <li className="opacity-60 cursor-not-allowed">
                    <span>Blog (coming soon)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 AI Code Translate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
          <p>Built with Next.js and Gemini AI</p>
        </div>
      </div>
    </footer>
  )
}
