# SEO Data Generation Handoff (JSON System)

This file guides you on how to generate the complete SEO meta-description paragraphs, technical comparison tables, real code translation examples, and migration tips for all **266 remaining language pairs** in batches of 20.

All comparison data is now stored as individual `.json` files in the `data/pairs/` directory. This keeps the codebase fast and prevents editor/compiler lag at scale.

Use a high-quality model (like Claude 3.5 Sonnet or Gemini 1.5 Pro) to generate this data.

---

## 🛠️ Step 1: Generating the JSON Files

Use the prompt below to generate the JSON content.

### The Prompt to Copy/Paste into your Pro LLM:

```text
You are an expert developer tool architect. I need you to generate structured SEO comparison data for the programming language pairs listed below.

For each pair, return a valid JSON object matching this schema:

{
  "intro": "A unique, technically accurate introduction paragraph of exactly 2 to 3 sentences explaining the key differences between the source and target languages and why a dev might convert. Do not write generic templates.",
  "diffs": [
    // Exactly 5 objects with this structure (type system, syntax, memory, async, standard library)
    { "category": "Type System", "from": "Explanation for source...", "to": "Explanation for target..." },
    ...
  ],
  "examples": [
    // Exactly 2 objects showing realistic code conversions
    {
      "title": "Example title",
      "description": "Short explanation of the conversion dynamics",
      "fromCode": "Source code string...",
      "toCode": "Target code string..."
    },
    ...
  ],
  "tips": [
    // Exactly 4 objects containing migration tips
    { "title": "Tip title", "body": "Actionable explanation of porting..." },
    ...
  ],
  "faqs": [
    // Optional: Exactly 3 unique question/answer FAQ objects specific to the language pair
    { "question": "Pair specific question...", "answer": "Detailed technical answer..." },
    ...
  ]
}

CRITICAL RULES:
1. Ensure code examples are realistic, correct, and represent natural idioms in both languages.
2. Ensure the output is valid, parsable JSON. Escapes inside string values must follow JSON spec (e.g. use \\n for newlines, escape internal double quotes as \\\").
3. Keep all text concise, highly developer-oriented, and technically accurate.

Format the output as a JSON map where keys are the pair names (e.g., "python-c"):
{
  "from-to": {
    "intro": "...",
    "diffs": [...],
    "examples": [...],
    "tips": [...],
    "faqs": [...]
  },
  ...
}

Here is the list of pairs to generate:
[INSERT BATCH OF 20 PAIRS HERE]
```

---

## 🛠️ Step 2: Saving the Generated Data

Once the AI outputs the JSON block:
1. You can copy the inner JSON for each pair.
2. Create a file named `from-to.json` (e.g. `python-c.json`) in the directory: [data/pairs/](file:///d:/Aaftab/Antigravity%20Projects/nextjs%20apps/convert/data/pairs)
3. Paste the JSON object there.

Alternatively, you can save the entire batch output as a temporary JSON file (e.g. `batch.json`) and run a simple Node command to split it:
```javascript
// Run in Node:
const fs = require('fs');
const batch = require('./batch.json');
for (const [pair, data] of Object.entries(batch)) {
  fs.writeFileSync(`./data/pairs/${pair}.json`, JSON.stringify(data, null, 2));
}
```

---

## 📦 The 15 Batches of 20 Language Pairs

Copy one batch at a time and paste it into the placeholder `[INSERT BATCH OF 20 PAIRS HERE]` in the prompt above.

### Batch 1 (Completed!)
The first 20 pairs (Batch 1) are already generated and saved in your `data/pairs/` directory.

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
