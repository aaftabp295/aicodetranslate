import { LanguageFromGrid } from '@/components/converter/LanguageFromGrid'

export const metadata = {
  title: 'All Code Converters — Convert Between 18 Languages',
  description: 'Convert code between Python, JavaScript, TypeScript, Java, Go, Rust and 12 more languages using AI. Free online tool. No registration required.',
}

export default function ConvertersPage() {
  return (
    <div className="py-12 bg-background">
      <LanguageFromGrid />
    </div>
  )
}
