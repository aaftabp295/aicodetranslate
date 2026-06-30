export const LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'r',
  'bash',
  'sql',
  'dart',
] as const

export type Language = typeof LANGUAGES[number]

export const LANGUAGE_DISPLAY: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  scala: 'Scala',
  r: 'R',
  bash: 'Bash',
  sql: 'SQL',
  dart: 'Dart',
}

// Generate all combinations where from !== to
export const PAIRS: Array<{ from: Language; to: Language }> = LANGUAGES.flatMap(from =>
  LANGUAGES.filter(to => to !== from).map(to => ({ from, to }))
)

/**
 * Returns the display name for a language slug, with fallback to capitalization.
 */
export function getLangDisplayName(slug: string): string {
  if (LANGUAGES.includes(slug as Language)) {
    return LANGUAGE_DISPLAY[slug as Language]
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

/**
 * Parses a pair slug (e.g. "python-to-javascript") and returns the validated from/to languages.
 */
export function getPairFromSlug(slug: string): { from: Language; to: Language } | null {
  const parts = slug.split('-to-')
  if (parts.length !== 2) return null

  const [from, to] = parts
  const isValidLang = (lang: string): lang is Language => {
    return LANGUAGES.includes(lang as Language)
  }

  if (isValidLang(from) && isValidLang(to)) {
    return { from, to }
  }

  return null
}

/**
 * Returns the SEO title for the language pair converter page.
 */
export function getPageTitle(from: string, to: string): string {
  const fromDisplay = getLangDisplayName(from)
  const toDisplay = getLangDisplayName(to)
  return `Convert ${fromDisplay} to ${toDisplay} Online – Free AI Code Translate`
}

/**
 * Returns the SEO description for the language pair converter page.
 */
export function getPageDescription(from: string, to: string): string {
  const fromDisplay = getLangDisplayName(from)
  const toDisplay = getLangDisplayName(to)
  return `Convert ${fromDisplay} code to ${toDisplay} instantly using AI. Free online tool with idiomatic output. No signup required.`
}

/**
 * Returns the SEO title for the convert-from-X code page.
 */
export function getFromPageTitle(from: string): string {
  const fromDisplay = getLangDisplayName(from)
  return `Convert ${fromDisplay} Code Online — Choose Target Language`
}

/**
 * Returns the SEO description for the convert-from-X code page.
 */
export function getFromPageDescription(from: string): string {
  const fromDisplay = getLangDisplayName(from)
  return `Convert ${fromDisplay} code to JavaScript, TypeScript, Python, Java and 14 more languages instantly using AI. Free online tool. No signup required.`
}

/**
 * Returns the 6 most popular target languages for a given source language.
 */
export function getPopularTargetsFor(from: string): Language[] {
  const popular: Record<string, Language[]> = {
    python: ['javascript', 'typescript', 'java', 'go', 'rust', 'cpp'],
    javascript: ['typescript', 'python', 'java', 'go', 'rust', 'csharp'],
    typescript: ['javascript', 'python', 'java', 'go', 'rust', 'csharp'],
    java: ['python', 'javascript', 'typescript', 'kotlin', 'go', 'csharp'],
    cpp: ['python', 'javascript', 'java', 'go', 'rust', 'csharp'],
    csharp: ['python', 'javascript', 'java', 'typescript', 'go', 'cpp'],
    go: ['python', 'javascript', 'typescript', 'java', 'rust', 'cpp'],
    rust: ['python', 'javascript', 'typescript', 'go', 'java', 'cpp'],
  }

  if (from in popular) {
    return popular[from]
  }

  // Fallback: first 6 from LANGUAGES excluding itself
  return LANGUAGES.filter((lang) => lang !== from).slice(0, 6) as Language[]
}
