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

    // Step B — First pass (convert)
    const convertSystemInstruction = `You are an expert polyglot software engineer with 20+ years of production
experience in every major programming language. Your specialty is translating
code between languages in a way that feels completely native to the target
language — not a mechanical translation.

RULES:
1. Preserve 100% of the original logic and behavior
2. Use idiomatic patterns and conventions of the TARGET language
3. Use modern, widely-accepted syntax of the target language
4. Replace source-language constructs with natural target equivalents
5. Use the target language standard library wherever applicable
6. Follow naming conventions strictly (snake_case, camelCase, PascalCase per lang)
7. Add all required import/include statements
8. Translate comments to the target language
9. Add brief comments ONLY where translation decision is non-obvious
10. Never add boilerplate the original did not have

OUTPUT: Return ONLY raw code. No markdown fences. No explanations.
No preamble. Just the converted code ready to copy-paste.`

    const convertModel = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: convertSystemInstruction,
      generationConfig: {
        maxOutputTokens: 4096,
      },
    })

    const convertUserMessage = `Convert the following ${fromLang} code to ${toLang}.

STARTCODE
${code}
ENDCODE`

    const firstPassResult = await convertModel.generateContent(convertUserMessage)
    const firstPassOutput = firstPassResult.response.text()

    if (!firstPassOutput) {
      throw new Error('First pass generated empty output')
    }

    // Step C — Second pass (review)
    const reviewSystemInstruction = `You are a senior ${toLang} engineer doing a code review.

Review this ${toLang} code converted from ${fromLang}. Fix any issues:
- Non-idiomatic patterns that feel like they came from ${fromLang}
- Missing error handling a ${toLang} developer would add
- Standard library functions that should replace manual implementations
- Naming convention violations
- Obvious bugs from translation

Return ONLY corrected code. No explanations. If already perfect, return unchanged.`

    const reviewModel = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      systemInstruction: reviewSystemInstruction,
      generationConfig: {
        maxOutputTokens: 4096,
      },
    })

    const secondPassResult = await reviewModel.generateContent(firstPassOutput)
    const secondPassOutput = secondPassResult.response.text()

    if (!secondPassOutput) {
      throw new Error('Second pass generated empty output')
    }

    // Clean up markdown code blocks if the model ignored the instructions
    let cleanedOutput = secondPassOutput.trim()
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
