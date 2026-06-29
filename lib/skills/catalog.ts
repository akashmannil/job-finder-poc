// ─────────────────────────────────────────────────────────────────────────────
// Predefined skill catalog - the knowledge that powers the local (no-AI) engines.
// `aliases` let synonyms match (TS ↔ TypeScript); `related` gives transferable
// partial credit in matching (a React dev partly covers a Next.js requirement).
// This is intentionally small and easy to expand - add entries to grow coverage.
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillDef {
  name: string;
  aliases?: string[];
  related?: string[];
  category?: string;
}

export const SKILL_CATALOG: SkillDef[] = [
  { name: "JavaScript", aliases: ["JS", "ECMAScript"], related: ["TypeScript", "Node.js", "React"], category: "frontend" },
  { name: "TypeScript", aliases: ["TS"], related: ["JavaScript", "React", "Node.js"], category: "frontend" },
  { name: "React", aliases: ["ReactJS", "React.js"], related: ["Next.js", "JavaScript", "TypeScript"], category: "frontend" },
  { name: "Next.js", aliases: ["NextJS", "Next"], related: ["React", "TypeScript"], category: "frontend" },
  { name: "CSS", aliases: ["CSS3"], related: ["Accessibility"], category: "frontend" },
  { name: "Accessibility", aliases: ["a11y"], related: ["CSS"], category: "frontend" },
  { name: "Node.js", aliases: ["Node", "NodeJS"], related: ["JavaScript", "TypeScript"], category: "backend" },
  { name: "Python", aliases: ["Py"], related: ["Django", "FastAPI", "Machine Learning"], category: "backend" },
  { name: "Django", related: ["Python"], category: "backend" },
  { name: "FastAPI", related: ["Python"], category: "backend" },
  { name: "Go", aliases: ["Golang"], related: ["System Design", "Microservices"], category: "backend" },
  { name: "Java", related: ["Spring"], category: "backend" },
  { name: "Spring", aliases: ["Spring Boot"], related: ["Java"], category: "backend" },
  { name: "Rust", related: ["System Design"], category: "backend" },
  { name: "GraphQL", related: ["Node.js", "TypeScript"], category: "backend" },
  { name: "PostgreSQL", aliases: ["Postgres"], related: ["SQL"], category: "data" },
  { name: "SQL", related: ["PostgreSQL"], category: "data" },
  { name: "Redis", related: ["System Design"], category: "data" },
  { name: "Spark", aliases: ["Apache Spark"], related: ["Python", "SQL"], category: "data" },
  { name: "Airflow", aliases: ["Apache Airflow"], related: ["Python"], category: "data" },
  { name: "Tableau", related: ["SQL"], category: "data" },
  { name: "Machine Learning", aliases: ["ML"], related: ["Python", "PyTorch"], category: "ml" },
  { name: "PyTorch", related: ["Machine Learning", "Python"], category: "ml" },
  { name: "AWS", aliases: ["Amazon Web Services"], related: ["Docker", "Kubernetes", "Terraform"], category: "infra" },
  { name: "Docker", related: ["Kubernetes", "CI/CD"], category: "infra" },
  { name: "Kubernetes", aliases: ["K8s"], related: ["Docker", "AWS"], category: "infra" },
  { name: "Terraform", related: ["AWS"], category: "infra" },
  { name: "CI/CD", aliases: ["CICD", "Continuous Integration"], related: ["Docker"], category: "infra" },
  { name: "Security", aliases: ["AppSec", "InfoSec"], related: ["AWS"], category: "infra" },
  { name: "Swift", related: ["iOS"], category: "mobile" },
  { name: "iOS", related: ["Swift"], category: "mobile" },
  { name: "Kotlin", related: ["Android"], category: "mobile" },
  { name: "Android", related: ["Kotlin"], category: "mobile" },
  { name: "React Native", aliases: ["RN"], related: ["React", "TypeScript"], category: "mobile" },
  { name: "System Design", aliases: ["Systems Design"], related: ["Microservices"], category: "architecture" },
  { name: "Microservices", related: ["System Design"], category: "architecture" },
  { name: "Testing", aliases: ["QA", "Test Automation"], related: ["Playwright"], category: "quality" },
  { name: "Playwright", related: ["Testing"], category: "quality" },
  { name: "Figma", related: ["UX Research"], category: "design" },
  { name: "UX Research", aliases: ["User Research"], related: ["Figma"], category: "design" },
  { name: "Product Management", aliases: ["PM"], related: ["Communication", "UX Research"], category: "product" },
  { name: "Leadership", related: ["Communication"], category: "soft" },
  { name: "Communication", related: ["Leadership"], category: "soft" },
];

// Build a lookup from any name/alias (lowercased) → canonical name.
const INDEX = new Map<string, string>();
for (const s of SKILL_CATALOG) {
  INDEX.set(s.name.toLowerCase(), s.name);
  for (const a of s.aliases ?? []) INDEX.set(a.toLowerCase(), s.name);
}

const BY_NAME = new Map(SKILL_CATALOG.map((s) => [s.name, s]));

/** Canonicalize a skill name; unknown skills pass through trimmed (still usable). */
export function normalizeSkill(name: string): string {
  return INDEX.get(name.trim().toLowerCase()) ?? name.trim();
}

/** Canonical related skills for transferable-credit matching. */
export function relatedOf(name: string): string[] {
  return BY_NAME.get(normalizeSkill(name))?.related?.map(normalizeSkill) ?? [];
}

/** True if `a` lists `b` as related (or vice-versa) - a transferable connection. */
export function areRelated(a: string, b: string): boolean {
  const ca = normalizeSkill(a);
  const cb = normalizeSkill(b);
  return relatedOf(ca).includes(cb) || relatedOf(cb).includes(ca);
}
