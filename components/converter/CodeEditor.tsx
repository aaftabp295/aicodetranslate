'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
// Use the light-weight Prism-based highlighter (not the full highlight.js build)
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light'

// Register only the languages we need (keeps bundle small)
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin'
import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala'
import r from 'react-syntax-highlighter/dist/esm/languages/prism/r'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart'

// GitHub-inspired themes (inline styles, zero CSS-class dependency)
import {
  oneLight,
  oneDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('php', php)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('swift', swift)
SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('scala', scala)
SyntaxHighlighter.registerLanguage('r', r)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('dart', dart)

// Our app slugs already match the registered language keys above
const LANG_MAP: Record<string, string> = {
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

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  placeholder?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  onKeyDown,
}: CodeEditorProps) {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme } = useTheme()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const highlightRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const lang = LANG_MAP[language] ?? 'javascript'
  const theme = resolvedTheme === 'dark' ? oneDark : oneLight

  // Sync scroll between the hidden textarea and the visible highlight layer
  const handleScroll = () => {
    const ta = textareaRef.current
    const hl = highlightRef.current?.querySelector('pre')
    if (ta && hl) {
      hl.scrollTop = ta.scrollTop
      hl.scrollLeft = ta.scrollLeft
    }
  }

  // Handle advanced coding editor hotkeys
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const start = target.selectionStart
    const end = target.selectionEnd
    const currentValue = target.value

    // 1. Tab Key: Insert 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const indent = '  '
      const newValue = currentValue.substring(0, start) + indent + currentValue.substring(end)
      onChange(newValue)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + indent.length
      }, 0)
      return
    }

    // 2. Backspace Key: Delete matching pairs if cursor is inside them
    if (e.key === 'Backspace') {
      if (start === end && start > 0) {
        const charBefore = currentValue[start - 1]
        const charAfter = currentValue[start]
        const isPair =
          (charBefore === '(' && charAfter === ')') ||
          (charBefore === '[' && charAfter === ']') ||
          (charBefore === '{' && charAfter === '}') ||
          (charBefore === '"' && charAfter === '"') ||
          (charBefore === "'" && charAfter === "'") ||
          (charBefore === '`' && charAfter === '`')

        if (isPair) {
          e.preventDefault()
          const newValue = currentValue.substring(0, start - 1) + currentValue.substring(start + 1)
          onChange(newValue)
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start - 1
          }, 0)
          return
        }
      }
    }

    // 3. Enter Key: Keep indentation and optionally indent further on colons or braces
    if (e.key === 'Enter') {
      e.preventDefault()
      const beforeCursor = currentValue.substring(0, start)
      const afterCursor = currentValue.substring(end)
      const lines = beforeCursor.split('\n')
      const currentLine = lines[lines.length - 1]
      const match = currentLine.match(/^([ \t]*)/)
      const leadingWhitespace = match ? match[1] : ''

      let extraIndent = ''
      if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{') || currentLine.trim().endsWith('(') || currentLine.trim().endsWith('[')) {
        extraIndent = '  '
      }

      // Special case: Hitting enter inside matching braces {} or brackets [] or parentheses ()
      const charBefore = currentValue[start - 1]
      const charAfter = currentValue[start]
      const isBraceSplit = 
        (charBefore === '{' && charAfter === '}') || 
        (charBefore === '[' && charAfter === ']') ||
        (charBefore === '(' && charAfter === ')')

      if (isBraceSplit) {
        const indentLine = '\n' + leadingWhitespace + '  '
        const closingLine = '\n' + leadingWhitespace
        const newValue = beforeCursor + indentLine + closingLine + afterCursor
        onChange(newValue)
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + indentLine.length
        }, 0)
        return
      }

      const indentToInsert = '\n' + leadingWhitespace + extraIndent
      const newValue = beforeCursor + indentToInsert + afterCursor
      onChange(newValue)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + indentToInsert.length
      }, 0)
      return
    }

    // 4. Auto-closing quotation marks, brackets, and braces
    const pairs: Record<string, string> = {
      '{': '}',
      '[': ']',
      '(': ')',
      '"': '"',
      "'": "'",
      '`': '`',
    }

    if (pairs[e.key] !== undefined) {
      e.preventDefault()
      const openChar = e.key
      const closeChar = pairs[openChar]

      // If text is selected, wrap the selection in the matching pairs
      if (start !== end) {
        const selectedText = currentValue.substring(start, end)
        const newValue = currentValue.substring(0, start) + openChar + selectedText + closeChar + currentValue.substring(end)
        onChange(newValue)
        setTimeout(() => {
          target.selectionStart = start + 1
          target.selectionEnd = end + 1
        }, 0)
      } else {
        // If no text is selected, check if user is typing a closing char that is already right after the cursor
        if (openChar === closeChar && currentValue[start] === closeChar) {
          // Just skip over the closing character
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 1
          }, 0)
        } else {
          // Insert matching pair
          const newValue = currentValue.substring(0, start) + openChar + closeChar + currentValue.substring(end)
          onChange(newValue)
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 1
          }, 0)
        }
      }
      return
    }

    // 5. Skip over closing characters if typed directly
    const closingChars = new Set(['}', ']', ')'])
    if (closingChars.has(e.key)) {
      if (start === end && currentValue[start] === e.key) {
        e.preventDefault()
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 1
        }, 0)
        return
      }
    }

    // Forward to any custom onKeyDown logic passed by parent
    if (onKeyDown) {
      onKeyDown(e);
    }
  }

  if (!mounted) {
    return (
      <div className="relative flex-1 min-h-[400px] font-mono text-sm leading-relaxed">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full p-6 font-mono text-sm leading-relaxed bg-transparent resize-none border-0 outline-none focus:outline-none focus:ring-0 text-foreground"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    )
  }

  return (
    <div className="relative flex-1 w-full h-full min-h-[400px] font-mono text-sm leading-relaxed">
      {/* ── Highlight layer ── */}
      <div
        ref={highlightRef}
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <SyntaxHighlighter
          language={lang}
          style={theme}
          customStyle={{
            margin: 0,
            padding: '1.5rem',          // matches textarea p-6 (24px)
            background: 'transparent',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
          codeTagProps={{
            style: { 
              fontFamily: 'inherit', 
              fontSize: 'inherit',
              lineHeight: 'inherit',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            },
          }}
        >
          {/* Must always have at least one char so the pre doesn't collapse */}
          {value || ' '}
        </SyntaxHighlighter>
      </div>

      {/* ── Transparent textarea (user input) ── */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDownInternal}
        onScroll={handleScroll}
        placeholder={placeholder}
        // Force caret color to stand out depending on light/dark mode
        style={{ caretColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000' }}
        className="absolute inset-0 w-full h-full p-6 font-mono text-sm leading-relaxed bg-transparent resize-none border-0 outline-none focus:outline-none focus:ring-0 text-transparent whitespace-pre-wrap break-all overflow-y-auto no-scrollbar"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  )
}
