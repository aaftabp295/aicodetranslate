@AGENTS.md
# Project Context — AI Code Converter

## What We Are Building
A programmatic SEO-optimized code converter web app that converts code
from one programming language to another using the Gemini AI API.
Each language pair has its own dedicated page (e.g. /convert/python-to-javascript).
Primary goal: rank #1 on Bing (and Google) for every language conversion query.
Secondary goal: monetize via freemium subscriptions using Dodo Payments.

---

## Tech Stack

### Core
- Framework: Next.js (App Router, TypeScript)
- Hosting: Cloudflare Pages + Cloudflare Workers (edge runtime)
- Package Manager: npm

### UI & Styling
- Component Library: shadcn/ui (CLI v4 — npx shadcn@latest)
- Styling: Tailwind CSS v4
- Icons: Lucide React (bundled with shadcn)
- Code Highlighting: Shiki
- Fonts: Geist Sans (headings) + Geist Mono (code panels)
- Animations: tailwindcss-animate (included with shadcn)
- Theme: Anthropic-inspired (see Color System below)
- Dark mode: next-themes

### Data & Auth
- Database: Supabase (Postgres)
- Auth: Supabase Auth (Google OAuth + magic link email)
- Rate Limiting: Upstash Redis
- File Storage: Supabase Storage

### AI
- Model: Google Gemini Flash (gemini-3.1-flash-lite)
- Strategy: Two-pass conversion (convert then review)
- Optional third pass: explanation feature

### Payments
- Provider: Dodo Payments (Merchant of Record, India-friendly, INR payouts) - *Status: COMING SOON*
- Plans: Free (5/day with account, 2/day without) | Pro $7/mo | Pro Annual $49/yr (Pro plans disabled / mapped to Free limits for now)

### SEO & Discovery
- Sitemap: next-sitemap
- Fast Indexing: IndexNow (Bing)
- i18n: next-intl (add later for SEO multiplier)
- Schema: JSON-LD (SoftwareApplication + FAQPage)
- Analytics: Cloudflare Web Analytics
- Error Monitoring: Sentry (free tier)

### Infrastructure
- Domain + CDN: Cloudflare Registrar + Pages
- DNS: Cloudflare

---

## Color System — Anthropic-Inspired Theme

Apply exactly in app/globals.css:

```css
@layer base {
  :root {
    --background: 40 33% 97%;
    --foreground: 60 5% 8%;
    --card: 40 33% 97%;
    --card-foreground: 60 5% 8%;
    --popover: 40 33% 97%;
    --popover-foreground: 60 5% 8%;
    --primary: 18 65% 59%;
    --primary-foreground: 40 33% 97%;
    --secondary: 45 13% 69%;
    --secondary-foreground: 60 5% 8%;
    --muted: 40 20% 90%;
    --muted-foreground: 45 8% 44%;
    --accent: 18 65% 59%;
    --accent-foreground: 40 33% 97%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 40 33% 97%;
    --border: 40 20% 88%;
    --input: 40 20% 88%;
    --ring: 18 65% 59%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 60 5% 8%;
    --foreground: 40 33% 97%;
    --card: 60 5% 11%;
    --card-foreground: 40 33% 97%;
    --popover: 60 5% 11%;
    --popover-foreground: 40 33% 97%;
    --primary: 18 65% 59%;
    --primary-foreground: 60 5% 8%;
    --secondary: 45 8% 25%;
    --secondary-foreground: 40 33% 97%;
    --muted: 60 5% 16%;
    --muted-foreground: 45 8% 60%;
    --accent: 18 65% 59%;
    --accent-foreground: 60 5% 8%;
    --destructive: 0 62% 50%;
    --destructive-foreground: 40 33% 97%;
    --border: 60 5% 18%;
    --input: 60 5% 18%;
    --ring: 18 65% 59%;
  }
}
```

### Anthropic Hex Reference
- Dark: #141413
- Light/Background: #faf9f5
- Mid Gray: #b0aea5
- Light Gray: #e8e6dc
- Coral/Orange (Primary): #d97757
- Text on coral: #faf9f5

---

## shadcn/ui Components to Install
button, card, badge, tabs, select, dropdown-menu, dialog, sheet,
separator, skeleton, tooltip, progress, avatar, navigation-menu, sonner

