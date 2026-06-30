import fs from 'fs'
import path from 'path'

export interface DiffRow {
  category: string
  from: string
  to: string
}

export interface CodeExample {
  title: string
  description: string
  fromCode: string
  toCode: string
}

export interface MigrationTip {
  title: string
  body: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface PairContent {
  intro: string
  diffs: DiffRow[]
  examples: CodeExample[]
  tips: MigrationTip[]
  faqs?: FaqItem[]
}

/** Returns the dynamic default FAQ items for a language pair. */
export function getDefaultFaqs(fromDisplay: string, toDisplay: string): FaqItem[] {
  return [
    {
      question: `Is this ${fromDisplay} to ${toDisplay} converter free?`,
      answer: `Yes! Our ${fromDisplay} to ${toDisplay} converter is completely free to use. You can run up to 5 conversions per day without even needing to create an account. For unlimited conversions, you can choose one of our affordable premium subscriptions.`
    },
    {
      question: `How accurate is the ${fromDisplay} to ${toDisplay} conversion?`,
      answer: `The conversion is powered by Gemini, Google's advanced language model. It produces highly accurate, idiomatic, and syntactically valid code by mapping corresponding libraries, types, and logic constructs between the two languages.`
    },
    {
      question: `What types of ${fromDisplay} code can I convert to ${toDisplay}?`,
      answer: `You can convert any standard ${fromDisplay} code, including individual helper functions, complex classes, standard algorithms, data structure operations, and business logic. The converter handles scoping, syntax, and keyword translations automatically.`
    }
  ]
}


/** Helper to read a pair file from disk. */
function readPairFile(from: string, to: string): PairContent | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pairs', `${from}-${to}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(raw)
    }
  } catch (error) {
    console.error(`Error reading pair file for ${from}-${to}:`, error)
  }
  return null
}

/** Returns unique rich content for a language pair, or null if not available. */
export function getPairContent(from: string, to: string): PairContent | null {
  return readPairFile(from, to)
}

/** Returns unique intro paragraph for a language pair, or null if not available. */
export function getPairIntro(from: string, to: string): string | null {
  return readPairFile(from, to)?.intro ?? null
}
