import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google Gen AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Converts code from a source language to a target language using a two-pass approach.
 */
export async function convertCode(
  fromLang: string,
  toLang: string,
  code: string
): Promise<{ converted: string; error?: string }> {
  try {
    // Step A — Validate
    if (code.length > 10000) {
      throw new Error('Code exceeds 10,000 character limit')
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables')
    }

    // Step B — Single-pass conversion and code review
    const systemInstruction = `You are an expert polyglot software engineer and a senior ${toLang} engineer. Your specialty is translating code from ${fromLang} to ${toLang} in a way that feels completely native to the target language — not a mechanical translation.

RULES:
1. Preserve 100% of the original logic and behavior.
2. Use idiomatic patterns, naming conventions (snake_case, camelCase, PascalCase), and modern syntax of ${toLang}.
3. Replace source-language constructs with natural target equivalents and standard library functions of ${toLang}.
4. Fix any non-idiomatic patterns that feel like they came from ${fromLang}.
5. Ensure proper error handling that a professional ${toLang} developer would write.
6. Add all required import/include statements.
7. Translate comments to ${toLang}; add brief comments ONLY where translation decisions are non-obvious.
8. Never add boilerplate the original did not have.

OUTPUT: Return ONLY raw code. No markdown fences. No explanations. No preamble. Just the clean, reviewed, and converted code ready to copy-paste.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: systemInstruction,
      generationConfig: {
        maxOutputTokens: 4096,
      },
    })

    const userMessage = `Convert the following ${fromLang} code to ${toLang}.

STARTCODE
${code}
ENDCODE`

    const result = await model.generateContent(userMessage)
    const output = result.response.text()

    if (!output) {
      throw new Error('AI conversion generated empty output')
    }

    // Clean up markdown code blocks if the model ignored the instructions
    let cleanedOutput = output.trim()
    if (cleanedOutput.startsWith('```')) {
      const lines = cleanedOutput.split('\n')
      if (lines[0].startsWith('```')) {
        lines.shift()
      }
      if (lines[lines.length - 1] === '```') {
        lines.pop()
      }
      cleanedOutput = lines.join('\n').trim()
    }

    return { converted: cleanedOutput }
  } catch (err: any) {
    return {
      converted: '',
      error: err?.message || 'An unknown error occurred during code conversion',
    }
  }
}

/**
 * Generates an explanation for a code conversion.
 */
export async function explainConversion(
  fromLang: string,
  toLang: string,
  originalCode: string,
  convertedCode: string
): Promise<{ explanation: string; error?: string }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables')
    }

    const explainPrompt = `A developer converted ${fromLang} to ${toLang}.

ORIGINAL (${fromLang}):
${originalCode}

CONVERTED (${toLang}):
${convertedCode}

Write bullet points explaining the most important translation decisions.
Focus on: language-specific pattern changes, behavioral differences,
assumptions made. Under 150 words. Be specific.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        maxOutputTokens: 4096,
      },
    })

    const result = await model.generateContent(explainPrompt)
    const output = result.response.text()

    if (!output) {
      throw new Error('Explanation generated empty output')
    }

    return { explanation: output.trim() }
  } catch (err: any) {
    return {
      explanation: '',
      error: err?.message || 'An unknown error occurred while generating the explanation',
    }
  }
}
