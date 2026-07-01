import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'),
  title: {
    default: 'CodeConvert — Free AI Code Converter',
    template: '%s | CodeConvert'
  },
  description: 'Convert code between Python, JavaScript, TypeScript, Java, Go, Rust and 14 more languages instantly using AI. Free online tool.',
  keywords: ['code converter', 'AI code converter', 'python to javascript', 'code translation', 'programming language converter'],
  authors: [{ name: 'CodeConvert' }],
  openGraph: {
    type: 'website',
    siteName: 'CodeConvert',
    title: 'CodeConvert — Free AI Code Converter',
    description: 'Convert code between 18 programming languages instantly using AI.',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeConvert — Free AI Code Converter',
    description: 'Convert code between 18 programming languages instantly using AI.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CodeConvert',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicodetranslate.com'}/converters?q={search_term_string}` },
    'query-input': 'required name=search_term_string'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