---

## Critical Technical Constraints
- All API routes MUST use: export const runtime = 'edge'
- NEVER use Node.js built-ins (fs, path, crypto) in API routes
- NEVER put secrets in NEXT_PUBLIC_ env variables
- Gemini API key is server-side only, never in client code
- All Supabase tables MUST have Row Level Security (RLS) enabled
- Always verify auth via supabase.auth.getUser() server-side
- Never trust client-sent isPro, userId, or plan values
- NEVER log or store user's actual code content

---

## Environment Variables

GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
DODO_PAYMENTS_API_KEY=
DODO_WEBHOOK_SECRET=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_APP_URL=https://yoursite.com


---

## Business Model — Freemium
- Free tier: 5 conversions/day (logged in) | 2 conversions/day (guest)
- Guest (no account): track by IP in Upstash Redis
  using `@upstash/ratelimit` SDK (prefix: `ratelimit:guest`, 2 conversions/24 hours sliding window)
- Free account: track by user_id in Upstash Redis
  using `@upstash/ratelimit` SDK (prefix: `ratelimit:free`, 5 conversions/24 hours sliding window)
- Pro account: cap at 500/day (abuse prevention) - *Status: COMING SOON (currently mapped to Free 5/day limit)*
- Payment: Dodo Payments (MoR — handles VAT, GST, tax globally) - *Status: COMING SOON*
- INR payouts direct to Indian bank account

---

## Database Schema (Supabase Postgres)
```sql
create table conversions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  from_lang text not null,
  to_lang text not null,
  char_count integer,
  used_explain boolean default false,
  created_at timestamptz default now()
);

create table subscriptions (
  user_id uuid references auth.users primary key,
  plan text default 'free' check (plan in ('free', 'pro')),
  dodo_customer_id text,
  dodo_subscription_id text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table conversions enable row level security;
alter table subscriptions enable row level security;

create policy "users_own_conversions" on conversions
  for all using (auth.uid() = user_id);

create policy "users_own_subscription" on subscriptions
  for all using (auth.uid() = user_id);
```

---

## Routing Structure

/                              Homepage — hero + ConverterPanel + LanguageFromGrid
/converters                    All 18 source languages index page
/convert-from-[language]       e.g. /convert-from-python (18 pages)
Rewritten to `/convert-from/[language]` in `next.config.ts` (Note: duplicate `convert-from-[language]` folder exists in code but `convert-from/[language]` is the primary dynamic route)
/convert/[pair]                e.g. /convert/python-to-javascript (306 pages)
Rewritten from `/convert-[pair]` in `next.config.ts`
/pricing                       Pricing page
/dashboard                     User history (protected)
/login                         Auth page

/api/convert                   Main conversion endpoint (edge)
/api/explain                   Explanation endpoint (edge)
/api/highlight                 Highlight code syntax on the server (edge)
/api/quota                     Current user daily usage & limit (edge)
/api/webhooks/dodo             Dodo Payments webhook (edge) - *Status: PENDING*
/api/og                        Dynamic OG image generation (edge) - *Status: PENDING*


## User Navigation Flow

Homepage (/)
→ Click "Python" card
→ /convert-from-python
→ Click "JavaScript" target button
→ /convert/python-to-javascript
→ Converter is pre-loaded and ready

Total indexed pages: 1 + 1 + 18 + 306 = 326 pages


---

## Language Pairs
```typescript
export const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'c',
  'cpp', 'csharp', 'go', 'rust', 'php', 'ruby',
  'swift', 'kotlin', 'scala', 'r', 'bash', 'sql', 'dart'
] as const

export const LANGUAGE_DISPLAY: Record<string, string> = {
  python: 'Python', javascript: 'JavaScript', typescript: 'TypeScript',
  java: 'Java', c: 'C', cpp: 'C++', csharp: 'C#', go: 'Go',
  rust: 'Rust', php: 'PHP', ruby: 'Ruby', swift: 'Swift',
  kotlin: 'Kotlin', scala: 'Scala', r: 'R', bash: 'Bash',
  sql: 'SQL', dart: 'Dart'
}

// 18 languages = 18 × 17 = 306 conversion pages
export const PAIRS = LANGUAGES.flatMap(from =>
  LANGUAGES.filter(to => to !== from).map(to => ({ from, to }))
)
```

