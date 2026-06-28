import { codeToHtml } from 'shiki'

export const SHIKI_LANG_MAPPING: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  r: 'r',
  bash: 'bash',
  sql: 'sql',
  dart: 'dart',
}

/**
 * Highlights a block of code using Shiki with dual themes for light and dark modes.
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const shikiLang = SHIKI_LANG_MAPPING[lang] || 'text'
  return codeToHtml(code, {
    lang: shikiLang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    cssVariablePrefix: '--shiki-',
  })
}
