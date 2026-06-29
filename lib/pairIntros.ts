/**
 * Unique, technically accurate intro paragraphs for the top 20 language pairs.
 * Each string describes the real technical differences between the two languages
 * and why a developer might be converting between them.
 * Pairs not listed here fall back to the generic template in the pair page.
 */
export const PAIR_INTROS: Record<string, string> = {
  'python-javascript':
    "Python's indentation-based syntax and duck-typed runtime are a world apart from JavaScript's event-loop model and prototype chain. When porting Python scripts to JavaScript you'll need to map list comprehensions to Array methods like `.map()` and `.filter()`, replace generators with async iterators, and substitute standard-library modules such as `os` and `json` with Node.js equivalents or browser APIs.",

  'javascript-python':
    "JavaScript's asynchronous callback and Promise model contrasts sharply with Python's synchronous-first style and `asyncio` library. Converting JavaScript to Python means replacing arrow functions with `def` or `lambda`, translating `Promise.all` to `asyncio.gather`, and swapping prototype-based class patterns for Python's class inheritance. Python's strict indentation replaces JavaScript's curly-brace blocks.",

  'python-typescript':
    "Python and TypeScript share a commitment to developer productivity, but their type systems differ fundamentally — Python's type hints are optional and runtime-ignored, while TypeScript enforces structural typing at compile time. When converting, Python's `dict`, `list`, and `Optional` type hints map to TypeScript interfaces, generics, and union types. Python dataclasses translate naturally to TypeScript interfaces or classes with typed properties.",

  'java-python':
    "Java's verbose, statically typed class hierarchy stands in sharp contrast to Python's dynamic duck-typing and concise syntax. Porting Java to Python means collapsing boilerplate: Java's getters/setters become plain properties, checked exceptions become try/except blocks, and Java's `ArrayList`/`HashMap` map directly to Python's built-in `list` and `dict`. Java's 10-line class definition often compresses to 3 lines of Python.",

  'javascript-typescript':
    "TypeScript is a strict superset of JavaScript, so most JavaScript code is valid TypeScript — but the value comes from adding type annotations. Converting JavaScript to TypeScript means introducing interface and type declarations, annotating function parameters and return types, replacing `any`-typed patterns with proper generics, and enabling strict null checks. The result catches entire classes of runtime bugs at compile time.",

  'typescript-javascript':
    "Stripping TypeScript to JavaScript means removing type annotations, interface declarations, generics, and enum definitions while preserving all runtime logic unchanged. The resulting JavaScript runs anywhere without a build step, which is useful for lightweight scripts, serverless functions with cold-start constraints, or open-source libraries targeting the broadest possible audience.",

  'python-go':
    "Python's dynamic typing and interpreted runtime trade raw speed for development velocity; Go's compiled, statically typed runtime inverts that trade-off. Converting Python to Go requires explicitly typing every variable and function signature, replacing Python's exception handling with Go's idiomatic `error` return values, and restructuring goroutine-friendly concurrency patterns in place of Python threads or `asyncio`. Python's `dict` becomes Go's `map`, and slices replace lists.",

  'go-python':
    "Go's explicit error returns, goroutines, and static typing give way to Python's exceptions, `asyncio`, and dynamic runtime when porting in this direction. Go's `struct` types map to Python dataclasses or plain classes, goroutines can be approximated with `asyncio` tasks or `threading.Thread`, and Go's interface-based polymorphism translates to Python's duck-typed protocols. The resulting Python is typically far shorter but trades compile-time safety for runtime flexibility.",

  'python-rust':
    "Rust's ownership model and borrow checker represent a fundamentally different memory management philosophy from Python's garbage collector. When porting Python to Rust, every variable must have a defined lifetime, `list` becomes `Vec<T>`, `dict` becomes `HashMap<K, V>`, and Python exceptions are replaced with Rust's `Result<T, E>` type. The gain is predictable, zero-overhead performance with memory safety guarantees and no GC pauses.",

  'rust-python':
    "Rewriting Rust in Python prioritises developer ergonomics and iteration speed over Rust's zero-cost abstractions and memory-safety guarantees. Rust's ownership and lifetimes disappear — Python's garbage collector handles memory automatically. Rust's `Result` and `Option` types map to Python's exception handling and `None`. The tradeoff is reduced performance and no compile-time memory safety, but significantly faster development and a much shorter codebase.",

  'java-javascript':
    "Java's JVM-based, class-centric object model is architecturally different from JavaScript's prototype chain and event-loop runtime. Converting Java to JavaScript means replacing interfaces with duck typing or TypeScript interfaces, mapping Java's threading model to JavaScript's async/await, and replacing Java's `ArrayList`/`HashMap` with native arrays and objects. Java's checked exceptions translate to try/catch with untyped errors.",

  'javascript-java':
    "JavaScript's dynamic, single-threaded runtime gives way to Java's strongly typed, multithreaded JVM when converting in this direction. Every variable and return type needs an explicit type declaration, `Promise`-based async patterns become Java's `CompletableFuture` or synchronous blocking calls, and JavaScript's objects become Java classes with defined fields and constructors. Java's verbosity is offset by compile-time correctness guarantees.",

  'python-java':
    "Python's concise, script-friendly syntax expands dramatically when converted to Java's enterprise-grade structure. Python functions become Java class methods, Python's `list` and `dict` map to `ArrayList` and `HashMap`, optional type hints become mandatory type declarations, and Python's `try/except` becomes Java's checked-exception `try/catch` blocks. A single Python file often becomes multiple Java files organized by class hierarchy.",

  'java-go':
    "Java's JVM ecosystem and object-oriented class hierarchy contrast with Go's lean compiled runtime and structural typing. Converting Java to Go replaces abstract classes and interfaces with Go interfaces (defined by method sets, not inheritance), maps Java's thread-pool executor to goroutines and channels, and substitutes Java's checked exceptions with Go's explicit `(value, error)` return convention. The result is typically leaner, faster, and more explicit.",

  'cpp-python':
    "C++ requires manual memory management, explicit type declarations, and compile-time resolution — Python automates all of that. Porting C++ to Python means replacing `new`/`delete` with Python's garbage collector, translating pointer arithmetic to list indexing, converting C++ templates to Python generics or duck-typed functions, and replacing `std::vector`/`std::map` with `list`/`dict`. Header files disappear entirely.",

  'python-cpp':
    "Python's dynamic, garbage-collected runtime is replaced by C++'s manual memory model and compile-time type system when porting in this direction. Python lists become `std::vector<T>`, dicts become `std::unordered_map<K, V>`, and Python exceptions map to C++ exception classes or error codes. Developers gain deterministic performance and direct hardware access at the cost of significantly more verbose and complex code.",

  'kotlin-java':
    "Kotlin compiles to the same JVM bytecode as Java and is fully interoperable with it, so the conversion is largely syntactic. Kotlin's data classes become Java POJOs with getters/setters/equals/hashCode, `val`/`var` declarations become typed Java fields, extension functions become static utility methods, and Kotlin's null safety (`?` types) maps to Java's `Optional` or `@Nullable` annotations. Kotlin coroutines translate to `CompletableFuture` or `ExecutorService`.",

  'java-kotlin':
    "Kotlin dramatically reduces Java boilerplate while remaining fully JVM-compatible. Java's verbose getter/setter POJOs collapse into Kotlin `data class` declarations, `Optional<T>` is replaced by Kotlin's built-in null-safety operators (`?.`, `?:`, `!!`), anonymous inner classes become lambdas, and Java's checked exceptions simply disappear. The same logic that takes 50 lines of Java often fits in 15 lines of idiomatic Kotlin.",

  'php-python':
    "PHP's web-centric execution model and dynamic typing share similarities with Python, but the idioms diverge significantly. PHP's `$` variable prefix and array functions (`array_map`, `array_filter`) translate to Python's plain variables and built-in `list` methods. PHP's mixed-type arrays become Python lists or dicts, `echo` statements become `print`, and PHP's `require`/`include` becomes Python's `import` system.",

  'ruby-python':
    "Ruby and Python share a philosophy of developer happiness and readable syntax, making this one of the more natural conversions. Ruby's blocks and `yield` map closely to Python's first-class functions and decorators, Ruby's `Enumerable` methods (`map`, `select`, `reduce`) have direct Python equivalents, and Ruby's `nil` becomes Python's `None`. Ruby's `snake_case` convention is shared, though Ruby uses `end` keywords where Python uses indentation.",
}

/**
 * Returns the unique intro paragraph for a specific language pair,
 * or null if no custom intro exists (caller should use the fallback template).
 */
export function getPairIntro(from: string, to: string): string | null {
  return PAIR_INTROS[`${from}-${to}`] ?? null
}