---

## Gemini Prompts (Use Exactly As Written)

### System Prompt — Convert

You are an expert polyglot software engineer with 20+ years of production
experience in every major programming language. Your specialty is translating
code between languages in a way that feels completely native to the target
language — not a mechanical translation.

RULES:


Preserve 100% of the original logic and behavior
Use idiomatic patterns and conventions of the TARGET language
Use modern, widely-accepted syntax of the target language
Replace source-language constructs with natural target equivalents
Use the target language's standard library wherever applicable
Follow naming conventions strictly (snake_case, camelCase, PascalCase per lang)
Add all required import/include statements
Translate comments to the target language
Add brief comments ONLY where translation decision is non-obvious
Never add boilerplate the original did not have


OUTPUT: Return ONLY raw code. No markdown fences. No explanations.
No preamble. Just the converted code ready to copy-paste.


### User Message — Convert

Convert the following {fromLang} code to {toLang}.

STARTCODE
{userCode}
ENDCODE


### System Prompt — Review Pass

You are a senior {toLang} engineer doing a code review.

Review this {toLang} code converted from {fromLang}. Fix any issues:


Non-idiomatic patterns that feel like they came from {fromLang}
Missing error handling a {toLang} developer would add
Standard library functions that should replace manual implementations
Naming convention violations
Obvious bugs from translation


Return ONLY corrected code. No explanations. If already perfect, return unchanged.


### User Message — Explain

A developer converted {fromLang} to {toLang}.

ORIGINAL ({fromLang}):
{originalCode}

CONVERTED ({toLang}):
{convertedCode}

Write bullet points explaining the most important translation decisions.
Focus on: language-specific pattern changes, behavioral differences,
assumptions made. Under 150 words. Be specific.


---

## Security Checklist
1. Rate limit every /api/convert call via Upstash before calling Gemini
2. Validate input max 10,000 characters before any processing
3. Wrap user code in STARTCODE/ENDCODE delimiters in all prompts
4. Verify Dodo webhook signature on every webhook request
5. CORS: only allow requests from NEXT_PUBLIC_APP_URL
6. Never log actual code content — metadata only
7. Auth: always use server-side getUser(), never trust client data
8. All Supabase tables: RLS enabled

---

## SEO — Per-Page Metadata Template

title: "{From} to {To} Converter – Free Online AI Code Converter"
description: "Convert {From} code to {To} instantly using AI.
Free online tool with idiomatic output. No signup required."
h1: "Convert {From} to {To} Online"
First paragraph: naturally include "{from} to {to} converter" exact phrase


---

## Analytics Events to Track
- conversion_started: { from, to }
- conversion_completed: { from, to, char_count, used_explain }
- conversion_failed: { from, to, error_type }
- limit_hit: { user_type: 'guest' | 'free' }
- upgrade_clicked: { source: 'limit_banner' | 'pricing' }
- subscription_created: { plan: 'monthly' | 'annual' }

---

## UI Component Map
- Navbar → shadcn NavigationMenu + ThemeToggle button
- Language selectors → shadcn Select
- Convert button → shadcn Button variant="default" (coral)
- Output panel → Shiki rendered HTML (github-light / github-dark themes)
- Copy button → shadcn Button variant="ghost" + clipboard API
- Usage counter → shadcn Progress + Badge
- Upgrade prompt → shadcn Dialog
- Auth panel → shadcn Sheet (slide-in)
- Toasts → Sonner
- Loading state → shadcn Skeleton
- Pricing cards → shadcn Card + Badge for "Popular" label

---

## What NOT To Do
- Do NOT use Vercel for hosting (use Cloudflare Pages)
- Do NOT use Node.js runtime in API routes (edge only)
- Do NOT use NEXT_PUBLIC_ prefix on any secret key
- Do NOT use localStorage anywhere
- Do NOT log or store user's actual code content
- Do NOT trust isPro or plan values sent from client
- Do NOT call Gemini without validating input size first
- Do NOT skip RLS on any Supabase table
- Do NOT use old shadcn Toast component — use Sonner instead
- Do NOT use PlanetScale (discontinued free tier)