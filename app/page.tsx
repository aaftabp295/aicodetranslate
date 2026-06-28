import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ConverterPanel } from "@/components/converter/ConverterPanel";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">ConvertAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-10">
        <div className="max-w-6xl mx-auto px-4 w-full text-center space-y-3 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Convert Code <span className="text-primary">Instantly</span> with AI
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Translate code between 18 programming languages with high fidelity, idiomatic translations, and detailed explanations.
          </p>
        </div>

        <ConverterPanel />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} ConvertAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
