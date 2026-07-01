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
  copied: boolean
  highlightedHtml: string
  activeMaximize: 'input' | 'output' | null

  // Rate Limiting & Subs State
  remaining: number | null
  limit: number
  showUpgradeDialog: boolean
  isInitialLoad: boolean
  plan: 'guest' | 'free' | 'pro'
  lastDraft: {
    code: string
    convertedCode: string
    highlightedHtml: string
    fromLang: string
    toLang: string
  } | null

  // Setters
  setCode: (code: string) => void
  setConvertedCode: (code: string) => void
  setFromLang: (lang: string) => void
  setToLang: (lang: string) => void
  setCopied: (copied: boolean) => void
  setHighlightedHtml: (html: string) => void
  setActiveMaximize: (maximize: 'input' | 'output' | null) => void
  setShowUpgradeDialog: (show: boolean) => void

  // Actions
  fetchQuota: () => Promise<void>
  convertCode: () => Promise<void>
  swapLanguages: () => Promise<void>
  clearConverter: () => void
  restoreDraft: () => void
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
      copied: false,
      highlightedHtml: '',
      activeMaximize: null,
      remaining: null,
      limit: 5,
      showUpgradeDialog: false,
      isInitialLoad: true,
      plan: 'guest',
      lastDraft: null,

      // Simple Setters
      setCode: (code) => set({ code }),
      setConvertedCode: (convertedCode) => set({ convertedCode }),
      setFromLang: (fromLang) => set({ fromLang }),
      setToLang: (toLang) => set({ toLang }),
      setCopied: (copied) => set({ copied }),
      setHighlightedHtml: (highlightedHtml) => set({ highlightedHtml }),
      setActiveMaximize: (activeMaximize) => set({ activeMaximize }),
      setShowUpgradeDialog: (showUpgradeDialog) => set({ showUpgradeDialog }),
      clearConverter: () => {
        const { code, convertedCode, highlightedHtml, fromLang, toLang } = get()
        if (code.trim()) {
          set({
            lastDraft: { code, convertedCode, highlightedHtml, fromLang, toLang }
          })
          
          toast("Editor cleared", {
            description: "You can restore your previous code and translation.",
            action: {
              label: "Undo",
              onClick: () => get().restoreDraft(),
            },
            duration: 8000,
          })
        }
        
        set({
          code: '',
          convertedCode: '',
          highlightedHtml: '',
          copied: false
        })
      },

      restoreDraft: () => {
        const { lastDraft } = get()
        if (lastDraft) {
          set({
            code: lastDraft.code,
            convertedCode: lastDraft.convertedCode,
            highlightedHtml: lastDraft.highlightedHtml,
            fromLang: lastDraft.fromLang,
            toLang: lastDraft.toLang,
            lastDraft: null
          })
          toast.success("Restored last session code!")
        }
      },

      // Async Actions
      fetchQuota: async () => {
        try {
          const res = await fetch('/api/quota')
          if (res.ok) {
            const data = await res.json()
            set({ remaining: data.remaining, limit: data.limit, plan: data.plan })
          } else {
            set({ remaining: 5, plan: 'guest' })
          }
        } catch (err) {
          console.error('Failed to load quota:', err)
          set({ remaining: 5, plan: 'guest' })
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

        set({ isLoading: true })

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
        highlightedHtml: state.highlightedHtml,
        lastDraft: state.lastDraft,
      }),
    }
  )
)
