# SEO Data Generation Handoff

This file guides you on how to generate the complete SEO meta-description paragraphs, technical comparison tables, real code translation examples, and migration tips for all **286 remaining language pairs** in batches of 20.

Use a high-quality model (like Claude 3.5 Sonnet or Gemini 1.5 Pro) to generate this data.

---

## 🛠️ Step 1: Generating the Consolidated SEO Blocks (for `lib/pairContent.ts`)

This generates the comparison tables, side-by-side code blocks, 4 migration tips, AND the unique 2-3 sentence introduction paragraph all in one go.

### The Prompt to Copy/Paste into your Pro LLM:

```text
You are an expert developer tool architect. I need you to generate structured SEO comparison data for the programming language pairs listed below.

For each pair, return a TypeScript object entry matching this type structure:
interface DiffRow {
  category: string;
  from: string;
  to: string;
}

interface CodeExample {
  title: string;
  description: string;
  fromCode: string;
  toCode: string;
}

interface MigrationTip {
  title: string;
  body: string;
}

interface PairContent {
  intro: string; // A unique, technically accurate introduction paragraph of exactly 2 to 3 sentences explaining the key differences between the source and target languages and why a dev might convert. Do not write generic templates.
  diffs: DiffRow[]; // Exactly 5 comparison rows (e.g. type system, syntax, memory, async/concurrency, standard library)
  examples: CodeExample[]; // Exactly 2 realistic, commented code snippets (e.g., file reading, async request, list transformations, classes)
  tips: MigrationTip[]; // Exactly 4 actionable tips for porting code
}

CRITICAL RULES:
1. Ensure code examples are realistic, correct, and represent natural idioms in both languages.
2. In the code strings, if you output a dollar sign followed by curly braces (like `${variable}` in bash, javascript, php, etc.), ESCAPE the dollar sign with a backslash if it is inside backticks (e.g., `\${variable}`) so that the TypeScript compiler does not parse it as a template expression.
3. Keep all text concise, highly developer-oriented, and technically accurate.

Format the output exactly as:
  'from-to': {
    intro: "...",
    diffs: [
      { category: '...', from: '...', to: '...' },
      // ... 5 rows
    ],
    examples: [
      {
        title: '...',
        description: '...',
        fromCode: `...`,
        toCode: `...`
      },
      // ... 2 examples
    ],
    tips: [
      { title: '...', body: '...' },
      // ... 4 tips
    ]
  },

Here is the list of pairs to generate:
[INSERT BATCH OF 20 PAIRS HERE]
```

---

## 📦 The 15 Batches of 20 Language Pairs

Copy one batch at a time and paste it into the placeholder `[INSERT BATCH OF 20 PAIRS HERE]` in both prompts above.

### Batch 1
```json
[
  "python-c",
  "python-csharp",
  "python-php",
  "python-ruby",
  "python-swift",
  "python-kotlin",
  "python-scala",
  "python-r",
  "python-bash",
  "python-sql",
  "python-dart",
  "javascript-c",
  "javascript-cpp",
  "javascript-csharp",
  "javascript-go",
  "javascript-rust",
  "javascript-php",
  "javascript-ruby",
  "javascript-swift",
  "javascript-kotlin"
]
```

### Batch 2
```json
[
  "javascript-scala",
  "javascript-r",
  "javascript-bash",
  "javascript-sql",
  "javascript-dart",
  "typescript-python",
  "typescript-java",
  "typescript-c",
  "typescript-cpp",
  "typescript-csharp",
  "typescript-go",
  "typescript-rust",
  "typescript-php",
  "typescript-ruby",
  "typescript-swift",
  "typescript-kotlin",
  "typescript-scala",
  "typescript-r",
  "typescript-bash",
  "typescript-sql"
]
```

### Batch 3
```json
[
  "typescript-dart",
  "java-typescript",
  "java-c",
  "java-cpp",
  "java-csharp",
  "java-rust",
  "java-php",
  "java-ruby",
  "java-swift",
  "java-scala",
  "java-r",
  "java-bash",
  "java-sql",
  "java-dart",
  "c-python",
  "c-javascript",
  "c-typescript",
  "c-java",
  "c-cpp",
  "c-csharp"
]
```

### Batch 4
```json
[
  "c-go",
  "c-rust",
  "c-php",
  "c-ruby",
  "c-swift",
  "c-kotlin",
  "c-scala",
  "c-r",
  "c-bash",
  "c-sql",
  "c-dart",
  "cpp-javascript",
  "cpp-typescript",
  "cpp-java",
  "cpp-c",
  "cpp-csharp",
  "cpp-go",
  "cpp-rust",
  "cpp-php",
  "cpp-ruby"
]
```

