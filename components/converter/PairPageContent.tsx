import { ArrowRight } from 'lucide-react'
import { LanguageIcon } from '@/components/converter/LanguageIcon'
import { getPairContent } from '@/lib/pairContent'
import type { Language } from '@/lib/languages'

interface Props {
  from: Language
  to: Language
  fromDisplay: string
  toDisplay: string
}

export function PairPageContent({ from, to, fromDisplay, toDisplay }: Props) {
  const content = getPairContent(from, to)
  if (!content) return null

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-16 pb-6">

      {/* ── 1. Key Differences ─────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {fromDisplay} vs {toDisplay}: Key Differences
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Understanding these differences explains what the converter changes — and why certain idioms look different in the output.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[150px_1fr_1fr] bg-muted/60 border-b border-border">
            <div className="px-4 py-3 border-r border-border" />
            <div className="px-4 py-3 flex items-center gap-2 border-r border-border">
              <LanguageIcon lang={from} size={14} useBrandColor />
              <span className="text-xs font-bold text-foreground">{fromDisplay}</span>
            </div>
            <div className="px-4 py-3 flex items-center gap-2">
              <LanguageIcon lang={to} size={14} useBrandColor />
              <span className="text-xs font-bold text-foreground">{toDisplay}</span>
            </div>
          </div>

          {/* Diff rows */}
          {content.diffs.map((diff, i) => (
            <div
              key={diff.category}
              className={`grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[150px_1fr_1fr] border-t border-border ${
                i % 2 === 1 ? 'bg-muted/20' : 'bg-background'
              }`}
            >
              <div className="px-4 py-3.5 text-[11px] font-semibold text-foreground border-r border-border flex items-start">
                {diff.category}
              </div>
              <div className="px-4 py-3.5 text-[11px] text-muted-foreground leading-relaxed border-r border-border">
                {diff.from}
              </div>
              <div className="px-4 py-3.5 text-[11px] text-muted-foreground leading-relaxed">
                {diff.to}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Code Examples ───────────────────────────────────────────── */}
      <section className="space-y-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Conversion Examples</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real {fromDisplay} snippets converted to idiomatic {toDisplay} — note how structure, naming conventions, and library calls shift.
          </p>
        </div>

        {content.examples.map((ex, i) => (
          <div key={i} className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Example {i + 1} — {ex.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{ex.description}</p>
            </div>

            <div className="grid md:grid-cols-[1fr_28px_1fr] gap-2 items-start">
              {/* From */}
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                  <LanguageIcon lang={from} size={12} useBrandColor />
                  <span className="text-[11px] font-semibold text-foreground">{fromDisplay}</span>
                </div>
                <pre className="p-4 text-[11px] leading-[1.7] bg-[#0d1117] text-[#c9d1d9] overflow-x-auto font-mono whitespace-pre">
                  <code>{ex.fromCode}</code>
                </pre>
              </div>

              {/* Arrow (desktop) */}
              <div className="hidden md:flex items-center justify-center" style={{ paddingTop: '36px' }}>
                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              </div>

              {/* To */}
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                  <LanguageIcon lang={to} size={12} useBrandColor />
                  <span className="text-[11px] font-semibold text-foreground">{toDisplay}</span>
                </div>
                <pre className="p-4 text-[11px] leading-[1.7] bg-[#0d1117] text-[#c9d1d9] overflow-x-auto font-mono whitespace-pre">
                  <code>{ex.toCode}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── 3. Migration Tips ──────────────────────────────────────────── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Migration Tips: {fromDisplay} → {toDisplay}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Specific patterns to watch for when porting a {fromDisplay} codebase to {toDisplay}.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {content.tips.map((tip, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border bg-card flex gap-3 hover:border-primary/40 transition-colors duration-200"
            >
              <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-tight">{tip.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
