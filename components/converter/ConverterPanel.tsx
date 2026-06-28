'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Loader2, Copy, Check, ArrowLeftRight, Sparkles, BookOpen, AlertTriangle, Maximize2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { LANGUAGES, LANGUAGE_DISPLAY } from '@/lib/languages'
import { cn } from '@/lib/utils'
import { CodeEditor } from '@/components/converter/CodeEditor'

interface ConverterPanelProps {
  defaultFrom?: string
  defaultTo?: string
}

export function ConverterPanel({
  defaultFrom = 'python',
  defaultTo = 'javascript',
}: ConverterPanelProps) {
  // Inputs & Langs State
  const [code, setCode] = React.useState('')
  const [convertedCode, setConvertedCode] = React.useState('')
  const [fromLang, setFromLang] = React.useState(defaultFrom)
  const [toLang, setToLang] = React.useState(defaultTo)

  // UI Status State
  const [isLoading, setIsLoading] = React.useState(false)
  const [isExplaining, setIsExplaining] = React.useState(false)
  const [showExplain, setShowExplain] = React.useState(false)
  const [explanation, setExplanation] = React.useState('')
   const [copied, setCopied] = React.useState(false)
  const [highlightedHtml, setHighlightedHtml] = React.useState('')
  const [activeMaximize, setActiveMaximize] = React.useState<'input' | 'output' | null>(null)

  // Rate Limiting & Subs State
  const [remaining, setRemaining] = React.useState<number | null>(null)
  const [limit, setLimit] = React.useState<number>(5)
  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false)

  // Fetch current quota limit and remaining tokens on mount
  React.useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch('/api/quota')
        if (res.ok) {
          const data = await res.json()
          setRemaining(data.remaining)
          setLimit(data.limit)
        } else {
          setRemaining(5)
        }
      } catch (err) {
        console.error('Failed to load quota:', err)
        setRemaining(5)
      }
    }
    fetchQuota()
  }, [])

  // Handle conversion trigger
  const handleConvert = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to convert.')
      return
    }

    if (code.length > 10000) {
      toast.error('Code exceeds 10,000 character limit')
      return
    }

    setIsLoading(true)
    setShowExplain(false)
    setExplanation('')

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, fromLang, toLang }),
      })

      if (response.status === 429) {
        setRemaining(0)
        setShowUpgradeDialog(true)
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Conversion failed. Please try again.')
      }

      const data = await response.json()
      setConvertedCode(data.converted)
      setRemaining(data.remaining)
      setHighlightedHtml(data.highlightedHtml)
      
      toast.success('Code converted successfully!')
    } catch (error: any) {
      console.error('Conversion error:', error)
      toast.error(error?.message || 'Failed to convert code.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle explanation trigger
  const handleExplain = async () => {
    if (!convertedCode) return

    setIsExplaining(true)
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromLang,
          toLang,
          originalCode: code,
          convertedCode,
        }),
      })

      if (response.status === 429) {
        setRemaining(0)
        setShowUpgradeDialog(true)
        setIsExplaining(false)
        return
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate explanation.')
      }

      const data = await response.json()
      setExplanation(data.explanation)
      setShowExplain(true)
      toast.success('Explanation generated!')
    } catch (error: any) {
      console.error('Explanation error:', error)
      toast.error(error?.message || 'Failed to generate explanation.')
    } finally {
      setIsExplaining(false)
    }
  }

  // Swap source and target languages (and swap code values if output exists)
  const handleSwapLanguages = async () => {
    if (fromLang === toLang) return

    const tempLang = fromLang
    setFromLang(toLang)
    setToLang(tempLang)

    if (convertedCode) {
      const tempCode = code
      setCode(convertedCode)
      setConvertedCode(tempCode)

      try {
        const response = await fetch('/api/highlight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: tempCode, lang: tempLang }),
        })
        if (response.ok) {
          const data = await response.json()
          setHighlightedHtml(data.highlightedHtml)
        }
      } catch (err) {
        console.error('Failed to highlight swapped code:', err)
      }
    }
  }

  // Copy converted code to clipboard
  const handleCopy = async () => {
    if (!convertedCode) return
    try {
      await navigator.clipboard.writeText(convertedCode)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Panel: Input */}
        <Card className="flex flex-col h-[540px] border-border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Language</span>
              <Select value={fromLang} onValueChange={(val) => setFromLang(val)}>
                <SelectTrigger className="w-[180px] h-9 border-border bg-background focus:ring-primary">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                      {LANGUAGE_DISPLAY[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapLanguages}
                title="Swap Languages"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveMaximize('input')}
                title="Maximize Editor"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={fromLang}
              placeholder={`Paste your ${LANGUAGE_DISPLAY[fromLang as typeof LANGUAGES[number]] || fromLang} code here...`}
            />
            <div className="px-6 py-3 border-t border-border flex justify-end text-xs shrink-0 bg-muted/10">
              <span className={code.length > 8000 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                {code.length.toLocaleString()}/10,000
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Output */}
        <Card className="flex flex-col h-[540px] border-border bg-card shadow-sm relative">
          <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Language</span>
              <Select value={toLang} onValueChange={(val) => setToLang(val)}>
                <SelectTrigger className="w-[180px] h-9 border-border bg-background focus:ring-primary">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                      {LANGUAGE_DISPLAY[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-1">
              {convertedCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center space-x-1"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveMaximize('output')}
                title="Maximize Editor"
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className={cn(
            "p-0 flex-1 flex flex-col overflow-hidden bg-muted/20 dark:bg-muted/5",
            highlightedHtml || isLoading ? "justify-start" : "justify-center"
          )}>
            {isLoading ? (
              <div className="space-y-4 w-full h-full flex flex-col justify-start p-6">
                <Skeleton className="h-6 w-[200px] bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-5/6 bg-muted" />
              </div>
            ) : highlightedHtml ? (
              <div 
                className="output-highlight w-full flex-1 font-mono text-sm overflow-auto text-left min-h-0 p-6 no-scrollbar"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <div className="text-center space-y-2 py-12 p-6 w-full">
                <p className="text-sm text-muted-foreground">Converted code will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Convert Trigger Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card border border-border p-6 rounded-lg shadow-sm">
        {/* Usage Progress and Quota */}
        <div className="w-full sm:w-auto flex-1 max-w-md space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-muted-foreground">Daily free usage</span>
            <span className="font-semibold text-[11px] text-primary bg-primary/10 dark:bg-primary/20 border border-primary/15 dark:border-primary/25 px-2.5 py-0.5 rounded-full shadow-xs">
              {remaining !== null ? `${remaining} conversions left today` : 'Checking quota...'}
            </span>
          </div>
          <Progress 
            value={remaining !== null ? ((limit - remaining) / limit) * 100 : 0} 
            className="h-1.5 bg-primary/10 dark:bg-primary/20" 
          />
          {remaining === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              You have reached your free daily limit. Upgrade to continue.
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleConvert}
          disabled={isLoading || remaining === 0}
          className="w-full sm:w-[200px] h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Converting...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Convert Code</span>
            </>
          )}
        </Button>
      </div>

      {/* Explanation Section */}
      {convertedCode && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleExplain}
              disabled={isExplaining}
              className="border-border hover:bg-muted font-medium cursor-pointer flex items-center gap-2"
            >
              {isExplaining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Explaining...</span>
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  <span>Explain this conversion</span>
                </>
              )}
            </Button>
          </div>

          {showExplain && explanation && (
            <Card className="border-border bg-card shadow-sm max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Translation Decisions</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  AI breakdown of design patterns, idioms, and scope decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 text-sm text-foreground/90 space-y-4 leading-relaxed whitespace-pre-line text-left">
                {explanation}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border sm:max-w-[425px]">
          <DialogHeader className="text-center space-y-3">
            <div className="mx-auto bg-amber-100 dark:bg-amber-950 p-3 rounded-full w-fit">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle className="text-xl font-bold">You've used all 5 free conversions today</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Upgrade to a Pro plan for unlimited conversions, priority support, and advanced features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeDialog(false)
                window.location.href = '/pricing'
              }}
              className="w-full border-border hover:bg-muted font-semibold cursor-pointer text-xs sm:text-sm px-2"
            >
              Get Annual — $49/yr
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeDialog(false)
                window.location.href = '/pricing'
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer text-xs sm:text-sm px-2"
            >
              Upgrade to Pro — $7/mo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Maximize Editor Dialog */}
      <Dialog 
        open={activeMaximize !== null} 
        onOpenChange={(open) => {
          if (!open) setActiveMaximize(null)
        }}
      >
        <DialogContent className="max-w-[95vw] w-[95vw] md:max-w-[90vw] md:w-[90vw] h-[90vh] max-h-[90vh] flex flex-col bg-card border border-border p-6 gap-4">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3 shrink-0">
            <div>
              <DialogTitle className="text-lg font-bold">
                {activeMaximize === 'input' 
                  ? `Source Code (${LANGUAGE_DISPLAY[fromLang as typeof LANGUAGES[number]] || fromLang})` 
                  : `Converted Code (${LANGUAGE_DISPLAY[toLang as typeof LANGUAGES[number]] || toLang})`}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeMaximize === 'input' 
                  ? 'Edit or view your source code in full screen mode.' 
                  : 'View your converted code in full screen mode.'}
              </DialogDescription>
            </div>
            
            {activeMaximize === 'output' && convertedCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-3 text-xs mr-6 cursor-pointer flex items-center space-x-1.5 rounded-full border-border bg-background hover:bg-muted"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </Button>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-0 w-full relative border border-border rounded-lg overflow-hidden bg-background">
            {activeMaximize === 'input' ? (
              <CodeEditor
                value={code}
                onChange={setCode}
                language={fromLang}
                placeholder={`Paste your ${LANGUAGE_DISPLAY[fromLang as typeof LANGUAGES[number]] || fromLang} code here...`}
              />
            ) : (
              <div className="w-full h-full flex flex-col overflow-hidden bg-muted/20 dark:bg-muted/5">
                {isLoading ? (
                  <div className="space-y-4 w-full h-full flex flex-col justify-start p-6">
                    <Skeleton className="h-6 w-[200px] bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                  </div>
                ) : highlightedHtml ? (
                  <div 
                    className="output-highlight w-full flex-1 font-mono text-sm overflow-auto text-left p-6 min-h-0 no-scrollbar"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                ) : (
                  <div className="text-center space-y-2 py-24 p-6 w-full my-auto">
                    <p className="text-sm text-muted-foreground">Converted code will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
