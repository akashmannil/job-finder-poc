import { normalizeSkill } from "@/lib/skills/catalog";

// ─────────────────────────────────────────────────────────────────────────────
// Predefined assessment questions per skill - the no-AI replacement for generated
// quizzes. `answer` is the correct option's text (position-independent, so options
// can be shuffled for display without breaking grading). Expand by adding entries.
// Skills without a bank fall back to generic competence questions.
// ─────────────────────────────────────────────────────────────────────────────

export interface BankQuestion {
  question: string;
  options: string[];
  answer: string;
}

export const QUESTION_BANK: Record<string, BankQuestion[]> = {
  React: [
    {
      question: "Which hook performs side effects in a function component?",
      options: ["useEffect", "useState", "useMemo", "useRef"],
      answer: "useEffect",
    },
    {
      question: "Why are list keys important?",
      options: [
        "They help React identify which items changed",
        "They style list items",
        "They sort the list",
        "They cache network calls",
      ],
      answer: "They help React identify which items changed",
    },
    {
      question: "State updates in React are best described as:",
      options: [
        "Possibly batched and asynchronous",
        "Always synchronous",
        "Direct mutations",
        "Render-blocking by default",
      ],
      answer: "Possibly batched and asynchronous",
    },
    {
      question: "What does the useEffect dependency array control?",
      options: ["When the effect re-runs", "Hook order", "Component styling", "Return type"],
      answer: "When the effect re-runs",
    },
  ],
  TypeScript: [
    {
      question: "Using a value of type `unknown` requires:",
      options: ["Narrowing / type checking first", "Nothing", "A cast to any", "A class wrapper"],
      answer: "Narrowing / type checking first",
    },
    {
      question: "A discriminated union is:",
      options: [
        "A union with a common literal tag field",
        "A union of only numbers",
        "An intersection type",
        "A generic constraint",
      ],
      answer: "A union with a common literal tag field",
    },
    {
      question: "Which utility type makes all properties optional?",
      options: ["Partial<T>", "Required<T>", "Readonly<T>", "Record<K,V>"],
      answer: "Partial<T>",
    },
    {
      question: "`readonly` on a property:",
      options: ["Prevents reassignment after init", "Makes it optional", "Hides it", "Makes it static"],
      answer: "Prevents reassignment after init",
    },
  ],
  JavaScript: [
    {
      question: "What does `===` compare?",
      options: ["Value and type, no coercion", "Value with coercion", "Reference only", "Type only"],
      answer: "Value and type, no coercion",
    },
    {
      question: "A closure is:",
      options: [
        "A function retaining access to its lexical scope",
        "A way to close a stream",
        "A loop construct",
        "A CSS rule",
      ],
      answer: "A function retaining access to its lexical scope",
    },
    {
      question: "`Array.prototype.map` returns:",
      options: ["A new array", "The same array mutated", "A single value", "undefined"],
      answer: "A new array",
    },
    {
      question: "`typeof null` evaluates to:",
      options: ["'object'", "'null'", "'undefined'", "'number'"],
      answer: "'object'",
    },
  ],
  "Node.js": [
    {
      question: "Node.js runs on which JavaScript engine?",
      options: ["V8", "SpiderMonkey", "Chakra", "Nashorn"],
      answer: "V8",
    },
    {
      question: "The event loop is responsible for:",
      options: ["Scheduling async callbacks", "Compiling TypeScript", "Rendering UI", "Only GC"],
      answer: "Scheduling async callbacks",
    },
    {
      question: "`process.env` holds:",
      options: ["Environment variables", "CPU stats", "The call stack", "Open sockets"],
      answer: "Environment variables",
    },
    {
      question: "A good practice for CPU-bound work in Node is:",
      options: ["Offload to worker threads/processes", "Block the event loop", "Use more callbacks", "Disable async"],
      answer: "Offload to worker threads/processes",
    },
  ],
  Python: [
    {
      question: "A list comprehension is:",
      options: ["A concise way to build lists", "A type hint", "A decorator", "A context manager"],
      answer: "A concise way to build lists",
    },
    {
      question: "`with open(...)` provides:",
      options: ["Automatic resource cleanup", "Faster I/O only", "Threading", "Type checking"],
      answer: "Automatic resource cleanup",
    },
    {
      question: "Which type is immutable?",
      options: ["tuple", "list", "dict", "set"],
      answer: "tuple",
    },
    {
      question: "PEP 8 primarily covers:",
      options: ["Style conventions", "Async syntax", "Packaging", "Typing rules"],
      answer: "Style conventions",
    },
  ],
  SQL: [
    {
      question: "Which clause filters grouped rows?",
      options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
      answer: "HAVING",
    },
    {
      question: "An INNER JOIN returns:",
      options: ["Rows matching in both tables", "All left rows", "All right rows", "Only unmatched rows"],
      answer: "Rows matching in both tables",
    },
    {
      question: "An index primarily provides:",
      options: ["Faster lookups", "Encryption", "Backups", "Normalization"],
      answer: "Faster lookups",
    },
    {
      question: "Second normal form (2NF) removes:",
      options: ["Partial dependencies", "All joins", "Indexes", "Foreign keys"],
      answer: "Partial dependencies",
    },
  ],
  Go: [
    {
      question: "Go handles concurrency primarily with:",
      options: ["Goroutines and channels", "OS threads only", "Callbacks only", "Fibers"],
      answer: "Goroutines and channels",
    },
    {
      question: "Errors are idiomatically handled by:",
      options: ["Returning them as values", "Throwing exceptions", "Always panicking", "Ignoring them"],
      answer: "Returning them as values",
    },
    {
      question: "`defer` schedules a call to run:",
      options: ["At function return", "After the program exits", "In a goroutine", "On import"],
      answer: "At function return",
    },
    {
      question: "A zero value is:",
      options: ["The default of a declared variable", "A nil error", "An empty package", "A panic"],
      answer: "The default of a declared variable",
    },
  ],
  AWS: [
    {
      question: "Amazon S3 is used for:",
      options: ["Object storage", "Compute", "DNS", "Load balancing"],
      answer: "Object storage",
    },
    {
      question: "IAM manages:",
      options: ["Access and permissions", "Networking", "Storage tiers", "Billing alerts"],
      answer: "Access and permissions",
    },
    {
      question: "Which is serverless compute?",
      options: ["Lambda", "EC2", "EBS", "VPC"],
      answer: "Lambda",
    },
    {
      question: "A security group acts as:",
      options: ["A virtual firewall for instances", "A user group", "A billing unit", "A storage class"],
      answer: "A virtual firewall for instances",
    },
  ],
  Kubernetes: [
    {
      question: "The smallest deployable unit in Kubernetes is:",
      options: ["A Pod", "A Container", "A Node", "A Service"],
      answer: "A Pod",
    },
    {
      question: "A Deployment manages:",
      options: ["ReplicaSets and rollouts", "Storage volumes", "DNS records", "Only secrets"],
      answer: "ReplicaSets and rollouts",
    },
    {
      question: "What exposes pods as a stable network endpoint?",
      options: ["A Service", "A ConfigMap", "A Job", "A Namespace"],
      answer: "A Service",
    },
    {
      question: "`kubectl` is:",
      options: ["The CLI to control clusters", "A container runtime", "A scheduler", "A log shipper"],
      answer: "The CLI to control clusters",
    },
  ],
  "System Design": [
    {
      question: "Horizontal scaling means:",
      options: ["Adding more machines", "A bigger single machine", "More RAM only", "Faster disk only"],
      answer: "Adding more machines",
    },
    {
      question: "A cache primarily:",
      options: ["Reduces latency on repeated reads", "Provides permanent storage", "Encrypts data", "Balances load"],
      answer: "Reduces latency on repeated reads",
    },
    {
      question: "A load balancer:",
      options: ["Distributes traffic across servers", "Stores data", "Compiles code", "Indexes databases"],
      answer: "Distributes traffic across servers",
    },
    {
      question: "Eventual consistency means:",
      options: ["Replicas converge over time", "Always immediately consistent", "Never consistent", "Full ACID always"],
      answer: "Replicas converge over time",
    },
  ],
  Testing: [
    {
      question: "A unit test:",
      options: ["Tests a small isolated piece of code", "Tests the whole system", "Is manual QA", "Is a load test"],
      answer: "Tests a small isolated piece of code",
    },
    {
      question: "A mock is:",
      options: ["A stand-in for a dependency", "A production database", "A type", "A linter"],
      answer: "A stand-in for a dependency",
    },
    {
      question: "Code coverage measures:",
      options: ["How much code tests exercise", "Total bug count", "Runtime performance", "Lines of code"],
      answer: "How much code tests exercise",
    },
    {
      question: "A flaky test is one that:",
      options: ["Passes/fails nondeterministically", "Runs slowly", "Is skipped", "Is a unit test"],
      answer: "Passes/fails nondeterministically",
    },
  ],
};

