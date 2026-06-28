'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LANGUAGES, getLangDisplayName, Language } from '@/lib/languages'

interface StickyHeaderProps {
  from: Language
}

export function StickyLanguageHeader({ from }: StickyHeaderProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = React.useState(false)
  const fromDisplay = getLangDisplayName(from)

  React.useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past the hero section (around 260px)
      if (window.scrollY > 260) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSelect = (value: string) => {
    router.push(`/convert-${from}-to-${value}`)
  }

  // Get all target options
  const targetOptions = LANGUAGES.filter((lang) => lang !== from)

  return (
    <div
      className={`fixed top-14 left-0 right-0 z-30 border-b border-border bg-background/95 backdrop-blur shadow-sm transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-6xl h-12 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
          <span className="text-muted-foreground">Converting from:</span>
          <span className="font-bold text-foreground bg-primary/10 px-2 py-0.5 rounded-md text-xs">
            {fromDisplay}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div>
          <Select onValueChange={handleSelect}>
            <SelectTrigger size="sm" className="w-[180px] bg-card border-border text-xs cursor-pointer font-semibold">
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-popover border-border">
              {targetOptions.map((lang) => (
                <SelectItem key={lang} value={lang} className="text-xs cursor-pointer">
                  {getLangDisplayName(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
