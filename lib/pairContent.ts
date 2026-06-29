/**
 * Rich, unique per-pair SEO content for the top 20 language pairs.
 * Each entry has:
 *   - diffs: 5 side-by-side characteristic comparisons
 *   - examples: 2 realistic code snippets showing source → target conversion
 *   - tips: 4 specific migration tips for that pair
 *
 * Pairs not listed return null → page renders without this section.
 */

export interface DiffRow {
  category: string
  from: string
  to: string
}

export interface CodeExample {
  title: string
  description: string
  fromCode: string
  toCode: string
}

export interface MigrationTip {
  title: string
  body: string
}

export interface PairContent {
  intro: string
  diffs: DiffRow[]
  examples: CodeExample[]
  tips: MigrationTip[]
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const DATA: Record<string, PairContent> = {

  // ── python → javascript ──────────────────────────────────────────────────
  'python-javascript': {
    intro: "Python's indentation-based syntax and duck-typed runtime are a world apart from JavaScript's event-loop model and prototype chain. When porting Python scripts to JavaScript you'll need to map list comprehensions to Array methods like `.map()` and `.filter()`, replace generators with async iterators, and substitute standard-library modules such as `os` and `json` with Node.js equivalents or browser APIs.",
    diffs: [
      { category: 'Block syntax',    from: 'Indentation + colon define blocks. No braces required.',           to: 'Curly braces delimit blocks. Indentation is stylistic only.' },
      { category: 'Type system',     from: 'Dynamic; PEP 484 type hints are optional and ignored at runtime.', to: 'Dynamic; TypeScript superset adds compile-time enforcement.' },
      { category: 'Async model',     from: 'asyncio event loop; threading for CPU-bound work (GIL applies).',  to: 'Single-threaded event loop; Promises and async/await are native.' },
      { category: 'Collections',     from: 'list, dict, set, tuple with built-in list comprehensions.',        to: 'Array, Object, Map, Set. No tuples; destructuring fills the gap.' },
      { category: 'Null sentinel',   from: 'None is the single null value. Falsy alongside 0 and "".',         to: 'Two null values: null (intentional) and undefined (unset).' },
    ],
    examples: [
      {
        title: 'Filter and transform a list',
        description: 'Python list comprehensions map directly to JavaScript Array.filter + Array.map chains.',
        fromCode:
`# Filter even numbers, then square them
numbers = [1, 2, 3, 4, 5, 6, 7, 8]

result = [n ** 2 for n in numbers if n % 2 == 0]
print(result)  # [4, 16, 36, 64]`,
        toCode:
`// Filter even numbers, then square them
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n ** 2);
console.log(result);  // [4, 16, 36, 64]`,
      },
      {
        title: 'Simple class with a method',
        description: 'Python __init__ maps to JS constructor; f-strings become string concatenation or template literals.',
        fromCode:
`class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> float:
        self.balance += amount
        return self.balance

    def __repr__(self) -> str:
        return f"Account({self.owner}: {self.balance})"`,
        toCode:
`class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }

  toString() {
    return 'Account(' + this.owner + ': ' + this.balance + ')';
  }
}`,
      },
    ],
    tips: [
      { title: 'Comprehensions → Array methods', body: 'Replace [x for x in items if cond] with items.filter(x => cond).map(x => transform). For dict comprehensions use Object.fromEntries.' },
      { title: 'None / True / False literals', body: 'Python\'s None, True, False become null/undefined, true, false. Pay attention to falsy differences: 0 and "" are falsy in both, but undefined only exists in JS.' },
      { title: 'f-strings → template literals', body: 'f"Hello {name}" becomes the JS template literal with backtick syntax. Escape any literal backticks in your strings.' },
      { title: 'Exception handling', body: 'Python\'s except ExceptionType maps to catch (e) — JS has no checked exceptions. Use instanceof for type-narrowing: if (e instanceof TypeError).' },
    ],
  },

  // ── javascript → python ───────────────────────────────────────────────────
  'javascript-python': {
    intro: "JavaScript's asynchronous callback and Promise model contrasts sharply with Python's synchronous-first style and `asyncio` library. Converting JavaScript to Python means replacing arrow functions with `def` or `lambda`, translating `Promise.all` to `asyncio.gather`, and swapping prototype-based class patterns for Python's class inheritance. Python's strict indentation replaces JavaScript's curly-brace blocks.",
    diffs: [
      { category: 'Async paradigm',  from: 'Promises + async/await over a non-blocking event loop.',              to: 'asyncio with async/await; use threading or multiprocessing for CPU work.' },
      { category: 'Module system',   from: 'ES Modules (import/export) or CommonJS (require). Config in package.json.', to: 'Unified import system. Third-party packages managed via pip + pyproject.toml.' },
      { category: 'Null semantics',  from: 'null (intentional absence) and undefined (unset variable) coexist.',  to: 'Only None. No undefined — accessing a missing key raises KeyError.' },
      { category: 'Iteration',       from: 'for...of, for...in (keys), forEach, and Array methods.',               to: 'for, for...in (values), enumerate(), and list comprehensions.' },
      { category: 'Error model',     from: 'throw/catch with Error objects. No checked exceptions.',               to: 'raise/except with an exception hierarchy. Exception chaining via from.' },
    ],
    examples: [
      {
        title: 'Async HTTP request',
        description: 'JS fetch/Promise chains translate to Python httpx or aiohttp with async/await syntax.',
        fromCode:
`async function fetchUser(id) {
  try {
    const res = await fetch('/api/users/' + id);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
    return null;
  }
}`,
        toCode:
`import httpx

async def fetch_user(id: int):
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"/api/users/{id}")
            res.raise_for_status()
            return res.json()
    except httpx.HTTPStatusError as e:
        print(f"Failed: {e}")
        return None`,
      },
      {
        title: 'Filter and reshape an array of objects',
        description: 'JS filter+map chains become Python list comprehensions with dict access.',
        fromCode:
`const users = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob',   age: 22, active: false },
  { name: 'Carol', age: 28, active: true },
];

const names = users
  .filter(u => u.active && u.age >= 25)
  .map(u => u.name);

console.log(names);  // ['Alice', 'Carol']`,
        toCode:
`users = [
    {"name": "Alice", "age": 30, "active": True},
    {"name": "Bob",   "age": 22, "active": False},
    {"name": "Carol", "age": 28, "active": True},
]

names = [
    u["name"] for u in users
    if u["active"] and u["age"] >= 25
]

print(names)  # ['Alice', 'Carol']`,
      },
    ],
    tips: [
      { title: 'Promise.all → asyncio.gather', body: 'Replace Promise.all([p1, p2]) with await asyncio.gather(coro1(), coro2()). Both run coroutines concurrently and return results as a list.' },
      { title: 'Arrow functions → lambda / def', body: 'Single-expression arrows become lambdas: x => x * 2 → lambda x: x * 2. Multi-statement function bodies need a full def.' },
      { title: 'Template literals → f-strings', body: 'JS template literals use backticks with ${expr}. Python f-strings use f"..." with {expr}. The semantics are nearly identical.' },
      { title: 'null / undefined → None', body: 'Python has only None. JS code that checks for undefined needs to be rewritten as attribute existence checks (hasattr) or dict .get() calls.' },
    ],
  },

  // ── python → typescript ───────────────────────────────────────────────────
  'python-typescript': {
    intro: "Python and TypeScript share a commitment to developer productivity, but their type systems differ fundamentally — Python's type hints are optional and runtime-ignored, while TypeScript enforces structural typing at compile time. When converting, Python's `dict`, `list`, and `Optional` type hints map to TypeScript interfaces, generics, and union types. Python dataclasses translate naturally to TypeScript interfaces or classes with typed properties.",
    diffs: [
      { category: 'Type enforcement', from: 'Type hints (PEP 484) are optional and ignored at runtime.',              to: 'Types are enforced at compile time by tsc. Violations are build errors.' },
      { category: 'Interface model',  from: 'Protocols define structural interfaces (PEP 544). Abstract base classes too.', to: 'interface and type alias define structural contracts enforced by the compiler.' },
      { category: 'Null handling',    from: 'Optional[X] = Union[X, None]. None is a valid value of any type by default.', to: 'X | null or X | undefined. Strict mode requires explicit null narrowing.' },
      { category: 'Generics',         from: 'TypeVar and Generic[T] for parameterised classes. Runtime erasure.',          to: 'Generic syntax <T> on functions, classes, and interfaces. Compile-time only.' },
      { category: 'Compilation',      from: 'Interpreted directly by CPython. No build step.',                             to: 'Transpiled to JavaScript by tsc or bundlers like esbuild/Vite/SWC.' },
    ],
    examples: [
      {
        title: 'Typed function with Optional argument',
        description: 'Python Optional[str] maps to TypeScript string | null. Default values and return types translate directly.',
        fromCode:
`from typing import Optional

def greet(name: str, prefix: Optional[str] = None) -> str:
    if prefix is None:
        return "Hello, " + name
    return prefix + " " + name

print(greet("Alice"))          # Hello, Alice
print(greet("Bob", "Dr."))     # Dr. Bob`,
        toCode:
`function greet(name: string, prefix: string | null = null): string {
  if (prefix === null) {
    return "Hello, " + name;
  }
  return prefix + " " + name;
}

console.log(greet("Alice"));        // Hello, Alice
console.log(greet("Bob", "Dr."));   // Dr. Bob`,
      },
      {
        title: 'Typed dataclass → TypeScript interface + class',
        description: 'Python dataclasses map cleanly to TypeScript interfaces for the shape and classes for behaviour.',
        fromCode:
`from dataclasses import dataclass

@dataclass
class Product:
    id: int
    name: str
    price: float
    in_stock: bool = True

    def discounted(self, pct: float) -> float:
        return self.price * (1 - pct / 100)`,
        toCode:
`interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

class ProductModel implements Product {
  inStock = true;
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}

  discounted(pct: number): number {
    return this.price * (1 - pct / 100);
  }
}`,
      },
    ],
    tips: [
      { title: 'Optional[X] → X | null', body: 'Python Optional[X] means X | None. In TypeScript strict mode write X | null. Enable strictNullChecks to get compile-time null safety equivalent to Python mypy.' },
      { title: 'dict → interface or Record<K,V>', body: 'Python dict[str, int] maps to Record<string, number>. If keys are known, define a TypeScript interface instead for better IDE autocompletion.' },
      { title: 'List[X] → X[] or Array<X>', body: 'Python List[int] becomes number[] or Array<number>. Tuple[int, str] becomes [number, string] — a tuple type in TypeScript.' },
      { title: 'Dataclass → interface + class', body: 'Simple dataclasses with only data become TypeScript interfaces. Add a class wrapper only if you need methods or a constructor with default logic.' },
    ],
  },

  // ── java → python ─────────────────────────────────────────────────────────
  'java-python': {
    intro: "Java's verbose, statically typed class hierarchy stands in sharp contrast to Python's dynamic duck-typing and concise syntax. Porting Java to Python means collapsing boilerplate: Java's getters/setters become plain properties, checked exceptions become try/except blocks, and Java's `ArrayList`/`HashMap` map directly to Python's built-in `list` and `dict`. Java's 10-line class definition often compresses to 3 lines of Python.",
    diffs: [
      { category: 'Verbosity',       from: 'Every variable needs a declared type. Getters/setters are explicit methods.', to: 'Dynamic typing. Properties are plain attributes. 10 lines of Java often becomes 3.' },
      { category: 'Memory',          from: 'JVM garbage collector. Objects allocated on heap explicitly via new.',          to: 'CPython reference counting + cyclic GC. No new keyword.' },
      { category: 'Collections',     from: 'ArrayList, HashMap, HashSet from java.util. Generics required.',              to: 'list, dict, set built into the language. No import needed.' },
      { category: 'Exceptions',      from: 'Checked exceptions must be declared with throws or caught.',                   to: 'All exceptions are unchecked. No throws declaration needed.' },
      { category: 'Entry point',     from: 'public static void main(String[] args) required in a class.',                  to: 'Top-level script or if __name__ == "__main__" guard.' },
    ],
    examples: [
      {
        title: 'Processing a list of objects',
        description: 'Java ArrayList + Iterator loops condense to Python list comprehensions.',
        fromCode:
`import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 1; i <= 8; i++) numbers.add(i);

        List<Integer> evens = new ArrayList<>();
        for (int n : numbers) {
            if (n % 2 == 0) evens.add(n * n);
        }
        System.out.println(evens); // [4, 16, 36, 64]
    }
}`,
        toCode:
`numbers = list(range(1, 9))

evens = [n * n for n in numbers if n % 2 == 0]
print(evens)  # [4, 16, 36, 64]`,
      },
      {
        title: 'Simple class definition',
        description: 'Java\'s verbose POJO collapses to a Python dataclass or a short __init__ class.',
        fromCode:
`public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge()     { return age; }

    public String greet() {
        return "Hi, I'm " + name;
    }
}`,
        toCode:
`from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int

    def greet(self) -> str:
        return f"Hi, I'm {self.name}"`,
      },
    ],
    tips: [
      { title: 'Eliminate getter/setter boilerplate', body: 'Python attributes are public by default. Replace getName()/setName() with plain self.name. Use @property only when you need computed or validated access.' },
      { title: 'ArrayList/HashMap → list/dict', body: 'new ArrayList<String>() becomes []. new HashMap<String, Integer>() becomes {}. All operations (add, get, size) map to list.append, dict[key], len().' },
      { title: 'Checked exceptions → try/except', body: 'Remove throws declarations entirely. Wrap risky operations in try/except. Catch specific exception types: except ValueError, except IOError, etc.' },
      { title: 'Static utilities → module functions', body: 'Java static utility classes (StringUtils, MathHelper) become plain Python module-level functions. No class wrapper needed for utility logic.' },
    ],
  },

  // ── javascript → typescript ───────────────────────────────────────────────
  'javascript-typescript': {
    intro: "TypeScript is a strict superset of JavaScript, so most JavaScript code is valid TypeScript — but the value comes from adding type annotations. Converting JavaScript to TypeScript means introducing interface and type declarations, annotating function parameters and return types, replacing `any`-typed patterns with proper generics, and enabling strict null checks. The result catches entire classes of runtime bugs at compile time.",
    diffs: [
      { category: 'Type safety',    from: 'No types. Errors appear at runtime when values have unexpected shapes.', to: 'Static type checking catches shape mismatches at compile time.' },
      { category: 'Tooling',        from: 'IDE hints rely on JSDoc comments or type inference from assignment.',    to: 'Rich autocomplete, refactoring, and error highlighting from the type graph.' },
      { category: 'Interfaces',     from: 'Objects are plain. Duck typing is implicit and unchecked.',              to: 'interface and type alias define explicit structural contracts.' },
      { category: 'Null handling',  from: 'Null/undefined errors are the most common runtime crash source.',       to: 'strictNullChecks forces you to handle null before using a value.' },
      { category: 'Generics',       from: 'Functions work on any type. No way to express parameterised behaviour.', to: 'Generics <T> let you write type-safe reusable utilities like Array<T>.' },
    ],
    examples: [
      {
        title: 'Adding types to a function',
        description: 'TypeScript parameter and return type annotations catch argument mismatches at build time.',
        fromCode:
`// JavaScript - no type safety
function calculateTotal(items, taxRate) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  return subtotal + subtotal * taxRate;
}`,
        toCode:
`// TypeScript - compile-time checked
interface LineItem {
  price: number;
  qty: number;
}

function calculateTotal(
  items: LineItem[],
  taxRate: number
): number {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  return subtotal + subtotal * taxRate;
}`,
      },
      {
        title: 'Extracting an interface from an API response',
        description: 'Untyped fetch results gain compile-time shape guarantees through a response interface.',
        fromCode:
`// JavaScript
async function getUser(id) {
  const res = await fetch('/api/users/' + id);
  const user = await res.json();
  return user.name.toUpperCase(); // crashes if name missing
}`,
        toCode:
`// TypeScript
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise<string> {
  const res = await fetch('/api/users/' + id);
  const user: User = await res.json();
  return user.name.toUpperCase(); // safe — name is required
}`,
      },
    ],
    tips: [
      { title: 'Start with noImplicitAny', body: 'Enable noImplicitAny in tsconfig first. This forces you to annotate any intentionally. From there, add strictNullChecks once nulls are handled.' },
      { title: 'Replace any with unknown', body: 'When you truly don\'t know a type, prefer unknown over any. unknown forces you to narrow the type before using it, preventing silent bugs.' },
      { title: 'Extract interfaces from usage', body: 'For every object shape passed to multiple functions, extract an interface. This is the highest-ROI refactor when migrating a JavaScript codebase.' },
      { title: 'Use satisfies for literal objects', body: 'The satisfies operator validates an object against a type without widening it. Ideal for config objects where you want both type safety and inferred literal types.' },
    ],
  },

  // ── typescript → javascript ───────────────────────────────────────────────
  'typescript-javascript': {
    intro: "Stripping TypeScript to JavaScript means removing type annotations, interface declarations, generics, and enum definitions while preserving all runtime logic unchanged. The resulting JavaScript runs anywhere without a build step, which is useful for lightweight scripts, serverless functions with cold-start constraints, or open-source libraries targeting the broadest possible audience.",
    diffs: [
      { category: 'Build step',    from: 'Requires tsc, esbuild, SWC, or a bundler before code can run.',             to: 'Runs directly in Node.js, Deno, or the browser. Zero build step.' },
      { category: 'Type safety',   from: 'Compile-time type checking catches bugs before runtime.',                     to: 'All type errors become runtime errors. Defensive checks must be manual.' },
      { category: 'Syntax',        from: 'Type annotations, interfaces, generics, and enums extend JS syntax.',         to: 'Pure ECMAScript. No annotations; only language features supported by the runtime.' },
      { category: 'Refactoring',   from: 'IDE can safely rename across the codebase using the type graph.',             to: 'Renames rely on text search. Cross-file safety not guaranteed.' },
      { category: 'Distribution',  from: 'Ship .d.ts declaration files so consumers get type safety.',                  to: 'Ship plain .js. Add JSDoc comments for lightweight IDE support.' },
    ],
    examples: [
      {
        title: 'Stripping types from a typed function',
        description: 'Remove all annotations, interfaces, and generic parameters — the runtime logic is unchanged.',
        fromCode:
`interface User { id: number; name: string }

function findUser(
  users: User[],
  id: number
): User | undefined {
  return users.find(u => u.id === id);
}`,
        toCode:
`// No interface, no type annotations
function findUser(users, id) {
  return users.find(u => u.id === id);
}`,
      },
      {
        title: 'Removing an enum',
        description: 'TypeScript enums have no JavaScript equivalent — replace with const objects or plain string literals.',
        fromCode:
`enum Direction {
  Up    = 'UP',
  Down  = 'DOWN',
  Left  = 'LEFT',
  Right = 'RIGHT',
}

function move(dir: Direction): void {
  console.log('Moving:', dir);
}`,
        toCode:
`// Const object replaces enum at zero runtime cost
const Direction = /** @type {const} */ ({
  Up:    'UP',
  Down:  'DOWN',
  Left:  'LEFT',
  Right: 'RIGHT',
});

function move(dir) {
  console.log('Moving:', dir);
}`,
      },
    ],
    tips: [
      { title: 'Remove annotations systematically', body: 'Strip type annotations (: Type) from function params, return types, and variable declarations. Then remove interface, type, and enum declarations.' },
      { title: 'Replace enums with const objects', body: 'TypeScript enums compile to IIFEs. In JS, a plain const object with Object.freeze() gives the same semantics with no overhead.' },
      { title: 'Add JSDoc for IDE hints', body: 'If consumers need IDE support, add @param and @returns JSDoc comments. VS Code reads them for autocompletion without requiring TypeScript.' },
      { title: 'Add runtime null guards', body: 'TypeScript\'s strictNullChecks were catching nulls at compile time. In JS, add explicit if (value == null) guards wherever the TS compiler was protecting you.' },
    ],
  },

  // ── python → go ───────────────────────────────────────────────────────────
  'python-go': {
    intro: "Python's dynamic typing and interpreted runtime trade raw speed for development velocity; Go's compiled, statically typed runtime inverts that trade-off. Converting Python to Go requires explicitly typing every variable and function signature, replacing Python's exception handling with Go's idiomatic `error` return values, and restructuring goroutine-friendly concurrency patterns in place of Python threads or `asyncio`. Python's `dict` becomes Go's `map`, and slices replace lists.",
    diffs: [
      { category: 'Type system',    from: 'Dynamic; type hints optional and unenforced at runtime.',                to: 'Static; every variable and parameter must have a declared type.' },
      { category: 'Error handling', from: 'Exceptions raised with raise; caught with try/except.',                  to: 'Errors returned as second return value. No exceptions (except panic for fatal bugs).' },
      { category: 'Concurrency',    from: 'asyncio for I/O; threading constrained by GIL for CPU work.',           to: 'Goroutines are lightweight threads multiplexed over OS threads. No GIL.' },
      { category: 'Collections',    from: 'list, dict, set are built-in dynamic types.',                            to: 'slice ([]T), map[K]V. No built-in set — use map[T]struct{}.' },
      { category: 'Compilation',    from: 'Interpreted; startup is fast but steady-state throughput is lower.',    to: 'Compiled to a single static binary. Fast startup, lower memory, high throughput.' },
    ],
    examples: [
      {
        title: 'Function with error return',
        description: 'Python exceptions become Go\'s idiomatic (value, error) double return pattern.',
        fromCode:
`def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("division by zero")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print("Error:", e)`,
        toCode:
`import "errors"
import "fmt"

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    fmt.Println("Error:", err)
}`,
      },
      {
        title: 'Struct vs Python class',
        description: 'Python classes with methods translate to Go structs with receiver functions.',
        fromCode:
`class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)`,
        toCode:
`type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}`,
      },
    ],
    tips: [
      { title: 'Replace exceptions with error returns', body: 'Every function that can fail should return (T, error). Callers check if err != nil before using the result. Use fmt.Errorf("context: %w", err) to wrap errors with context.' },
      { title: 'list → slice, dict → map', body: 'Python list becomes []T (e.g. []int). Python dict[str]int becomes map[string]int. Initialize maps with make(map[string]int) before writing to them.' },
      { title: 'No list comprehensions', body: 'Go has no comprehension syntax. Replace [x for x in items if cond] with a for range loop that appends to a pre-allocated slice: result = append(result, x).' },
      { title: 'Goroutines for concurrency', body: 'Python\'s asyncio.gather maps to launching goroutines with go func() and collecting results via a sync.WaitGroup or channels.' },
    ],
  },

  // ── go → python ───────────────────────────────────────────────────────────
  'go-python': {
    intro: "Go's explicit error returns, goroutines, and static typing give way to Python's exceptions, `asyncio`, and dynamic runtime when porting in this direction. Go's `struct` types map to Python dataclasses or plain classes, goroutines can be approximated with `asyncio` tasks or `threading.Thread`, and Go's interface-based polymorphism translates to Python's duck-typed protocols. The resulting Python is typically far shorter but trades compile-time safety for runtime flexibility.",
    diffs: [
      { category: 'Error handling', from: 'Explicit (value, error) returns. Callers must check err != nil.',           to: 'Exceptions raised and propagated automatically. try/except at the boundary.' },
      { category: 'Typing',         from: 'Static; every symbol has a concrete type known at compile time.',           to: 'Dynamic; duck typing. Optional hints with mypy for static analysis.' },
      { category: 'Concurrency',    from: 'Goroutines + channels are first-class. Scheduler is part of the runtime.',  to: 'asyncio for I/O; threading for CPU (limited by GIL). Multiprocessing for true parallelism.' },
      { category: 'Collections',    from: 'slice ([]T), map[K]V. Set is map[T]struct{}.',                              to: 'list, dict, set are built-in. Comprehensions for inline creation.' },
      { category: 'OOP model',      from: 'Composition via struct embedding. No inheritance. Interfaces are implicit.', to: 'Class hierarchy with explicit inheritance. Multiple inheritance supported.' },
    ],
    examples: [
      {
        title: 'Error return → exception',
        description: 'Go\'s (result, error) pattern collapses into a Python function that raises on failure.',
        fromCode:
`func readConfig(path string) (map[string]string, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("readConfig: %w", err)
    }
    // ... parse and return config
    return config, nil
}`,
        toCode:
`def read_config(path: str) -> dict[str, str]:
    try:
        with open(path) as f:
            data = f.read()
        # ... parse and return config
        return config
    except OSError as e:
        raise RuntimeError(f"read_config: {e}") from e`,
      },
      {
        title: 'Struct + receiver → dataclass + method',
        description: 'Go struct definitions and receiver methods translate directly to Python dataclasses.',
        fromCode:
`type Point struct {
    X, Y float64
}

func (p Point) Distance(other Point) float64 {
    dx := p.X - other.X
    dy := p.Y - other.Y
    return math.Sqrt(dx*dx + dy*dy)
}`,
        toCode:
`import math
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def distance(self, other: "Point") -> float:
        dx = self.x - other.x
        dy = self.y - other.y
        return math.sqrt(dx**2 + dy**2)`,
      },
    ],
    tips: [
      { title: '(value, error) → exceptions', body: 'Go\'s if err != nil patterns become try/except blocks. Wrapping errors with fmt.Errorf("ctx: %w", err) translates to raise RuntimeError("ctx") from e.' },
      { title: 'Struct → dataclass or class', body: 'Simple Go structs become @dataclass. Structs with complex receiver methods become regular classes. Go\'s struct embedding maps to Python composition (self.inner = Inner()).' },
      { title: 'Goroutines → asyncio.gather', body: 'Multiple goroutines collecting into a channel translate to async def functions run with asyncio.gather(). Use asyncio.Queue instead of channels.' },
      { title: 'Interface → Protocol', body: 'Go interfaces (implicit satisfaction) map to Python typing.Protocol. Any class implementing the required methods satisfies it without explicit declaration.' },
    ],
  },

  // ── python → rust ─────────────────────────────────────────────────────────
  'python-rust': {
    intro: "Rust's ownership model and borrow checker represent a fundamentally different memory management philosophy from Python's garbage collector. When porting Python to Rust, every variable must have a defined lifetime, `list` becomes `Vec<T>`, `dict` becomes `HashMap<K, V>`, and Python exceptions are replaced with Rust's `Result<T, E>` type. The gain is predictable, zero-overhead performance with memory safety guarantees and no GC pauses.",
    diffs: [
      { category: 'Memory model',   from: 'Garbage collected via reference counting (CPython). No manual memory.',    to: 'Ownership + borrow checker. Compile-time memory safety. No GC pauses.' },
      { category: 'Error handling', from: 'Exceptions with try/except. Arbitrary nesting allowed.',                   to: 'Result<T, E> and Option<T>. Errors are values, not control flow.' },
      { category: 'Type system',    from: 'Dynamic. Type hints optional and unenforced at runtime.',                  to: 'Static, expressive, with algebraic data types (enum with data), traits, and lifetimes.' },
      { category: 'Collections',    from: 'list (dynamic), dict (hash map), set — all built-in and zero friction.',   to: 'Vec<T>, HashMap<K,V>, HashSet<T> from std::collections. Must import explicitly.' },
      { category: 'Performance',    from: 'Interpreted; CPython has GIL. Typically 10–100x slower than Rust.',       to: 'Compiled to native code. Zero-cost abstractions. Comparable to C/C++ throughput.' },
    ],
    examples: [
      {
        title: 'Function with fallible return',
        description: 'Python exceptions map to Rust\'s Result<T, E>. The ? operator propagates errors ergonomically.',
        fromCode:
`def parse_positive(s: str) -> int:
    n = int(s)          # raises ValueError if not a number
    if n <= 0:
        raise ValueError(f"Expected positive, got {n}")
    return n`,
        toCode:
`use std::num::ParseIntError;

fn parse_positive(s: &str) -> Result<u32, String> {
    let n: i64 = s.parse().map_err(|e: ParseIntError| e.to_string())?;
    if n <= 0 {
        return Err(format!("Expected positive, got {}", n));
    }
    Ok(n as u32)
}`,
      },
      {
        title: 'Struct and implementation block',
        description: 'Python classes map to Rust struct + impl blocks. The derive macro generates boilerplate.',
        fromCode:
`from dataclasses import dataclass

@dataclass
class Rectangle:
    width: float
    height: float

    def area(self) -> float:
        return self.width * self.height

    def is_square(self) -> bool:
        return self.width == self.height`,
        toCode:
`#[derive(Debug, Clone)]
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn is_square(&self) -> bool {
        (self.width - self.height).abs() < f64::EPSILON
    }
}`,
      },
    ],
    tips: [
      { title: 'Wrap return values in Result/Option', body: 'Every function that can fail returns Result<T, E>. Functions that may return nothing return Option<T>. Use the ? operator to propagate errors up the call stack.' },
      { title: 'list → Vec<T>', body: 'Python list becomes Vec<T>. Literal [1,2,3] becomes vec![1,2,3]. list.append(x) becomes vec.push(x). list comprehensions become .iter().filter().map().collect().' },
      { title: 'dict → HashMap<K,V>', body: 'Python dict becomes std::collections::HashMap<K,V>. Must be imported. Initialize with HashMap::new() or the hashmap! macro from external crates.' },
      { title: 'String vs &str', body: 'Python str maps to both: String (owned, heap-allocated) and &str (borrowed string slice). Function parameters usually accept &str; owned storage uses String.' },
    ],
  },

  // ── rust → python ─────────────────────────────────────────────────────────
  'rust-python': {
    intro: "Rewriting Rust in Python prioritises developer ergonomics and iteration speed over Rust's zero-cost abstractions and memory-safety guarantees. Rust's ownership and lifetimes disappear — Python's garbage collector handles memory automatically. Rust's `Result` and `Option` types map to Python's exception handling and `None`. The tradeoff is reduced performance and no compile-time memory safety, but significantly faster development and a much shorter codebase.",
    diffs: [
      { category: 'Memory model',   from: 'Ownership + borrow checker. No GC. Compile-time lifetime enforcement.', to: 'Garbage collected (reference counting). No manual memory management.' },
      { category: 'Error handling', from: 'Result<T,E> and Option<T> as return values. ? operator for propagation.', to: 'Exceptions. try/except at boundaries. No checked errors.' },
      { category: 'Performance',    from: 'Native code, zero-cost abstractions. Predictable low latency.',           to: 'Interpreted; CPython GIL limits CPU parallelism. ~10–100x slower.' },
      { category: 'Verbosity',      from: 'Explicit ownership annotations, lifetimes, and trait bounds.',            to: 'Terse. Variables are dynamic. No lifetime annotations.' },
      { category: 'Concurrency',    from: 'Fearless concurrency: send/sync traits prevent data races at compile time.', to: 'GIL prevents true thread parallelism. Use multiprocessing for CPU parallelism.' },
    ],
    examples: [
      {
        title: 'Result → exception',
        description: 'Rust\'s match on Result translates to Python\'s try/except with the same branching logic.',
        fromCode:
`fn read_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>().map_err(|e| e.to_string())
}

match read_number("42") {
    Ok(n)  => println!("Got: {}", n),
    Err(e) => eprintln!("Error: {}", e),
}`,
        toCode:
`def read_number(s: str) -> int:
    try:
        return int(s)
    except ValueError as e:
        raise ValueError(str(e)) from e

try:
    n = read_number("42")
    print(f"Got: {n}")
except ValueError as e:
    print(f"Error: {e}", file=sys.stderr)`,
      },
      {
        title: 'Struct + impl → class',
        description: 'Rust structs with impl blocks map directly to Python classes. Drop ownership annotations entirely.',
        fromCode:
`struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Self {
        Counter { count: 0, max }
    }
    fn increment(&mut self) -> Option<u32> {
        if self.count < self.max {
            self.count += 1;
            Some(self.count)
        } else { None }
    }
}`,
        toCode:
`class Counter:
    def __init__(self, max_val: int):
        self.count = 0
        self.max = max_val

    def increment(self) -> int | None:
        if self.count < self.max:
            self.count += 1
            return self.count
        return None`,
      },
    ],
    tips: [
      { title: 'Drop ownership annotations', body: 'Remove all lifetime annotations, &, &mut, and ownership transfers. Python\'s GC handles all of that. Variables are freely sharable without borrow constraints.' },
      { title: 'Result/Option → exceptions/None', body: 'Replace Ok(val)/Err(e) returns with plain returns and raise. Replace Option<T> with returning None directly. Match on Result becomes try/except.' },
      { title: 'Vec → list, HashMap → dict', body: 'vec![1,2,3] becomes [1,2,3]. HashMap::new() becomes {}. push/insert become .append()/{} assignment. iter().filter().collect() becomes list comprehensions.' },
      { title: 'Traits → duck typing or Protocol', body: 'Rust trait bounds (T: Display + Clone) become Python duck typing — just call the method. For explicit contracts, use typing.Protocol.' },
    ],
  },

  // ── java → javascript ─────────────────────────────────────────────────────
  'java-javascript': {
    intro: "Java's JVM-based, class-centric object model is architecturally different from JavaScript's prototype chain and event-loop runtime. Converting Java to JavaScript means replacing interfaces with duck typing or TypeScript interfaces, mapping Java's threading model to JavaScript's async/await, and replacing Java's `ArrayList`/`HashMap` with native arrays and objects. Java's checked exceptions translate to try/catch with untyped errors.",
    diffs: [
      { category: 'Runtime',        from: 'JVM — cross-platform bytecode interpreted by the Java Virtual Machine.',  to: 'V8 / SpiderMonkey in browsers; Node.js or Deno on the server.' },
      { category: 'OOP model',      from: 'Nominal typing. Classes must explicitly implement or extend.',            to: 'Prototype chain. Duck typing — no implements keyword.' },
      { category: 'Collections',    from: 'ArrayList, HashMap, HashSet from java.util. Generics enforced.',         to: 'Native Array, Object, Map, Set. No generics at runtime.' },
      { category: 'Async',          from: 'CompletableFuture, ExecutorService, synchronized blocks.',                to: 'Promises, async/await, single-threaded event loop.' },
      { category: 'Null safety',    from: 'NullPointerException is the most common runtime crash in Java.',         to: 'null and undefined. Optional chaining (?.) reduces NPE-equivalent bugs.' },
    ],
    examples: [
      {
        title: 'HashMap operations → plain object',
        description: 'Java HashMap with generics translates to a JavaScript plain object or Map.',
        fromCode:
`Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob",   88);

for (Map.Entry<String, Integer> e : scores.entrySet()) {
    System.out.println(e.getKey() + ": " + e.getValue());
}`,
        toCode:
`const scores = { Alice: 95, Bob: 88 };

for (const [name, score] of Object.entries(scores)) {
  console.log(name + ': ' + score);
}`,
      },
      {
        title: 'Interface + implementation → duck typing',
        description: 'Java interfaces become implicit structural contracts in JavaScript.',
        fromCode:
`interface Shape {
    double area();
    double perimeter();
}

class Circle implements Shape {
    private double radius;
    Circle(double r) { this.radius = r; }
    public double area()      { return Math.PI * radius * radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
}`,
        toCode:
`class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  area()      { return Math.PI * this.radius ** 2; }
  perimeter() { return 2 * Math.PI * this.radius; }
}
// Any object with area() + perimeter() satisfies the "Shape" contract`,
      },
    ],
    tips: [
      { title: 'Remove generic declarations', body: 'Java List<String> and Map<String,Integer> generics have no JS equivalent. Remove them — JavaScript arrays and objects are untyped at runtime.' },
      { title: 'Replace checked exceptions', body: 'Java\'s throws declarations and checked exceptions become plain try/catch. No need to declare what errors a function might throw.' },
      { title: 'CompletableFuture → Promise', body: 'Java\'s CompletableFuture.thenApply maps to .then(). exceptionally maps to .catch(). For parallel tasks, use Promise.all() instead of CompletableFuture.allOf().' },
      { title: 'static methods → module functions', body: 'Java static utility methods in a class (StringUtils.trim()) become plain exported functions in a JS module. No class wrapper needed.' },
    ],
  },

  // ── javascript → java ─────────────────────────────────────────────────────
  'javascript-java': {
    intro: "JavaScript's dynamic, single-threaded runtime gives way to Java's strongly typed, multithreaded JVM when converting in this direction. Every variable and return type needs an explicit type declaration, `Promise`-based async patterns become Java's `CompletableFuture` or synchronous blocking calls, and JavaScript's objects become Java classes with defined fields and constructors. Java's verbosity is offset by compile-time correctness guarantees.",
    diffs: [
      { category: 'Typing',         from: 'Dynamic. Types resolved at runtime. No compile step.',                    to: 'Static, nominal typing. Every variable and method needs a declared type.' },
      { category: 'Async',          from: 'Single-threaded event loop. Promises and async/await are idiomatic.',     to: 'Multi-threaded. CompletableFuture for async; ExecutorService for thread pools.' },
      { category: 'OOP model',      from: 'Prototype chain. Functions are objects. No interface keyword.',           to: 'Nominal class hierarchy. interface, abstract class, extends, implements.' },
      { category: 'Module system',  from: 'ES Modules (import/export) or CommonJS (require/module.exports).',       to: 'Packages and imports. Build with Maven or Gradle. No native bundler.' },
      { category: 'Null handling',  from: 'null + undefined, optional chaining (?.), nullish coalescing (??).',     to: 'null only. NullPointerException. Use Optional<T> for explicit absence.' },
    ],
    examples: [
      {
        title: 'Async function → CompletableFuture',
        description: 'JS Promises translate to Java CompletableFuture with method chaining.',
        fromCode:
`async function fetchUser(id) {
  const res  = await fetch('/api/users/' + id);
  const user = await res.json();
  return user.name.toUpperCase();
}

fetchUser(1).then(name => console.log(name));`,
        toCode:
`import java.net.http.*;
import java.util.concurrent.CompletableFuture;

CompletableFuture<String> fetchUser(int id) {
    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("/api/users/" + id)).build();
    return client.sendAsync(req, BodyHandlers.ofString())
        .thenApply(HttpResponse::body)
        .thenApply(body -> parseJson(body).get("name").toUpperCase());
}`,
      },
      {
        title: 'Plain object → Java class',
        description: 'A JavaScript object literal with methods becomes a fully typed Java class.',
        fromCode:
`function createUser(name, age) {
  return {
    name,
    age,
    isAdult() { return this.age >= 18; },
    toString() { return this.name + ' (' + this.age + ')'; },
  };
}`,
        toCode:
`public class User {
    private final String name;
    private final int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public boolean isAdult() { return age >= 18; }

    @Override
    public String toString() {
        return name + " (" + age + ")";
    }
}`,
      },
    ],
    tips: [
      { title: 'Add type declarations everywhere', body: 'Every variable, parameter, and return type needs a type. Start by inferring types from usage, then declare String, int, boolean, List<T>, etc.' },
      { title: 'Promise → CompletableFuture', body: 'async functions return CompletableFuture<T>. .then() maps to .thenApply(). .catch() maps to .exceptionally(). Promise.all becomes CompletableFuture.allOf().' },
      { title: 'Wrap optionals in Optional<T>', body: 'JS functions returning null/undefined should return Optional<T> in Java. Callers then explicitly call .orElse() or .orElseThrow() rather than null-checking.' },
      { title: 'Object literals become classes', body: 'Every { key: value } object needs a corresponding class or record in Java. Records (Java 16+) are the most concise: record User(String name, int age) {}.' },
    ],
  },

  // ── python → java ─────────────────────────────────────────────────────────
  'python-java': {
    intro: "Python's concise, script-friendly syntax expands dramatically when converted to Java's enterprise-grade structure. Python functions become Java class methods, Python's `list` and `dict` map to `ArrayList` and `HashMap`, optional type hints become mandatory type declarations, and Python's `try/except` becomes Java's checked-exception `try/catch` blocks. A single Python file often becomes multiple Java files organized by class hierarchy.",
    diffs: [
      { category: 'Verbosity',      from: 'Functions are first-class. No class wrapper needed for utilities.',       to: 'All code must live in a class. Static methods for utilities.' },
      { category: 'Type system',    from: 'Dynamic. Hints optional.',                                                to: 'Static, nominal. Every parameter and return type required.' },
      { category: 'Collections',    from: 'list, dict, set are built-in; no import needed.',                        to: 'ArrayList, HashMap, HashSet from java.util. Generics required.' },
      { category: 'Exceptions',     from: 'All exceptions unchecked. No throws declaration.',                        to: 'Checked exceptions require throws or catch. Runtime exceptions are unchecked.' },
      { category: 'Boilerplate',    from: 'Dataclass or plain class. __init__ for initialization.',                  to: 'Full POJO: private fields, constructor, getters, setters, equals, hashCode.' },
    ],
    examples: [
      {
        title: 'Module-level function → static method in a class',
        description: 'Python top-level functions must be wrapped in a Java class as static methods.',
        fromCode:
`def is_palindrome(s: str) -> bool:
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

print(is_palindrome("A man a plan a canal Panama"))`,
        toCode:
`public class StringUtils {
    public static boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replace(" ", "");
        String reversed = new StringBuilder(cleaned).reverse().toString();
        return cleaned.equals(reversed);
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man a plan a canal Panama"));
    }
}`,
      },
      {
        title: 'Python list operations → ArrayList',
        description: 'Python\'s built-in list methods have direct ArrayList equivalents.',
        fromCode:
`items = ["apple", "banana", "cherry"]
items.append("date")
items.remove("banana")
filtered = [x for x in items if len(x) > 5]
print(filtered)  # ['banana' removed, so: ['cherry', 'date']... ]`,
        toCode:
`import java.util.*;
import java.util.stream.*;

List<String> items = new ArrayList<>(
    Arrays.asList("apple", "banana", "cherry"));
items.add("date");
items.remove("banana");
List<String> filtered = items.stream()
    .filter(x -> x.length() > 5)
    .collect(Collectors.toList());
System.out.println(filtered);`,
      },
    ],
    tips: [
      { title: 'Every function needs a class', body: 'Java has no module-level functions. Wrap utilities in a class with static methods, or create proper object-oriented classes with instance methods.' },
      { title: 'list → ArrayList, dict → HashMap', body: 'Python list becomes ArrayList<T>. Python dict[K]V becomes HashMap<K,V>. All collection operations need java.util imports and generic type parameters.' },
      { title: 'Optional hints → required types', body: 'Python type hints become mandatory Java declarations. Every method parameter needs a type. Return void explicitly when there is no return value.' },
      { title: 'Dataclass → Java record (Java 16+)', body: 'Python dataclasses map cleanly to Java records: record Person(String name, int age) {} generates constructor, getters, equals, hashCode automatically.' },
    ],
  },

  // ── java → go ─────────────────────────────────────────────────────────────
  'java-go': {
    intro: "Java's JVM ecosystem and object-oriented class hierarchy contrast with Go's lean compiled runtime and structural typing. Converting Java to Go replaces abstract classes and interfaces with Go interfaces (defined by method sets, not inheritance), maps Java's thread-pool executor to goroutines and channels, and substitutes Java's checked exceptions with Go's explicit `(value, error)` return convention. The result is typically leaner, faster, and more explicit.",
    diffs: [
      { category: 'OOP model',      from: 'Nominal typing; abstract classes, explicit implements, extends.',        to: 'Structural typing; interfaces satisfied implicitly by method sets. No inheritance.' },
      { category: 'Error handling', from: 'Checked exceptions declared with throws. try/catch/finally.',            to: 'Errors as return values. No exceptions. defer for cleanup.' },
      { category: 'Concurrency',    from: 'Threads, synchronized, ExecutorService, CompletableFuture.',             to: 'Goroutines + channels. Lightweight (4 KB stack). Scheduler built into runtime.' },
      { category: 'Memory',         from: 'JVM heap with generational GC. Objects always on heap.',                 to: 'GC but compiler can stack-allocate via escape analysis. Smaller runtime footprint.' },
      { category: 'Binary',         from: 'JVM bytecode; requires JRE. Fat JARs for distribution.',                to: 'Single statically-linked binary. No runtime dependency.' },
    ],
    examples: [
      {
        title: 'Interface implementation',
        description: 'Java\'s explicit implements becomes implicit structural satisfaction in Go.',
        fromCode:
`interface Animal {
    String speak();
    String name();
}

class Dog implements Animal {
    private String name;
    Dog(String name) { this.name = name; }
    public String speak() { return "Woof!"; }
    public String name()  { return name; }
}`,
        toCode:
`type Animal interface {
    Speak() string
    Name()  string
}

type Dog struct{ name string }

func (d Dog) Speak() string { return "Woof!" }
func (d Dog) Name()  string { return d.name }

// Dog implicitly satisfies Animal — no declaration needed`,
      },
      {
        title: 'Checked exception → error return',
        description: 'Java throws IOException becomes Go\'s (T, error) return pattern with defer for cleanup.',
        fromCode:
`public String readFile(String path) throws IOException {
    try (BufferedReader r = new BufferedReader(
            new FileReader(path))) {
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = r.readLine()) != null)
            sb.append(line).append('\n');
        return sb.toString();
    }
}`,
        toCode:
`func readFile(path string) (string, error) {
    f, err := os.Open(path)
    if err != nil {
        return "", fmt.Errorf("readFile: %w", err)
    }
    defer f.Close()
    data, err := io.ReadAll(f)
    if err != nil {
        return "", fmt.Errorf("readFile: %w", err)
    }
    return string(data), nil
}`,
      },
    ],
    tips: [
      { title: 'Replace class hierarchy with composition', body: 'Java\'s extends becomes embedding: type Manager struct { Employee }. Go favours composition over inheritance — embed structs to reuse behaviour.' },
      { title: 'throws → (T, error) returns', body: 'Remove all throws declarations. Every function that can fail returns (value, error). Callers check if err != nil immediately after the call.' },
      { title: 'ExecutorService → goroutines', body: 'Java thread pools map to go func() {...}. Use sync.WaitGroup to wait for completion and buffered channels to limit concurrency.' },
      { title: 'finally → defer', body: 'Java\'s finally block (for cleanup) maps to defer in Go. defer f.Close() runs when the surrounding function returns, regardless of how it exits.' },
    ],
  },

  // ── cpp → python ──────────────────────────────────────────────────────────
  'cpp-python': {
    intro: "C++ requires manual memory management, explicit type declarations, and compile-time resolution — Python automates all of that. Porting C++ to Python means replacing `new`/`delete` with Python's garbage collector, translating pointer arithmetic to list indexing, converting C++ templates to Python generics or duck-typed functions, and replacing `std::vector`/`std::map` with `list`/`dict`. Header files disappear entirely.",
    diffs: [
      { category: 'Memory',         from: 'Manual new/delete or RAII smart pointers. Destructors run deterministically.', to: 'Garbage collected. Reference counting via CPython. No delete.' },
      { category: 'Typing',         from: 'Static, strong. Every variable has a compile-time type.',                to: 'Dynamic, duck-typed. Type hints optional. No compile step.' },
      { category: 'Compilation',    from: 'Compiled to native machine code. Headers + source files.',                to: 'Interpreted. Single file per module. No headers.' },
      { category: 'Collections',    from: 'std::vector, std::map, std::set from <vector>, <map>.',                  to: 'list, dict, set built-in. Comprehensions for inline creation.' },
      { category: 'Error handling', from: 'try/catch with exception types; error codes common in C-style APIs.',    to: 'Exceptions only. No error codes. try/except at the boundary.' },
    ],
    examples: [
      {
        title: 'Vector operations',
        description: 'C++ std::vector maps directly to Python list. Iterator loops become comprehensions.',
        fromCode:
`#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> nums = {1,2,3,4,5,6,7,8};
    std::vector<int> evens;
    std::copy_if(nums.begin(), nums.end(),
        std::back_inserter(evens),
        [](int n){ return n % 2 == 0; });
    for (int n : evens) std::cout << n << " ";
}`,
        toCode:
`nums = [1, 2, 3, 4, 5, 6, 7, 8]
evens = [n for n in nums if n % 2 == 0]
print(*evens)`,
      },
      {
        title: 'Class with constructor and method',
        description: 'C++ class with explicit constructor and destructor translates to a Python class — GC handles cleanup.',
        fromCode:
`class Rectangle {
    double width, height;
public:
    Rectangle(double w, double h)
        : width(w), height(h) {}
    ~Rectangle() {}  // trivial destructor

    double area()      const { return width * height; }
    double perimeter() const { return 2*(width+height); }
};`,
        toCode:
`class Rectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    # No destructor needed — GC handles cleanup

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)`,
      },
    ],
    tips: [
      { title: 'Delete memory management', body: 'Remove all new, delete, and smart pointer (unique_ptr, shared_ptr) declarations. Python\'s garbage collector handles deallocation automatically.' },
      { title: 'Remove header files', body: 'C++ separates declaration (.h) from implementation (.cpp). Python has none of that — everything lives in a single .py file. Merge headers into the module.' },
      { title: 'std::vector → list, std::map → dict', body: 'Replace all STL containers with Python built-ins. vector<T> → list, map<K,V> → dict, unordered_set<T> → set, pair<A,B> → tuple.' },
      { title: 'Remove const and & from signatures', body: 'C++ const T& parameters become plain Python parameters. Python passes objects by reference automatically — no & needed.' },
    ],
  },

  // ── python → cpp ──────────────────────────────────────────────────────────
  'python-cpp': {
    intro: "Python's dynamic, garbage-collected runtime is replaced by C++'s manual memory model and compile-time type system when porting in this direction. Python lists become `std::vector<T>`, dicts become `std::unordered_map<K, V>`, and Python exceptions map to C++ exception classes or error codes. Developers gain deterministic performance and direct hardware access at the cost of significantly more verbose and complex code.",
    diffs: [
      { category: 'Memory',         from: 'GC handles allocation/deallocation. No pointers.',                       to: 'Manual management or smart pointers (unique_ptr, shared_ptr). RAII idiom.' },
      { category: 'Typing',         from: 'Dynamic; types resolved at runtime.',                                    to: 'Static; every variable needs a type at declaration. Compilation fails otherwise.' },
      { category: 'Build',          from: 'python script.py — no build step.',                                     to: 'Compile: g++/clang++ with include paths, link flags. cmake for large projects.' },
      { category: 'Collections',    from: 'list, dict, set — built-in, zero-overhead to use.',                     to: 'std::vector, std::map/unordered_map, std::set from STL headers.' },
      { category: 'Strings',        from: 'str is a built-in, immutable Unicode sequence.',                        to: 'std::string (mutable, UTF-8 bytes). Literals are const char*.' },
    ],
    examples: [
      {
        title: 'List → std::vector',
        description: 'Python list operations translate to STL vector with explicit types and iterators.',
        fromCode:
`def process(numbers: list[int]) -> list[int]:
    return [n * n for n in numbers if n % 2 == 0]

result = process([1, 2, 3, 4, 5, 6])
print(result)  # [4, 16, 36]`,
        toCode:
`#include <vector>
#include <algorithm>

std::vector<int> process(const std::vector<int>& numbers) {
    std::vector<int> result;
    for (int n : numbers)
        if (n % 2 == 0) result.push_back(n * n);
    return result;
}
// C++20: std::ranges::copy_if + std::transform also works`,
      },
      {
        title: 'Python class → C++ class',
        description: 'Python\'s dynamic class maps to a C++ class with typed fields and explicit constructor/destructor.',
        fromCode:
`class Stack:
    def __init__(self):
        self._items: list = []

    def push(self, item) -> None:
        self._items.append(item)

    def pop(self):
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()`,
        toCode:
`#include <vector>
#include <stdexcept>

template<typename T>
class Stack {
    std::vector<T> items;
public:
    void push(T item) { items.push_back(std::move(item)); }

    T pop() {
        if (items.empty()) throw std::underflow_error("pop from empty stack");
        T top = std::move(items.back());
        items.pop_back();
        return top;
    }
};`,
      },
    ],
    tips: [
      { title: 'Declare types for all variables', body: 'Every Python variable becomes a typed C++ declaration. int x = 5; std::string s = "hello"; Use auto where the type is obvious from the right-hand side.' },
      { title: 'list → std::vector<T>', body: 'Python list translates to std::vector<T>. append→push_back, len→.size(), pop→pop_back. For fixed-size collections consider std::array<T,N>.' },
      { title: 'dict → std::unordered_map<K,V>', body: 'Python dict{} → std::unordered_map<K,V>. For ordered access use std::map<K,V>. Both require #include <unordered_map> or <map>.' },
      { title: 'Exceptions carry over', body: 'Python exceptions translate well to C++ throws. Map ValueError → std::invalid_argument, IndexError → std::out_of_range, RuntimeError → std::runtime_error.' },
    ],
  },

  // ── kotlin → java ─────────────────────────────────────────────────────────
  'kotlin-java': {
    intro: "Kotlin compiles to the same JVM bytecode as Java and is fully interoperable with it, so the conversion is largely syntactic. Kotlin's data classes become Java POJOs with getters/setters/equals/hashCode, `val`/`var` declarations become typed Java fields, extension functions become static utility methods, and Kotlin's null safety (`?` types) maps to Java's `Optional` or `@Nullable` annotations. Kotlin coroutines translate to `CompletableFuture` or `ExecutorService`.",
    diffs: [
      { category: 'Null safety',    from: 'Type system distinguishes nullable (T?) from non-null (T) at compile time.', to: 'All references nullable by default. NPE is a runtime risk. Use Optional<T> or @Nullable.' },
      { category: 'Data classes',   from: 'data class generates equals, hashCode, copy, toString automatically.',      to: 'Record (Java 16+) gives similar benefits; POJO requires manual implementation.' },
      { category: 'Coroutines',     from: 'kotlinx.coroutines: suspend fun, launch, async, flow.',                     to: 'CompletableFuture, ExecutorService, Project Reactor, or Virtual Threads (Java 21+).' },
      { category: 'Extension fns',  from: 'Extension functions add methods to existing types without subclassing.',    to: 'No extension functions. Use static utility methods or wrapper classes.' },
      { category: 'Verbosity',      from: 'val/var, smart casts, when expression, string templates reduce boilerplate.', to: 'More verbose. switch vs when, explicit casts, String.format() for interpolation.' },
    ],
    examples: [
      {
        title: 'Data class → Java record',
        description: 'Kotlin data class with copy() maps to a Java record for immutable value objects.',
        fromCode:
`data class User(
    val id: Int,
    val name: String,
    val email: String,
    val active: Boolean = true,
)

val alice = User(1, "Alice", "alice@example.com")
val updated = alice.copy(active = false)`,
        toCode:
`// Java 16+ record
public record User(
    int id,
    String name,
    String email,
    boolean active
) {
    // No copy() — create new record manually
    User withActive(boolean active) {
        return new User(id, name, email, active);
    }
}`,
      },
      {
        title: 'when expression → switch expression',
        description: 'Kotlin\'s when is an expression; Java\'s switch expression (Java 14+) covers the same cases.',
        fromCode:
`fun describe(n: Int): String = when {
    n < 0  -> "negative"
    n == 0 -> "zero"
    n < 10 -> "small positive"
    else   -> "large positive"
}`,
        toCode:
`String describe(int n) {
    return switch (Integer.signum(n)) {
        case -1 -> "negative";
        case  0 -> "zero";
        default -> n < 10 ? "small positive" : "large positive";
    };
}`,
      },
    ],
    tips: [
      { title: 'Null-safe (?.) → Optional or null check', body: 'Kotlin\'s user?.name becomes Optional.ofNullable(user).map(u -> u.name()).orElse(null) or an explicit if (user != null) guard in Java.' },
      { title: 'suspend fun → CompletableFuture', body: 'Kotlin suspend functions map to Java CompletableFuture<T>. Kotlin\'s launch {} becomes CompletableFuture.runAsync(). Flow<T> maps to Reactive Streams or java.util.concurrent.Flow.' },
      { title: 'Extension functions → static utils', body: 'Kotlin String.truncate() extensions become Java static methods: StringUtils.truncate(String s). Place them in a utility class.' },
      { title: 'data class copy() → record constructor', body: 'Java records are immutable and have no copy(). Replace alice.copy(active=false) with new User(alice.id(), alice.name(), alice.email(), false).' },
    ],
  },

  // ── java → kotlin ─────────────────────────────────────────────────────────
  'java-kotlin': {
    intro: "Kotlin dramatically reduces Java boilerplate while remaining fully JVM-compatible. Java's verbose getter/setter POJOs collapse into Kotlin `data class` declarations, `Optional<T>` is replaced by Kotlin's built-in null-safety operators (`?.`, `?:`, `!!`), anonymous inner classes become lambdas, and Java's checked exceptions simply disappear. The same logic that takes 50 lines of Java often fits in 15 lines of idiomatic Kotlin.",
    diffs: [
      { category: 'Verbosity',      from: 'Full class/field/getter/setter boilerplate for every model.',            to: 'data class gives equals/hashCode/copy/toString in one line.' },
      { category: 'Null safety',    from: 'All references nullable. NullPointerException at runtime.',              to: 'T vs T? enforced by compiler. Safe-call (?.) and Elvis (?:) operators.' },
      { category: 'Coroutines',     from: 'CompletableFuture, thread pools, synchronized.',                         to: 'Coroutines: suspend, launch, async, flow — lightweight and composable.' },
      { category: 'Functional',     from: 'Streams API (verbose). Anonymous inner classes for lambdas (pre-8).',   to: 'Collection extensions (filter, map, flatMap) directly on any Iterable.' },
      { category: 'String templates',from: 'String.format() or + concatenation.',                                  to: 'String templates: "Hello, $name" or "Sum: ${a + b}".' },
    ],
    examples: [
      {
        title: 'Java POJO → Kotlin data class',
        description: '25 lines of Java boilerplate collapses to a single Kotlin data class declaration.',
        fromCode:
`public class Product {
    private final String name;
    private final double price;
    private final boolean available;

    public Product(String name, double price, boolean available) {
        this.name = name; this.price = price; this.available = available;
    }
    public String getName()      { return name; }
    public double getPrice()     { return price; }
    public boolean isAvailable() { return available; }
    // + equals, hashCode, toString...
}`,
        toCode:
`data class Product(
    val name: String,
    val price: Double,
    val isAvailable: Boolean,
)
// equals, hashCode, copy, toString all generated`,
      },
      {
        title: 'Stream chain → Kotlin collection extensions',
        description: 'Java\'s Stream API becomes Kotlin\'s built-in collection functions — no collect() needed.',
        fromCode:
`List<String> names = products.stream()
    .filter(p -> p.isAvailable())
    .sorted(Comparator.comparing(Product::getPrice))
    .map(Product::getName)
    .collect(Collectors.toList());`,
        toCode:
`val names = products
    .filter { it.isAvailable }
    .sortedBy { it.price }
    .map { it.name }`,
      },
    ],
    tips: [
      { title: 'POJO → data class', body: 'Every Java POJO (fields + getters + equals/hashCode) becomes a Kotlin data class. Remove all getters — Kotlin properties are accessed directly: product.name, not product.getName().' },
      { title: 'Optional<T> → nullable T?', body: 'Replace Optional<T> with T?. Replace .orElse(default) with ?: default (Elvis operator). Replace .ifPresent{} with ?.let{}.' },
      { title: 'CompletableFuture → coroutines', body: 'Add kotlinx.coroutines. Mark async methods suspend fun. Replace thenApply with direct sequential code inside a coroutine scope. Launch with viewModelScope.launch or runBlocking.' },
      { title: 'Switch → when', body: 'Java switch becomes Kotlin when. It\'s an expression: val label = when (code) { 1 -> "one" 2 -> "two" else -> "other" }. No fall-through.' },
    ],
  },

  // ── php → python ──────────────────────────────────────────────────────────
  'php-python': {
    intro: "PHP's web-centric execution model and dynamic typing share similarities with Python, but the idioms diverge significantly. PHP's `$` variable prefix and array functions (`array_map`, `array_filter`) translate to Python's plain variables and built-in `list` methods. PHP's mixed-type arrays become Python lists or dicts, `echo` statements become `print`, and PHP's `require`/`include` becomes Python's `import` system.",
    diffs: [
      { category: 'Variable prefix', from: 'All variables prefixed with $. $name, $count, $user.',                 to: 'No prefix. Plain names: name, count, user.' },
      { category: 'Type system',     from: 'Weakly typed; automatic coercion between strings and numbers.',         to: 'Dynamically typed; explicit conversion required (int("5") not "5" + 1).' },
      { category: 'Array model',     from: 'Single array type covers indexed lists, associative maps, and mixes.',   to: 'list for sequences, dict for key-value maps, set for unique values.' },
      { category: 'Web focus',       from: 'Runs natively inside web servers (Apache/nginx). echo outputs HTML.',   to: 'General-purpose. Use Flask/Django/FastAPI for web. print() to stdout.' },
      { category: 'Error handling',  from: 'Older code uses error codes/warnings; modern PHP uses try/catch.',       to: 'Pure exception-based. Every error is an exception.' },
    ],
    examples: [
      {
        title: 'Array functions → list operations',
        description: 'PHP\'s array_map/array_filter become Python list comprehensions or built-in functions.',
        fromCode:
`$numbers = [1, 2, 3, 4, 5, 6, 7, 8];

$evens  = array_filter($numbers, fn($n) => $n % 2 === 0);
$squared = array_map(fn($n) => $n ** 2, $evens);

echo implode(', ', $squared); // 4, 16, 36, 64`,
        toCode:
`numbers = [1, 2, 3, 4, 5, 6, 7, 8]

squared = [n ** 2 for n in numbers if n % 2 == 0]

print(', '.join(str(n) for n in squared))  # 4, 16, 36, 64`,
      },
      {
        title: 'PHP class → Python class',
        description: 'PHP visibility modifiers and type hints map cleanly to Python. The $ prefix and -> arrow disappear.',
        fromCode:
`class User {
    private string $name;
    private int $age;

    public function __construct(string $name, int $age) {
        $this->name = $name;
        $this->age  = $age;
    }

    public function greet(): string {
        return "Hello, " . $this->name;
    }
}`,
        toCode:
`class User:
    def __init__(self, name: str, age: int):
        self._name = name
        self._age  = age

    def greet(self) -> str:
        return "Hello, " + self._name`,
      },
    ],
    tips: [
      { title: 'Strip the $ prefix from every variable', body: 'PHP\'s $variable syntax is purely syntactic. Remove the $ from every identifier. $userList becomes user_list; $totalCount becomes total_count.' },
      { title: 'Split PHP arrays into list or dict', body: 'If PHP array uses sequential integer keys, use Python list. If it uses string keys (associative), use dict. Mixed arrays should be refactored.' },
      { title: 'array_* functions → comprehensions', body: 'array_map($fn, $arr) → [fn(x) for x in arr]. array_filter($arr, $fn) → [x for x in arr if fn(x)]. array_reduce → functools.reduce.' },
      { title: 'echo / print → print()', body: 'PHP echo and print statements become Python\'s print() function. String concatenation with . becomes + or f-strings.' },
    ],
  },

  // ── ruby → python ─────────────────────────────────────────────────────────
  'ruby-python': {
    intro: "Ruby and Python share a philosophy of developer happiness and readable syntax, making this one of the more natural conversions. Ruby's blocks and `yield` map closely to Python's first-class functions and decorators, Ruby's `Enumerable` methods (`map`, `select`, `reduce`) have direct Python equivalents, and Ruby's `nil` becomes Python's `None`. Ruby's `snake_case` convention is shared, though Ruby uses `end` keywords where Python uses indentation.",
    diffs: [
      { category: 'Blocks',         from: 'Blocks (do..end or {}) are anonymous closures passed to methods implicitly.', to: 'No blocks. Use lambda, closures via def, or comprehensions.' },
      { category: 'Syntax',         from: 'end keyword closes blocks, methods, classes. No braces.',                to: 'Indentation defines blocks. No end keyword.' },
      { category: 'Symbol type',    from: ':symbol literals are interned strings. Used for hash keys and method refs.', to: 'No symbol type. Use plain str for hash keys. Strings are interned by Python automatically.' },
      { category: 'Iteration',      from: 'Enumerable mixin: .map, .select, .reduce, .each on any collection.',     to: 'Built-in list methods + list/dict/set comprehensions. functools for fold.' },
      { category: 'Module system',  from: 'require/require_relative for loading. Gems via Bundler + Gemfile.',       to: 'import. Packages via pip + pyproject.toml.' },
    ],
    examples: [
      {
        title: 'Ruby block → Python lambda / comprehension',
        description: 'Ruby\'s block-based Enumerable methods map to Python comprehensions and built-ins.',
        fromCode:
`numbers = [1, 2, 3, 4, 5, 6, 7, 8]

evens   = numbers.select { |n| n.even? }
squared = evens.map      { |n| n ** 2  }
total   = squared.reduce(0) { |sum, n| sum + n }

puts total  # 4 + 16 + 36 + 64 = 120`,
        toCode:
`numbers = [1, 2, 3, 4, 5, 6, 7, 8]

squared = [n ** 2 for n in numbers if n % 2 == 0]
total   = sum(squared)

print(total)  # 120`,
      },
      {
        title: 'Ruby class → Python class',
        description: 'Ruby\'s attr_accessor maps to plain Python properties. end keyword disappears entirely.',
        fromCode:
`class BankAccount
  attr_reader :owner, :balance

  def initialize(owner, balance = 0)
    @owner   = owner
    @balance = balance
  end

  def deposit(amount)
    @balance += amount
    self
  end

  def to_s
    "#{@owner}: $#{@balance}"
  end
end`,
        toCode:
`class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner   = owner
        self.balance = balance

    def deposit(self, amount: float) -> "BankAccount":
        self.balance += amount
        return self

    def __str__(self) -> str:
        return f"{self.owner}: \${self.balance}"`,
      },
    ],
    tips: [
      { title: 'Blocks → lambdas or def functions', body: 'Ruby blocks { |x| x * 2 } become Python lambdas: lambda x: x * 2. Multi-line blocks with logic become named def functions passed as arguments.' },
      { title: 'attr_accessor → plain attributes', body: 'Ruby\'s attr_accessor :name generates getter/setter. Python uses self.name directly — no accessor macro needed. Use @property only for validation.' },
      { title: 'Symbol keys → string keys', body: ':symbol hash keys become plain string keys in Python dicts: { name: "Alice" } → {"name": "Alice"}. The behavior is identical since Python interns short strings.' },
      { title: 'Enumerable → comprehensions + builtins', body: '.select → list comprehension with if. .map → list comprehension or map(). .reduce → functools.reduce() or sum(). .each → for loop.' },
    ],
  },
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Returns unique rich content for a language pair, or null if not available. */
export function getPairContent(from: string, to: string): PairContent | null {
  return DATA[`${from}-${to}`] ?? null
}

/** Returns unique intro paragraph for a language pair, or null if not available. */
export function getPairIntro(from: string, to: string): string | null {
  return DATA[`${from}-${to}`]?.intro ?? null
}