### Batch 5
```json
[
  "cpp-swift",
  "cpp-kotlin",
  "cpp-scala",
  "cpp-r",
  "cpp-bash",
  "cpp-sql",
  "cpp-dart",
  "csharp-python",
  "csharp-javascript",
  "csharp-typescript",
  "csharp-java",
  "csharp-c",
  "csharp-cpp",
  "csharp-go",
  "csharp-rust",
  "csharp-php",
  "csharp-ruby",
  "csharp-swift",
  "csharp-kotlin",
  "csharp-scala"
]
```

### Batch 6
```json
[
  "csharp-r",
  "csharp-bash",
  "csharp-sql",
  "csharp-dart",
  "go-javascript",
  "go-typescript",
  "go-java",
  "go-c",
  "go-cpp",
  "go-csharp",
  "go-rust",
  "go-php",
  "go-ruby",
  "go-swift",
  "go-kotlin",
  "go-scala",
  "go-r",
  "go-bash",
  "go-sql",
  "go-dart"
]
```

### Batch 7
```json
[
  "rust-javascript",
  "rust-typescript",
  "rust-java",
  "rust-c",
  "rust-cpp",
  "rust-csharp",
  "rust-go",
  "rust-php",
  "rust-ruby",
  "rust-swift",
  "rust-kotlin",
  "rust-scala",
  "rust-r",
  "rust-bash",
  "rust-sql",
  "rust-dart",
  "php-javascript",
  "php-typescript",
  "php-java",
  "php-c"
]
```

### Batch 8
```json
[
  "php-cpp",
  "php-csharp",
  "php-go",
  "php-rust",
  "php-ruby",
  "php-swift",
  "php-kotlin",
  "php-scala",
  "php-r",
  "php-bash",
  "php-sql",
  "php-dart",
  "ruby-javascript",
  "ruby-typescript",
  "ruby-java",
  "ruby-c",
  "ruby-cpp",
  "ruby-csharp",
  "ruby-go",
  "ruby-rust"
]
```

### Batch 9
```json
[
  "ruby-php",
  "ruby-swift",
  "ruby-kotlin",
  "ruby-scala",
  "ruby-r",
  "ruby-bash",
  "ruby-sql",
  "ruby-dart",
  "swift-python",
  "swift-javascript",
  "swift-typescript",
  "swift-java",
  "swift-c",
  "swift-cpp",
  "swift-csharp",
  "swift-go",
  "swift-rust",
  "swift-php",
  "swift-ruby",
  "swift-kotlin"
]
```

### Batch 10
```json
[
  "swift-scala",
  "swift-r",
  "swift-bash",
  "swift-sql",
  "swift-dart",
  "kotlin-python",
  "kotlin-javascript",
  "kotlin-typescript",
  "kotlin-c",
  "kotlin-cpp",
  "kotlin-csharp",
  "kotlin-go",
  "kotlin-rust",
  "kotlin-php",
  "kotlin-ruby",
  "kotlin-swift",
  "kotlin-scala",
  "kotlin-r",
  "kotlin-bash",
  "kotlin-sql"
]
```

### Batch 11
```json
[
  "kotlin-dart",
  "scala-python",
  "scala-javascript",
  "scala-typescript",
  "scala-java",
  "scala-c",
  "scala-cpp",
  "scala-csharp",
  "scala-go",
  "scala-rust",
  "scala-php",
  "scala-ruby",
  "scala-swift",
  "scala-kotlin",
  "scala-r",
  "scala-bash",
  "scala-sql",
  "scala-dart",
  "r-python",
  "r-javascript"
]
```

### Batch 12
```json
[
  "r-typescript",
  "r-java",
  "r-c",
  "r-cpp",
  "r-csharp",
  "r-go",
  "r-rust",
  "r-php",
  "r-ruby",
  "r-swift",
  "r-kotlin",
  "r-scala",
  "r-bash",
  "r-sql",
  "r-dart",
  "bash-python",
  "bash-javascript",
  "bash-typescript",
  "bash-java",
  "bash-c"
]
```

### Batch 13
```json
[
  "bash-cpp",
  "bash-csharp",
  "bash-go",
  "bash-rust",
  "bash-php",
  "bash-ruby",
  "bash-swift",
  "bash-kotlin",
  "bash-scala",
  "bash-r",
  "bash-sql",
  "bash-dart",
  "sql-python",
  "sql-javascript",
  "sql-typescript",
  "sql-java",
  "sql-c",
  "sql-cpp",
  "sql-csharp",
  "sql-go"
]
```

### Batch 14
```json
[
  "sql-rust",
  "sql-php",
  "sql-ruby",
  "sql-swift",
  "sql-kotlin",
  "sql-scala",
  "sql-r",
  "sql-bash",
  "sql-dart",
  "dart-python",
  "dart-javascript",
  "dart-typescript",
  "dart-java",
  "dart-c",
  "dart-cpp",
  "dart-csharp",
  "dart-go",
  "dart-rust",
  "dart-php",
  "dart-ruby"
]
```

### Batch 15
```json
[
  "dart-swift",
  "dart-kotlin",
  "dart-scala",
  "dart-r",
  "dart-bash",
  "dart-sql"
]
```
