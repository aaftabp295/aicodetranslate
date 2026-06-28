import * as React from 'react'
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiC,
  SiCplusplus,
  SiDotnet,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiScala,
  SiR,
  SiGnubash,
  SiDart,
} from 'react-icons/si'
import { DiJava } from 'react-icons/di'
import { Database } from 'lucide-react'
import { Language } from '@/lib/languages'

// Brand hex colors for each programming language
export const LANGUAGE_COLORS: Record<Language, string> = {
  python: '#3776AB',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  java: '#007396',
  c: '#A8B9CC',
  cpp: '#00599C',
  csharp: '#512BD4',
  go: '#00ADD8',
  rust: '#E05D44',
  php: '#777BB4',
  ruby: '#CC342D',
  swift: '#F05138',
  kotlin: '#7F52FF',
  scala: '#DC322F',
  r: '#276DC3',
  bash: '#4EAA25',
  sql: '#4479A1',
  dart: '#00B4AB',
}

interface LanguageIconProps {
  lang: Language
  size?: number | string
  className?: string
  useBrandColor?: boolean
}

export function LanguageIcon({
  lang,
  size = 20,
  className,
  useBrandColor = false,
}: LanguageIconProps) {
  const style = useBrandColor ? { color: LANGUAGE_COLORS[lang] } : undefined

  switch (lang) {
    case 'python':
      return <SiPython size={size} className={className} style={style} />
    case 'javascript':
      return <SiJavascript size={size} className={className} style={style} />
    case 'typescript':
      return <SiTypescript size={size} className={className} style={style} />
    case 'java':
      return <DiJava size={size} className={className} style={style} />
    case 'c':
      return <SiC size={size} className={className} style={style} />
    case 'cpp':
      return <SiCplusplus size={size} className={className} style={style} />
    case 'csharp':
      return <SiDotnet size={size} className={className} style={style} />
    case 'go':
      return <SiGo size={size} className={className} style={style} />
    case 'rust':
      return <SiRust size={size} className={className} style={style} />
    case 'php':
      return <SiPhp size={size} className={className} style={style} />
    case 'ruby':
      return <SiRuby size={size} className={className} style={style} />
    case 'swift':
      return <SiSwift size={size} className={className} style={style} />
    case 'kotlin':
      return <SiKotlin size={size} className={className} style={style} />
    case 'scala':
      return <SiScala size={size} className={className} style={style} />
    case 'r':
      return <SiR size={size} className={className} style={style} />
    case 'bash':
      return <SiGnubash size={size} className={className} style={style} />
    case 'sql':
      return <Database size={size} className={className} style={style} />
    case 'dart':
      return <SiDart size={size} className={className} style={style} />
    default:
      return null
  }
}
