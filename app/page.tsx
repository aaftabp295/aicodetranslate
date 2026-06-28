import { ConverterPanel } from "@/components/converter/ConverterPanel";

export default function Home() {
  return (
    <div className="py-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 w-full text-center space-y-3 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Convert Code <span className="text-primary">Instantly</span> with AI
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Translate code between 18 programming languages with high fidelity, idiomatic translations, and detailed explanations.
        </p>
      </div>

      <ConverterPanel />
    </div>
  );
}
