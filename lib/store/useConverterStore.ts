import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { Language } from '@/lib/languages'

interface ConverterState {
  // Inputs & Langs State
  code: string
  convertedCode: string
  fromLang: string
  toLang: string

  // UI Status State
  isLoading: boolean
  isExplaining: boolean
  showExplain: boolean
  explanation: string
  copied: boolean
  highlightedHtml: string
  activeMaximize: 'input' | 'output' | null

  // Rate Limiting & Subs State
  remaining: number | null
  limit: number
  showUpgradeDialog: boolean

  // Setters
  setCode: (code: string) => void
  setConvertedCode: (code: string) => void
  setFromLang: (lang: string) => void
  setToLang: (lang: string) => void
  setCopied: (copied: boolean) => void
  setHighlightedHtml: (html: string) => void
  setActiveMaximize: (maximize: 'input' | 'output' | null) => void
  setShowUpgradeDialog: (show: boolean) => void
  setShowExplain: (show: boolean) => void
  setExplanation: (explanation: string) => void

  // Actions
  fetchQuota: () => Promise<void>
  convertCode: () => Promise<void>
  explainCode: () => Promise<void>
  swapLanguages: () => Promise<void>
}

export const useConverterStore = create<ConverterState>()(
  persist(
    (set, get) => ({
      // Default States
      code: '',
      convertedCode: '',
      fromLang: 'python',
      toLang: 'javascript',
      isLoading: false,
      isExplaining: false,
      showExplain: false,
      explanation: '',
      copied: false,
      highlightedHtml: '',
      activeMaximize: null,
      remaining: null,
      limit: 5,
      showUpgradeDialog: false,

      // Simple Setters
      setCode: (code) => set({ code }),
      setConvertedCode: (convertedCode) => set({ convertedCode }),
      setFromLang: (fromLang) => set({ fromLang }),
      setToLang: (toLang) => set({ toLang }),
      setCopied: (copied) => set({ copied }),
      setHighlightedHtml: (highlightedHtml) => set({ highlightedHtml }),
      setActiveMaximize: (activeMaximize) => set({ activeMaximize }),
      setShowUpgradeDialog: (showUpgradeDialog) => set({ showUpgradeDialog }),
      setShowExplain: (showExplain) => set({ showExplain }),
      setExplanation: (explanation) => set({ explanation }),

      // Async Actions
      fetchQuota: async () => {
        try {
          const res = await fetch('/api/quota')
          if (res.ok) {
            const data = await res.json()
            set({ remaining: data.remaining, limit: data.limit })
          } else {
            set({ remaining: 5 })
          }
        } catch (err) {
          console.error('Failed to load quota:', err)
          set({ remaining: 5 })
        }
      },

      convertCode: async () => {
        const { code, fromLang, toLang } = get()
        if (!code.trim()) {
          toast.error('Please enter some code to convert.')
          return
        }

        if (code.length > 10000) {
          toast.error('Code exceeds 10,000 character limit')
          return
        }

        set({ isLoading: true, showExplain: false, explanation: '' })

        try {
          const response = await fetch('/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, fromLang, toLang }),
          })

          if (response.status === 429) {
            set({ remaining: 0, showUpgradeDialog: true })
            return
          }

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.error || 'Conversion failed. Please try again.')
          }

          const data = await response.json()
          set({
            convertedCode: data.converted,
            remaining: data.remaining,
            highlightedHtml: data.highlightedHtml,
          })
          toast.success('Code converted successfully!')
        } catch (error: any) {
          console.error('Conversion error:', error)
          toast.error(error?.message || 'Failed to convert code.')
        } finally {
          set({ isLoading: false })
        }
      },

      explainCode: async () => {
        const { code, convertedCode, fromLang, toLang } = get()
        if (!convertedCode) return

        set({ isExplaining: true })
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
            set({ remaining: 0, showUpgradeDialog: true })
            return
          }

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw new Error(errData.error || 'Failed to generate explanation.')
          }

          const data = await response.json()
          set({ explanation: data.explanation, showExplain: true })
          toast.success('Explanation generated!')
        } catch (error: any) {
          console.error('Explanation error:', error)
          toast.error(error?.message || 'Failed to generate explanation.')
        } finally {
          set({ isExplaining: false })
        }
      },

      swapLanguages: async () => {
        const { fromLang, toLang, code, convertedCode } = get()
        if (fromLang === toLang) return

        const tempLang = fromLang
        set({ fromLang: toLang, toLang: tempLang })

        if (convertedCode) {
          const tempCode = code
          set({ code: convertedCode, convertedCode: tempCode })

          try {
            const response = await fetch('/api/highlight', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: tempCode, lang: tempLang }),
            })
            if (response.ok) {
              const data = await response.json()
              set({ highlightedHtml: data.highlightedHtml })
            }
          } catch (err) {
            console.error('Failed to highlight swapped code:', err)
          }
        }
      },
    }),
    {
      name: 'code-converter-store',
      // Only persist code inputs and results, not UI loadings/modals
      partialize: (state) => ({
        code: state.code,
        convertedCode: state.convertedCode,
        fromLang: state.fromLang,
        toLang: state.toLang,
        explanation: state.explanation,
        showExplain: state.showExplain,
        highlightedHtml: state.highlightedHtml,
      }),
    }
  )
)
