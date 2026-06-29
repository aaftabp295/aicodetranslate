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

export interface PairContent {
  intro: string
  diffs: DiffRow[]
  examples: CodeExample[]
  tips: MigrationTip[]
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