/** Generic competence questions for any skill without a dedicated bank. */
export function genericQuestions(skill: string): BankQuestion[] {
  return [
    {
      question: `Which best reflects strong proficiency in ${skill}?`,
      options: [
        `Applying ${skill} to real problems with sound practices`,
        `Having only heard of ${skill}`,
        `Memorizing the name "${skill}"`,
        `Avoiding ${skill} entirely`,
      ],
      answer: `Applying ${skill} to real problems with sound practices`,
    },
    {
      question: `When building competence in ${skill}, what matters most?`,
      options: [
        "Hands-on practice and fundamentals",
        "Watching a single video",
        "Reading the logo",
        "Skipping the basics",
      ],
      answer: "Hands-on practice and fundamentals",
    },
    {
      question: `A credible signal of ${skill} experience is:`,
      options: [
        `Shipping and maintaining real work using ${skill}`,
        "A certificate with no projects",
        "Listing it on a résumé",
        "None of these",
      ],
      answer: `Shipping and maintaining real work using ${skill}`,
    },
    {
      question: `The best way to keep ${skill} current is:`,
      options: [
        "Regular practice and following its evolution",
        "Never using it again",
        "Ignoring updates",
        "Theory only, no practice",
      ],
      answer: "Regular practice and following its evolution",
    },
  ];
}

/** Questions for a skill: its dedicated bank, or generic fallback. */
export function questionsForSkill(skill: string): BankQuestion[] {
  return QUESTION_BANK[normalizeSkill(skill)] ?? genericQuestions(skill);
}
