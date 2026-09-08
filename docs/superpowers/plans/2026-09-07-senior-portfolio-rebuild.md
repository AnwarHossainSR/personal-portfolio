# Senior Engineer Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert this portfolio from a breadth-signalling personal site into a depth-signalling engineering portfolio that a Senior/Staff hiring manager can evaluate in ninety seconds.

**Architecture:** The site keeps its Vite + React + React Router + Tailwind foundation. What changes is the content model and the information architecture. Today the site stores *claims* (skill levels, project blurbs, unlabelled metrics). It will store *evidence*: a zod-validated case-study model where every number carries the method used to measure it, and where a case study that claims measurement without a method fails the test suite. The eight-item navigation collapses to four; the decorative layer (particles, interactive background, terminal, typing effects, AI chatbot, YouTube page) is deleted; three deep case studies replace seven shallow project cards.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, React Router 7, Tailwind 3.4, zod 4 (already a dependency — repurposed for content validation), Vitest + Testing Library (added in Task 1), Biome, Bun, Vercel.

---

## Part 0 — Analysis: why the current site reads junior

This section is the reasoning behind every task below. Read it before touching code; several tasks are deletions, and deletions need justification.

### 0.1 The structural signals

| # | Signal | Where | Why it reads junior |
|---|---|---|---|
| 1 | **Skill levels with self-assigned proficiency** | `src/data/skills.ts` — `level: "Expert"`, `yearsOfExperience: "5+"` on 44 skills | Nobody senior grades themselves. "Expert · Node.js · 5+ years" is a bootcamp-résumé convention. A hiring manager reads *self-assessment*, which is the least reliable evidence available, and 44 of them reads as breadth-anxiety. |
| 2 | **Fabricated certifications** | `src/data/skills.ts:certifications` — `issuer: "Portfolio and product workflow experience"`, `credentialId: "CV-backed expertise"`, `verified: true` | This is the single most damaging item on the site. A `ShieldCheck` icon and the word "verified" next to a credential whose issuer is *your own portfolio* is not a stretch — it is a fake credential. One recruiter noticing this discards the whole application. Must go first. |
| 3 | **Metrics with no method, several of them aspirational** | `src/data/projects.ts` — `"99.9% target uptime"`, `"Sub-200ms API target"`, `"100k+ daily events"`, `"70% faster deployments"` | Two problems. Targets are presented in the same visual slot as results, so the reader can't tell which is which. And no number says how it was measured. Senior readers discount unattributed numbers to zero; junior readers don't know to. |
| 4 | **"CV-aligned" verification badges** | `src/pages/Projects.tsx:118-123`, `isVerified: true` on all 7 projects | Self-issued trust badges. Verified by whom, against what? It draws attention to exactly the claims that can't be checked. |
| 5 | **Every project links to the same GitHub profile root** | All 7 entries: `githubUrl: "https://github.com/AnwarHossainSR"` | A GitHub icon on a project card is a promise of code. Seven icons pointing at a profile page is seven broken promises, and it is visible in one hover. |
| 6 | **Projects that are not projects** | `status: "Active capability"`, `"Architecture pattern"`, `"Production contribution"` | "Cloud Commerce Platform" and "Enterprise API Gateway" are described as designs, not shipped systems. Presenting a design exercise with the same card, the same metric tiles, and the same verified badge as production work is the error a junior makes and a senior doesn't. |
| 7 | **A YouTube page in primary navigation** | `src/pages/YouTube.tsx`, `src/data/youtube.ts` — "ReactJS - Part 1..4" | React tutorial series is the canonical junior-content genre. In the top nav, next to Projects, it re-frames everything else on the site as learner output. (Teaching is a genuine asset — but as one line under About, not a nav item.) |
| 8 | **An "Ask AI" chatbot about yourself** | `src/pages/AskAi.tsx`, 609 lines | Two failures at once. As content: a chatbot that answers questions about you, on your own site, sourced from the same data already on the page — it adds nothing a reader can't get by scrolling, and it is the 2024 portfolio cliché. As engineering: `import.meta.env.VITE_GEMINI_API_KEY` (`AskAi.tsx:177`) ships a provider key in the JS bundle, and `localStorage.setItem("gemini_api_key", ...)` (`:288`) asks *visitors* to paste their own key into your site. A senior reviewer reads that as a security judgement problem, not a feature. |
| 9 | **Decorative layer competing with content** | `ParticleBackground` + `InteractiveBackground` in `Layout.tsx`, `Terminal` on the home page, plus unused `FloatingIcons`, `TypingEffect`, `StatsCounter`, `LoadingScreen` | Two canvas animations run behind every page and a fake terminal sits under the home fold. These are effort spent where it doesn't pay. Four more effect components sit unused in the tree — dead code a reviewer will find. |
| 10 | **Vanity counters** | `experienceStats` → "50+ projects", "20+ technologies" | Uncheckable, unfalsifiable, and used identically on Home, About, and Experience. Repeating a weak number three times makes it weaker. |
| 11 | **Placeholder blog** | `src/pages/Blogs.tsx` — three posts pointing at `https://example.com/blog/...` | Unrouted, so not currently visible, but it is committed. Fake posts with fake URLs in the repo are worse than no blog. |
| 12 | **Eight nav items for one person** | `Navigation.tsx:9-18` | Home, About, Experience, Projects, Skills, YouTube, Ask AI, Contact. Breadth-first IA. Senior sites are Work-first and usually four items or fewer, because the site's job is to get you to one deep artefact. |
| 13 | **Visual register: everything is maximum** | `font-black` on ~40 headings, `gradient-text`, `shadow-glow`, `bg-gradient-primary` buttons, full-page grid background, `premium-card`, `mesh-gradient` | Nothing is emphasised because everything is. "Premium" as a class name is the tell — the design is asserting quality rather than demonstrating it. |
| 14 | **No engineering writing anywhere** | — | The strongest senior signal available to a portfolio is prose about a hard decision. There is none on the site. |
| 15 | **No tests, in a portfolio for an engineer** | No test runner in `package.json` | The repo is itself a work sample. It has 4,179 lines of source and zero tests. |

### 0.2 What actually distinguishes a senior portfolio

Not visual polish — this site already has more polish than most. The difference is **evidence and judgement**:

1. **One clear positioning line.** Not "AI Automation | Agentic AI | AWS Cloud | Full-Stack Engineering" (four claims, zero focus). One sentence naming the kind of problem you're hired for.
2. **Depth over breadth.** Three case studies you can defend for forty-five minutes beat seven cards. Fewer, longer, with the boring parts included.
3. **Decisions with rejected alternatives.** The single highest-value artefact. "We chose X over Y and Z because of constraint C, and it cost us T." Juniors list what they built. Seniors explain what they chose *not* to build and what it cost. This is the core of the new data model.
4. **Numbers with methods.** "p95 checkout latency 840ms → 210ms, measured in CloudWatch over the 30 days either side of the cutover" is worth more than ten "99.9% uptime" tiles.
5. **Honest scope.** "I owned the ingestion path; another team owned playback." Naming your boundary is a seniority signal; claiming the whole system is a junior one.
6. **Reflection.** "What I'd do differently" on every case study. Almost nobody does this, and it is the fastest way to demonstrate calibrated judgement.
7. **Constraints, not just achievements.** Six-week deadline, three engineers, legacy PHP monolith that can't go down. Work without stated constraints looks easy, and easy work looks junior.
8. **Restraint in the design.** Confident typography, one accent colour, generous whitespace, no motion for its own sake.
9. **The repo is a work sample.** Tests, CI, clean commits, a `README` explaining decisions.

### 0.3 Decisions taken (from the brief)

- **Audience:** hiring managers screening for Senior/Staff IC roles. Everything optimises for their ninety-second scan and their subsequent forty-five-minute deep read.
- **YouTube page and Ask AI page:** both deleted. YouTube survives as one line in About.
- **Metrics:** real, NDA-safe figures supplied by the author. The content model enforces that anonymised does not mean invented.
- **Scope:** content + information architecture restructure, plus a restraint pass on the existing dark design system. No ground-up visual redesign.

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Package manager is Bun.** `bun.lock` is committed. Install with `bun add` / `bun add -d`. Never generate `package-lock.json` or `yarn.lock`.
- **Node `>=24.16.0`** per `package.json` `engines`.
- **Formatting is Biome:** tab indentation, double quotes, semicolons always. Run `bun run lint` (which is `biome check --write .`) before every commit. All code in this plan is written with tabs; if you paste spaces, Biome will fix it.
- **Path alias:** `@/` resolves to `src/`. Use it in all imports; never write `../../`.
- **No new runtime dependencies** beyond those explicitly installed in Task 1 (dev-only) and Task 12. `zod` is already present and is the content-validation tool.
- **Dark-first theme is retained.** `:root, .dark` is the default palette and `.light` must keep working after every visual change.
- **No fabricated content, enforced by tests.** Any string in `src/content/` or `src/data/` containing `TODO`, `TBD`, `Lorem`, `example.com`, `FIXME`, or the sentinel `<<REPLACE>>` fails the suite. This is deliberate: it makes shipping a placeholder impossible rather than merely discouraged.
- **Numbers require methods.** A case study declaring `evidence: "measured"` must carry at least one result, and every result must state how it was measured. A case study declaring `evidence: "qualitative"` must carry zero numeric results. Enforced in Task 2.
- **Routing stays client-side.** `vercel.json` already rewrites `/(.*)` → `/`; deep links like `/work/<slug>` depend on it. Do not change that file.
- **Old URLs must not 404.** `/projects`, `/skills`, `/experience` become redirects. `/youtube` and `/ask-ai` are intentional 404s.
- **Commit after every task.** Conventional Commits (`feat:`, `refactor:`, `test:`, `chore:`, `docs:`). Every commit message ends with:
  ```
  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  ```
- **Branch:** work on `new-design-with-react` (current branch) or a branch cut from it. Do not commit to `main`.

---

## Target Information Architecture

Four nav items. Home is reached through the wordmark.

| Route | Purpose | Replaces |
|---|---|---|
| `/` | Positioning, three case-study cards, current focus, one contact path | `Home` (rewritten) |
| `/work` | Case study index — three entries, each with its evidence level visible | `/projects` |
| `/work/:slug` | **The centrepiece.** Context → constraints → decisions (with rejected alternatives) → results (with methods) → reflection | *new* |
| `/about` | Narrative, track record (absorbs Experience), how I work, stack (absorbs Skills), teaching | `/about` + `/experience` + `/skills` |
| `/writing` | Engineering notes. Route registered only when at least one note exists | `/blogs` (deleted placeholder) |
| `/contact` | One email path, availability, response expectation | `/contact` (simplified) |
| `/projects` → `/work`, `/skills` → `/about#stack`, `/experience` → `/about#track-record` | Redirects | — |
| `/youtube`, `/ask-ai` | 404 | deleted |

---

## File Structure

### Created

```
vitest.config.ts                              Vitest config; mirrors vite alias
src/test/setup.ts                             jest-dom matchers, RTL cleanup
src/test/render.tsx                           renderWithRouter helper (Router + Helmet)
src/content/schema.ts                         zod schemas + types for all content. Single source of truth.
src/content/guards.ts                         Placeholder-token detector used by schema + tests
src/content/case-studies/index.ts             Validated registry; throws at import if content invalid
src/content/case-studies/<slug>.ts            One file per case study (3 files)
src/content/notes/index.ts                    Validated notes registry (may be empty)
src/content/notes/<slug>.tsx                  One file per written note
src/data/profile.ts                           Identity, positioning, links, availability
src/data/roles.ts                             Employment history as scope + impact
src/data/stack.ts                             Technologies grouped by what they're used for. No levels.
src/pages/Work.tsx                            Case study index
src/pages/CaseStudy.tsx                       Case study detail
src/pages/Writing.tsx                         Notes index
src/pages/Note.tsx                            Note detail
src/components/case-study/DecisionBlock.tsx   Chose / rejected / tradeoff renderer
src/components/case-study/ResultsTable.tsx    metric / before / after / method renderer
src/components/case-study/EvidenceBadge.tsx   measured | estimated | qualitative
src/components/Prose.tsx                      Measure-constrained prose wrapper
src/components/StructuredData.tsx             JSON-LD Person + Article
docs/CONTENT-WORKSHEET.md                     What the author must supply before Task 3
```

### Modified

```
package.json                    test scripts + dev deps
src/App.tsx                     new route table, redirects
src/components/Layout.tsx       drop both canvas backgrounds
src/components/Navigation.tsx   4 items, conditional Writing
src/components/Footer.tsx       drop YouTube, drop dead links
src/components/SEO.tsx          honest defaults, per-page OG, drop keywords meta
src/pages/Home.tsx              full rewrite
src/pages/About.tsx             full rewrite; absorbs Experience + Skills
src/pages/Contact.tsx           simplified
src/pages/NotFound.tsx          useful 404
src/index.css                   restraint pass on tokens + component classes
tailwind.config.ts              type scale + serif display face
index.html                      honest meta, drop keywords
public/sitemap.xml              new route set
README.md                       decisions, not feature list
```

### Deleted

```
src/pages/AskAi.tsx             609 lines. Client-side API key + self-chatbot.
src/pages/YouTube.tsx           Tutorial channel in primary nav.
src/pages/Blogs.tsx             example.com placeholder posts.
src/pages/Skills.tsx            Self-graded proficiency + fake certifications.
src/pages/Projects.tsx          Superseded by Work.tsx.
src/pages/Experience.tsx        Absorbed into About.
src/pages/Index.tsx             Unused.
src/data/youtube.ts
src/data/projects.ts
src/data/skills.ts              Includes the fabricated `certifications` array.
src/data/personal.ts            Superseded by profile.ts.
src/data/experience.ts          Superseded by roles.ts.
src/components/ParticleBackground.tsx
src/components/InteractiveBackground.tsx
src/components/Terminal.tsx
src/components/FloatingIcons.tsx        (already unused)
src/components/TypingEffect.tsx         (already unused)
src/components/StatsCounter.tsx         (already unused)
src/components/LoadingScreen.tsx        (already unused)
src/App.css                     (unused; verify before deleting)
.env / .env.example             Gemini keys, no longer needed
```

---

## Task 1: Test harness

Nothing else in this plan can be written test-first until a runner exists. This task is also its own deliverable: a portfolio repo with no tests is a work sample that fails its own interview.

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/render.tsx`
- Create: `src/test/harness.test.tsx`
- Modify: `package.json` (scripts + devDependencies)

**Interfaces:**
- Consumes: nothing.
- Produces: `renderWithRouter(ui: ReactElement, options?: { route?: string } & RenderOptions): RenderResult` from `@/test/render`. Every later page test uses it. Test command is `bun run test`.

- [ ] **Step 1: Install the dev dependencies**

```bash
bun add -d vitest@^3 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react-swc
```

`@vitejs/plugin-react-swc` is already a devDependency; including it is a no-op that guarantees the version resolves for the Vitest config.

- [ ] **Step 2: Write the failing smoke test**

Create `src/test/harness.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/render";

function Probe() {
	return <h1>harness online</h1>;
}

describe("test harness", () => {
	it("renders a component inside a router and applies jest-dom matchers", () => {
		renderWithRouter(<Probe />);
		expect(screen.getByRole("heading", { name: "harness online" })).toBeInTheDocument();
	});
});
```

- [ ] **Step 3: Run it to confirm it fails**

Run: `bun run test`

Expected: FAIL — `bun run test` is not yet a script, or once added, the run fails with `Failed to resolve import "@/test/render"`.

- [ ] **Step 4: Add the Vitest config**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		css: false,
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/components/ui/**", "src/test/**", "src/**/*.test.{ts,tsx}"],
		},
	},
});
```

- [ ] **Step 5: Add the setup file**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});

// jsdom does not implement matchMedia; several components read it for theme
// and reduced-motion. Provide a non-matching stub so tests exercise the
// default branch rather than crashing.
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}
```

- [ ] **Step 6: Add the render helper**

Create `src/test/render.tsx`:

```tsx
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { HelmetProvider } from "react-helmet-next";
import { MemoryRouter } from "react-router-dom";

type Options = RenderOptions & { route?: string };

export function renderWithRouter(ui: ReactElement, options: Options = {}) {
	const { route = "/", ...renderOptions } = options;

	return render(
		<HelmetProvider>
			<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
		</HelmetProvider>,
		renderOptions,
	);
}
```

- [ ] **Step 7: Add the test scripts**

In `package.json`, replace the `"scripts"` block with:

```json
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"build:dev": "vite build --mode development",
		"lint": "biome check --write .",
		"format": "biome format --write .",
		"preview": "vite preview",
		"test": "vitest run",
		"test:watch": "vitest",
		"test:coverage": "vitest run --coverage",
		"verify": "bun run test && bun run lint && bun run build"
	},
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `bun run test`

Expected: PASS — `1 passed (1)`.

- [ ] **Step 9: Commit**

```bash
git add package.json bun.lock vitest.config.ts src/test
git commit -m "$(cat <<'EOF'
test: add vitest + testing-library harness

Portfolio repo is itself a work sample; it had no test runner.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Content model with evidence enforcement

This is the load-bearing task. Everything that makes the site read senior — decisions with rejected alternatives, numbers with methods, honest scope — is encoded here as a schema that fails the build when violated. The rule that a `measured` claim requires a stated method is what separates this portfolio from the one being replaced.

**Files:**
- Create: `src/content/guards.ts`
- Create: `src/content/guards.test.ts`
- Create: `src/content/schema.ts`
- Create: `src/content/schema.test.ts`

**Interfaces:**
- Consumes: `zod` (already a dependency, v4).
- Produces:
  - `assertNoPlaceholders(value: unknown, label: string): void` from `@/content/guards`
  - `caseStudySchema`, `noteSchema`, `resultSchema`, `decisionSchema` from `@/content/schema`
  - Types `CaseStudy`, `Note`, `Result`, `Decision`, `RejectedOption`, `EvidenceLevel`
  - `parseCaseStudy(input: unknown): CaseStudy` — throws a labelled error on invalid content

- [ ] **Step 1: Write the failing guard test**

Create `src/content/guards.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assertNoPlaceholders, findPlaceholders } from "@/content/guards";

describe("findPlaceholders", () => {
	it("finds the replacement sentinel anywhere in a nested structure", () => {
		const found = findPlaceholders({ a: { b: ["fine", "p95 was <<REPLACE>>ms"] } });
		expect(found).toEqual(["a.b.1"]);
	});

	it("finds TODO, TBD, Lorem and example.com", () => {
		const found = findPlaceholders({
			one: "TODO: write this",
			two: "TBD",
			three: "Lorem ipsum dolor",
			four: "https://example.com/blog/post",
			five: "a legitimate sentence",
		});
		expect(found.sort()).toEqual(["four", "one", "three", "two"]);
	});

	it("does not flag ordinary prose", () => {
		expect(findPlaceholders({ a: "Reduced p95 latency from 840ms to 210ms." })).toEqual([]);
	});
});

describe("assertNoPlaceholders", () => {
	it("throws naming the label and the offending path", () => {
		expect(() => assertNoPlaceholders({ summary: "TBD" }, "case-study:vod")).toThrow(
			/case-study:vod.*summary/s,
		);
	});

	it("does not throw on clean content", () => {
		expect(() => assertNoPlaceholders({ summary: "Shipped it." }, "x")).not.toThrow();
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/content/guards.test.ts`

Expected: FAIL — `Failed to resolve import "@/content/guards"`.

- [ ] **Step 3: Implement the guards**

Create `src/content/guards.ts`:

```ts
/**
 * Content authored for this site must never ship with scaffolding text in it.
 * The site's whole claim is that its numbers are real, so a stray "TBD" is not
 * a cosmetic bug — it undermines the thing the content model exists to assert.
 * These tokens therefore fail the test suite rather than a lint rule.
 */
const PLACEHOLDER_PATTERNS = [
	/<<REPLACE>>/,
	/\bTODO\b/,
	/\bTBD\b/,
	/\bFIXME\b/,
	/\bLorem ipsum\b/i,
	/example\.com/i,
];

function walk(value: unknown, path: string, hits: string[]): void {
	if (typeof value === "string") {
		if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))) {
			hits.push(path);
		}
		return;
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => walk(item, path ? `${path}.${index}` : String(index), hits));
		return;
	}

	if (value && typeof value === "object") {
		for (const [key, item] of Object.entries(value)) {
			walk(item, path ? `${path}.${key}` : key, hits);
		}
	}
}

export function findPlaceholders(value: unknown): string[] {
	const hits: string[] = [];
	walk(value, "", hits);
	return hits;
}

export function assertNoPlaceholders(value: unknown, label: string): void {
	const hits = findPlaceholders(value);
	if (hits.length > 0) {
		throw new Error(`${label}: unresolved placeholder text at ${hits.join(", ")}`);
	}
}
```

- [ ] **Step 4: Run the guard test to verify it passes**

Run: `bun run test src/content/guards.test.ts`

Expected: PASS — `5 passed`.

- [ ] **Step 5: Write the failing schema test**

Create `src/content/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseCaseStudy } from "@/content/schema";

const valid = {
	slug: "vod-ingest",
	title: "Cutting failed video ingests by rebuilding the upload path",
	summary: "Rebuilt a fragile media ingest pipeline so large uploads stopped failing at the edge.",
	organisation: "BJIT Group Ltd.",
	domain: "Video streaming / VOD",
	role: "Backend engineer, owned the ingest path end to end",
	team: "4 engineers, 1 QA, 1 product manager",
	period: "2023",
	scope: "I owned upload, transcode orchestration and storage. Playback and the player UI belonged to another team.",
	stack: ["Node.js", "AWS S3", "CloudFront", "PostgreSQL", "Redis"],
	evidence: "measured" as const,
	context:
		"Editors uploading long-form video over unreliable connections were seeing uploads fail near completion, and every failure meant restarting a multi-gigabyte transfer from zero.",
	constraints: [
		"No downtime window: the existing upload path had to keep working during the migration",
		"Three engineers for six weeks",
	],
	decisions: [
		{
			question: "How do we make large uploads survive a dropped connection?",
			chose: "Direct-to-S3 multipart uploads with presigned URLs, resumed client-side from the last acknowledged part",
			rejected: [
				{
					option: "Keep proxying the upload through the API and add a retry loop",
					why: "The API instances would still hold the whole transfer in flight, so a deploy or a scale-in event during an upload would kill it regardless of retries",
				},
			],
			tradeoff:
				"Validation moved after the upload rather than before it, so bad files now consume storage and are rejected asynchronously.",
		},
	],
	results: [
		{
			metric: "Failed uploads over 1GB",
			before: "18% of attempts",
			after: "under 2% of attempts",
			method: "Ingest service logs, 30 days either side of the cutover, same editor cohort",
		},
	],
	reflection:
		"I would have added the async validation queue in the same release rather than the one after. For three weeks bad files accumulated in the bucket and someone had to clear them by hand.",
	links: [],
};

describe("parseCaseStudy", () => {
	it("accepts a complete, measured case study", () => {
		expect(parseCaseStudy(valid).slug).toBe("vod-ingest");
	});

	it("rejects a measured case study with no results", () => {
		expect(() => parseCaseStudy({ ...valid, results: [] })).toThrow(/measured/i);
	});

	it("rejects a qualitative case study that still carries numeric results", () => {
		expect(() => parseCaseStudy({ ...valid, evidence: "qualitative" })).toThrow(/qualitative/i);
	});

	it("rejects a result whose method is missing or too short to be a method", () => {
		const results = [{ ...valid.results[0], method: "logs" }];
		expect(() => parseCaseStudy({ ...valid, results })).toThrow();
	});

	it("rejects a decision with no rejected alternative", () => {
		const decisions = [{ ...valid.decisions[0], rejected: [] }];
		expect(() => parseCaseStudy({ ...valid, decisions })).toThrow();
	});

	it("rejects placeholder text anywhere in the content", () => {
		expect(() => parseCaseStudy({ ...valid, reflection: "TODO: write the reflection" })).toThrow(
			/placeholder/i,
		);
	});

	it("caps the stack list so it cannot become a keyword dump", () => {
		const stack = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
		expect(() => parseCaseStudy({ ...valid, stack })).toThrow();
	});
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `bun run test src/content/schema.test.ts`

Expected: FAIL — `Failed to resolve import "@/content/schema"`.

- [ ] **Step 7: Implement the schema**

Create `src/content/schema.ts`:

```ts
import { z } from "zod";
import { assertNoPlaceholders } from "@/content/guards";

export const EVIDENCE_LEVELS = ["measured", "estimated", "qualitative"] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

/**
 * A result is only allowed to exist alongside the method that produced it.
 * `method` has a length floor because "logs" or "metrics" is not a method —
 * it has to say what was measured, over what window, against what baseline.
 */
export const resultSchema = z.object({
	metric: z.string().min(3),
	before: z.string().min(1),
	after: z.string().min(1),
	method: z.string().min(25, "state what was measured, over what window, against what baseline"),
});

export const rejectedOptionSchema = z.object({
	option: z.string().min(5),
	why: z.string().min(20, "say why it was rejected, not just that it was"),
});

/**
 * The decision block is the reason this site exists. A decision with no
 * rejected alternative is a description of what was built; a decision with a
 * rejected alternative and a named cost is evidence of judgement.
 */
export const decisionSchema = z.object({
	question: z.string().min(10),
	chose: z.string().min(10),
	rejected: z.array(rejectedOptionSchema).min(1, "name at least one alternative you turned down"),
	tradeoff: z.string().min(20, "every real decision costs something; name it"),
});

export const linkSchema = z.object({
	label: z.string().min(1),
	href: z.string().url(),
});

const caseStudyShape = z.object({
	slug: z
		.string()
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase kebab-case only; it becomes the URL"),
	title: z.string().min(15).max(90),
	summary: z.string().min(40).max(220),
	organisation: z.string().min(2),
	domain: z.string().min(3),
	role: z.string().min(10),
	team: z.string().min(5),
	period: z.string().min(4),
	scope: z.string().min(40, "name what you owned and what you did not"),
	stack: z.array(z.string().min(1)).min(3).max(8),
	evidence: z.enum(EVIDENCE_LEVELS),
	context: z.string().min(120),
	constraints: z.array(z.string().min(20)).min(2, "work without constraints looks easy"),
	decisions: z.array(decisionSchema).min(1).max(4),
	results: z.array(resultSchema).max(5),
	reflection: z.string().min(80, "what you would do differently, specifically"),
	links: z.array(linkSchema).default([]),
});

export const caseStudySchema = caseStudyShape.superRefine((value, ctx) => {
	if (value.evidence === "measured" && value.results.length === 0) {
		ctx.addIssue({
			code: "custom",
			path: ["results"],
			message: "evidence is 'measured' but no results are given — downgrade to 'qualitative' or add the numbers",
		});
	}

	if (value.evidence === "qualitative" && value.results.length > 0) {
		ctx.addIssue({
			code: "custom",
			path: ["evidence"],
			message: "evidence is 'qualitative' but results are present — a number you can state is 'measured' or 'estimated'",
		});
	}
});

export type CaseStudy = z.infer<typeof caseStudyShape>;
export type Result = z.infer<typeof resultSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type RejectedOption = z.infer<typeof rejectedOptionSchema>;

export function parseCaseStudy(input: unknown): CaseStudy {
	const slug =
		input && typeof input === "object" && "slug" in input ? String(input.slug) : "unknown";
	assertNoPlaceholders(input, `case-study:${slug}`);

	const parsed = caseStudySchema.safeParse(input);
	if (!parsed.success) {
		const detail = parsed.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("; ");
		throw new Error(`case-study:${slug} is invalid — ${detail}`);
	}

	return parsed.data;
}

export const noteSchema = z.object({
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	title: z.string().min(10).max(90),
	summary: z.string().min(40).max(220),
	published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date, YYYY-MM-DD"),
	readingMinutes: z.number().int().min(1).max(60),
	tags: z.array(z.string().min(1)).min(1).max(4),
});

export type Note = z.infer<typeof noteSchema>;

export function parseNote(input: unknown): Note {
	const slug = input && typeof input === "object" && "slug" in input ? String(input.slug) : "unknown";
	assertNoPlaceholders(input, `note:${slug}`);

	const parsed = noteSchema.safeParse(input);
	if (!parsed.success) {
		const detail = parsed.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("; ");
		throw new Error(`note:${slug} is invalid — ${detail}`);
	}

	return parsed.data;
}
```

- [ ] **Step 8: Run the schema test to verify it passes**

Run: `bun run test src/content`

Expected: PASS — `12 passed`.

- [ ] **Step 9: Commit**

```bash
git add src/content/guards.ts src/content/guards.test.ts src/content/schema.ts src/content/schema.test.ts
git commit -m "$(cat <<'EOF'
feat: add content schema enforcing evidence for every claim

A case study claiming measurement must carry results, and every result
must state its method. Placeholder tokens fail the suite.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Content worksheet

The schema now rejects invented content. That means the author has to supply real material before any case study can compile. This task produces the document that collects it. It is a plan deliverable, not a placeholder — the questions are exact.

**Files:**
- Create: `docs/CONTENT-WORKSHEET.md`

**Interfaces:**
- Consumes: `EvidenceLevel` semantics from Task 2.
- Produces: the filled worksheet is the input to Task 4. No code depends on it.

- [ ] **Step 1: Write the worksheet**

Create `docs/CONTENT-WORKSHEET.md`:

````markdown
# Content worksheet

Fill this in before writing any case study. The content schema rejects
placeholder text, so anything unanswered here blocks the build — which is the
point. Answer in plain sentences; polish happens later.

## Rules

- **Anonymise, don't invent.** "A media client" is fine. A made-up number is not.
- **If you can't source a number, say the thing qualitatively.** The schema
  supports `evidence: "qualitative"` precisely so you never have to reach for a
  figure you can't defend in an interview.
- **Only claim what you owned.** Every case study has a `scope` field whose job
  is to say where your boundary was. Naming the boundary is a seniority signal.
- **Assume you will be asked about every sentence for 45 minutes.**
- **Never type these tokens, even as placeholders:** `TODO`, `TBD`,
  `Lorem ipsum`, `example.com`, `FIXME`, `<<REPLACE>>`. The build fails on
  them anywhere in content.

## Positioning (one set)

1. In one sentence, what kind of problem do you get hired to solve? Not a stack
   list — a problem shape. ("I make media and commerce backends survive
   traffic and change" is a problem shape.)
2. What are the three things you want a hiring manager to remember? Max three.
3. What are you deliberately *not* claiming? (Naming this keeps the positioning
   honest and makes the three above sharper.)
4. Current availability, in one line, with an honest response time.

## Per case study — pick exactly 3

Choose the three you can talk about for 45 minutes. Prefer the ones with
constraints and a hard decision over the ones with the biggest logos.

### Identity
1. Slug (kebab-case, becomes the URL).
2. Title — an *outcome*, not a product name. "Cutting failed video ingests by
   rebuilding the upload path", not "VOD Platform".
3. One-sentence summary a hiring manager could repeat to a colleague.
4. Organisation (anonymise if needed), domain, period, team composition.
5. **Role:** what you were responsible for on this engagement — not your job
   title.
6. **Scope:** what did you own? What did you explicitly not own?
7. **Stack:** the 3–8 technologies you used on this specific project, not
   your full skill list.

### Context (aim for 3–5 sentences)
8. What was the situation before you touched it?
9. Who was hurting, and how did that show up in the business?
10. Why was it worth engineering time?

### Constraints (at least 2, one sentence each)
11. Time, headcount, budget, legacy systems, compliance, uptime requirements,
    team skill mix — what boxed the solution in?

### Decisions (1–4; this is the most valuable section on the site)
For each:
12. The question you had to answer, phrased as a question.
13. What you chose.
14. **At least one alternative you rejected, and why.** This is mandatory.
15. **What the choice cost you.** Every real decision costs something —
    complexity, latency, money, flexibility, or someone's time. Name it.

### Results
16. Evidence level: `measured` (you have real numbers), `estimated` (you have a
    defensible approximation and will say so), or `qualitative` (no numbers).
17. If measured or estimated, per metric: what was measured, the before value,
    the after value, and **how it was measured** — instrument, window, baseline.
    Example: "p95 checkout latency, CloudWatch, 30 days either side of the
    cutover, same traffic mix."

### Reflection
18. What would you do differently? Be specific and slightly uncomfortable.
    Vague humility reads as false; a concrete regret reads as calibration.

### Links
19. Any public artefact: repo, post, talk, docs. If there is none, leave it
    empty. **Do not link a GitHub profile as if it were the project.**

## Roles (for the About page)

For each of the three roles:
1. Scope — team size, systems owned, what you were accountable for.
2. Two or three impact statements. Same rule as results: a number needs a
   method, or it stays qualitative.
3. The technologies you actually used day to day. Not everything you touched.

## Stack

List technologies grouped by *what you use them for*, not by proficiency.
No "Expert / Advanced / Intermediate" — the site no longer has that concept.
For each: what you build with it, and roughly since when.

## Writing (optional, high leverage)

One engineering note beats another project card. If you have one, it needs:
a title, a summary, a published date, and the piece itself. If you have none
yet, leave the notes registry empty — the route and nav item stay hidden until
a note exists.
````

- [ ] **Step 2: Commit**

```bash
git add docs/CONTENT-WORKSHEET.md
git commit -m "$(cat <<'EOF'
docs: add content worksheet for case study material

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Fill it in**

This step is the author's, not the implementer's. Task 4 cannot start until
`docs/CONTENT-WORKSHEET.md` has real answers. If you are an agent executing
this plan and the worksheet is unfilled, stop and report that Task 4 is blocked
on author input rather than inventing content.

---

## Task 4: Case study content

**Files:**
- Create: `src/content/case-studies/index.ts`
- Create: `src/content/case-studies/index.test.ts`
- Create: `src/content/case-studies/<slug>.ts` × 3

**Interfaces:**
- Consumes: `parseCaseStudy`, `CaseStudy` from `@/content/schema`.
- Produces:
  - `caseStudies: CaseStudy[]` (validated at module load, ordered newest first)
  - `getCaseStudy(slug: string): CaseStudy | undefined`
  - `featuredCaseStudies: CaseStudy[]` (first three)

- [ ] **Step 1: Write the failing registry test**

Create `src/content/case-studies/index.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { caseStudies, getCaseStudy } from "@/content/case-studies";

describe("case study registry", () => {
	it("publishes exactly three case studies", () => {
		expect(caseStudies).toHaveLength(3);
	});

	it("has unique slugs", () => {
		const slugs = caseStudies.map((study) => study.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("looks a case study up by slug", () => {
		expect(getCaseStudy(caseStudies[0].slug)?.title).toBe(caseStudies[0].title);
		expect(getCaseStudy("not-a-real-slug")).toBeUndefined();
	});

	it("never links a bare profile URL in place of a project", () => {
		for (const study of caseStudies) {
			for (const link of study.links) {
				expect(link.href).not.toMatch(/^https:\/\/github\.com\/[^/]+\/?$/);
			}
		}
	});

	it("states a scope boundary on every case study", () => {
		for (const study of caseStudies) {
			expect(study.scope.length).toBeGreaterThan(40);
		}
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/content/case-studies`

Expected: FAIL — `Failed to resolve import "@/content/case-studies"`.

- [ ] **Step 3: Write the first case study file**

Create `src/content/case-studies/vod-ingest.ts`. The structure below is exact
and complete; the values marked with the `<<REPLACE>>` sentinel are the ones
that require the author's real figures from the worksheet. The sentinel is
rejected by `assertNoPlaceholders`, so this file cannot compile or ship until
every one is replaced — that is the mechanism, not an oversight.

```ts
import { parseCaseStudy } from "@/content/schema";

export const vodIngest = parseCaseStudy({
	slug: "vod-ingest",
	title: "Cutting failed video ingests by rebuilding the upload path",
	summary:
		"A media client's editors were losing multi-gigabyte uploads near completion. I moved ingest off the API and onto resumable direct-to-storage transfers.",
	organisation: "BJIT Group Ltd.",
	domain: "Video streaming / VOD",
	role: "Backend engineer; owned the ingest path end to end",
	team: "<<REPLACE>> engineers, <<REPLACE>> QA, 1 product manager",
	period: "2023",
	scope:
		"I owned upload, transcode orchestration and storage lifecycle. Playback, the CDN configuration and the player UI belonged to a separate team, and I integrated against their contract rather than changing it.",
	stack: ["Node.js", "AWS S3", "CloudFront", "PostgreSQL", "Redis", "Docker"],
	evidence: "measured",
	context:
		"Editors uploaded long-form video over connections that dropped regularly. Uploads were proxied through the API, so any interruption — a dropped connection, an API deploy, a scale-in event — destroyed the transfer and the editor restarted from zero. <<REPLACE: two more sentences on who was hurting and how it showed up in the business — support tickets, missed publish windows, editor hours lost>>",
	constraints: [
		"No downtime window: the existing upload path had to keep serving while the new one was built alongside it",
		"<<REPLACE: your real second constraint — headcount, deadline, a legacy system you could not change, a compliance requirement>>",
	],
	decisions: [
		{
			question: "How do we make large uploads survive a dropped connection?",
			chose:
				"Direct-to-S3 multipart uploads with short-lived presigned URLs, resumed client-side from the last acknowledged part",
			rejected: [
				{
					option: "Keep proxying uploads through the API and add a retry loop",
					why: "The API instances would still hold each transfer in flight, so a routine deploy or a scale-in event during an upload would kill it no matter how good the retry logic was",
				},
			],
			tradeoff:
				"Validation moved after the upload instead of before it. Rejected files now consume storage and are cleaned up asynchronously, so the bucket needs a lifecycle policy that the old path did not.",
		},
		{
			question: "<<REPLACE: your second real decision, phrased as a question>>",
			chose: "<<REPLACE>>",
			rejected: [
				{
					option: "<<REPLACE>>",
					why: "<<REPLACE>>",
				},
			],
			tradeoff: "<<REPLACE: what this choice cost — complexity, latency, money, or someone's time>>",
		},
	],
	results: [
		{
			metric: "Failed uploads over 1GB",
			before: "<<REPLACE>>",
			after: "<<REPLACE>>",
			method:
				"<<REPLACE: instrument, window and baseline — e.g. 'ingest service logs, 30 days either side of the cutover, same editor cohort'>>",
		},
	],
	reflection:
		"<<REPLACE: what you would do differently, specifically. A concrete regret reads as calibration; vague humility reads as false.>>",
	links: [],
});
```

- [ ] **Step 4: Write the remaining two case study files**

Create `src/content/case-studies/<slug-2>.ts` and `src/content/case-studies/<slug-3>.ts`
using the identical structure from Step 3 — same field order, same `parseCaseStudy`
wrapper, one named export per file matching the camelCase form of the slug.

Selection guidance, in priority order:

1. **A system under real load or real constraint.** The commerce/checkout work or the legacy migration, if you owned a meaningful slice of it.
2. **A decision you can defend that went against the obvious choice.** These interview better than successes.
3. **Something recent enough to be current.** If the AI automation work is genuinely production, it belongs here — but under the same rules as everything else. If it is a prototype, say `evidence: "qualitative"`, describe it as a prototype in `context`, and let it stand on the decisions rather than on invented metrics.

Do not port the existing "Enterprise API Gateway" or "Cloud Commerce Platform"
entries as-is: both are described in `src/data/projects.ts` as designs
(`status: "Architecture pattern"`), and the new model has no honest slot for a
design presented as shipped work. Either rewrite one as the design exercise it
was — `evidence: "qualitative"`, and say so in `context` — or drop it.

- [ ] **Step 5: Write the registry**

Create `src/content/case-studies/index.ts`:

```ts
import type { CaseStudy } from "@/content/schema";
import { vodIngest } from "./vod-ingest";
// Add one import per case study file.

/**
 * Order is editorial, not chronological: the first entry is the one that best
 * answers "can this person do the job", because it is the one most readers see.
 */
export const caseStudies: CaseStudy[] = [vodIngest];

export const featuredCaseStudies = caseStudies.slice(0, 3);

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find((study) => study.slug === slug);
}
```

Extend the import list and the array as each of the three files lands.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/content`

Expected: PASS. Until every `<<REPLACE>>` is gone, the run fails at import with
`case-study:vod-ingest: unresolved placeholder text at ...` — which is the
guard doing its job, not a bug to work around.

- [ ] **Step 7: Verify the build compiles the content**

Run: `bun run build`

Expected: build succeeds. A schema violation surfaces here too, because
`parseCaseStudy` runs at module load.

- [ ] **Step 8: Commit**

```bash
git add src/content/case-studies
git commit -m "$(cat <<'EOF'
feat: add three case studies with sourced results

Each carries scope boundaries, rejected alternatives and measurement
methods. Schema-validated at import.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Profile, roles and stack data

Replaces `personal.ts`, `experience.ts` and `skills.ts`. Three changes carry the weight: one positioning line instead of four stacked claims, impact statements instead of duty lists, and a stack with no self-assigned levels and no certifications section.

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/roles.ts`
- Create: `src/data/stack.ts`
- Create: `src/data/data.test.ts`

**Interfaces:**
- Consumes: `assertNoPlaceholders` from `@/content/guards`.
- Produces:
  - `profile: Profile` — `{ name, positioning, pitch, location, availability, email, resumePath, links }`
  - `links: ProfileLink[]` — GitHub, LinkedIn, Email only
  - `roles: Role[]` — `{ id, company, title, period, location, scope, impact: string[], stack: string[] }`
  - `stackGroups: StackGroup[]` — `{ name, purpose, items: { name, usedFor, since }[] }`

- [ ] **Step 1: Write the failing data test**

Create `src/data/data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { stackGroups } from "@/data/stack";

describe("profile", () => {
	it("states a single positioning line, not a pipe-separated claim list", () => {
		expect(profile.positioning).not.toContain("|");
		expect(profile.positioning.length).toBeLessThan(160);
	});

	it("carries at most three headline points", () => {
		expect(profile.headline.length).toBeLessThanOrEqual(3);
	});

	it("does not link a YouTube channel from the primary link set", () => {
		expect(profile.links.some((link) => /youtube/i.test(link.href))).toBe(false);
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(profile)).toEqual([]);
	});
});

describe("roles", () => {
	it("names a scope for every role", () => {
		for (const role of roles) {
			expect(role.scope.length).toBeGreaterThan(30);
		}
	});

	it("keeps impact statements to at most three per role", () => {
		for (const role of roles) {
			expect(role.impact.length).toBeLessThanOrEqual(3);
			expect(role.impact.length).toBeGreaterThan(0);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(roles)).toEqual([]);
	});
});

describe("stack", () => {
	it("assigns no proficiency levels", () => {
		const serialised = JSON.stringify(stackGroups);
		expect(serialised).not.toMatch(/expert|advanced|intermediate|beginner/i);
	});

	it("keeps each group short enough to read", () => {
		for (const group of stackGroups) {
			expect(group.items.length).toBeLessThanOrEqual(7);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(stackGroups)).toEqual([]);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/data`

Expected: FAIL — `Failed to resolve import "@/data/profile"`.

- [ ] **Step 3: Write the profile**

Create `src/data/profile.ts`. Replace the bracketed guidance with the
worksheet answers; the shape is fixed.

```ts
export interface ProfileLink {
	label: string;
	href: string;
}

export interface Profile {
	name: string;
	/** One sentence naming the problem shape you are hired for. No stack lists. */
	positioning: string;
	/** Two short paragraphs. First: what you do and for whom. Second: how you work. */
	pitch: string[];
	/** At most three. These are the things you want remembered. */
	headline: string[];
	location: string;
	timezone: string;
	availability: string;
	responseTime: string;
	email: string;
	resumePath: string;
	links: ProfileLink[];
	/** Kept out of the primary link set on purpose; surfaced once, in About. */
	teaching?: ProfileLink;
}

export const profile: Profile = {
	name: "Md. Anwar Hossain",
	positioning:
		"I build and operate the backend and cloud systems that media and commerce products run on, and I keep them working while they change.",
	pitch: [
		"Six years across three companies, most of it on systems where uptime and throughput were the product: video ingest and delivery, transaction-heavy APIs, and the AWS infrastructure underneath them.",
		"I work from the constraint inwards. Most of what I ship is a smaller change than the one originally proposed, chosen because it survives the deploy schedule, the team that has to maintain it, and the traffic that arrives afterwards.",
	],
	headline: [
		"Backend and cloud systems on AWS — serverless and containerised",
		"Media pipelines: ingest, transcode orchestration, CDN delivery",
		"Delivery practice: CI/CD, rollback-ready releases, production ownership",
	],
	location: "Dhaka, Bangladesh",
	timezone: "UTC+6",
	availability: "Open to senior backend and platform roles, remote or Dhaka-based.",
	responseTime: "I reply to email within two working days.",
	email: "anwarmahedisr@gmail.com",
	resumePath: "/resume.pdf",
	links: [
		{ label: "GitHub", href: "https://github.com/AnwarHossainSR" },
		{ label: "LinkedIn", href: "https://www.linkedin.com/in/anwarsr/" },
	],
	teaching: {
		label: "React tutorial series on YouTube",
		href: "https://www.youtube.com/@DevelopmentKit",
	},
};
```

- [ ] **Step 4: Write the roles**

Create `src/data/roles.ts`:

```ts
export interface Role {
	id: string;
	company: string;
	title: string;
	period: string;
	location: string;
	/** What you were accountable for. Team size and systems owned. */
	scope: string;
	/** At most three. Outcomes, not duties. A number here needs a method in the sentence. */
	impact: string[];
	/** What you used day to day. Not everything you ever touched. */
	stack: string[];
}

export const roles: Role[] = [
	{
		id: "craftsmen",
		company: "Craftsmen Ltd.",
		title: "Senior Software Engineer",
		period: "2024 — present",
		location: "Dhaka, Bangladesh",
		scope:
			"Backend and cloud work across production product systems, plus review and architecture input for a team of six.",
		impact: [
			"<<REPLACE: an outcome, not a duty. 'Led implementation work across React, Node.js and databases' is a duty. What changed because you were there?>>",
			"<<REPLACE: second outcome>>",
		],
		stack: ["AWS", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Terraform"],
	},
	{
		id: "bjit",
		company: "BJIT Group Ltd.",
		title: "Software Engineer",
		period: "2021 — 2024",
		location: "Dhaka, Bangladesh",
		scope: "<<REPLACE: team size, systems owned, what you were accountable for>>",
		impact: ["<<REPLACE>>", "<<REPLACE>>"],
		stack: ["PHP", "Laravel", "Node.js", "React", "MySQL", "AWS EC2"],
	},
	{
		id: "annon-lab",
		company: "Annon Lab",
		title: "Junior Software Developer",
		period: "2020 — 2021",
		location: "Dhaka, Bangladesh",
		scope: "<<REPLACE: keep this one short — early roles earn two lines, not five>>",
		impact: ["<<REPLACE>>"],
		stack: ["JavaScript", "React", "PHP", "MySQL"],
	},
];
```

Note the shrinking entry sizes: the 2020 role gets one impact line. Giving equal
space to a first job and a current senior role is itself a junior signal.

- [ ] **Step 5: Write the stack**

Create `src/data/stack.ts`:

```ts
export interface StackItem {
	name: string;
	/** What you build with it. One clause. */
	usedFor: string;
	/** Roughly since when. A year, not a self-graded level. */
	since: string;
}

export interface StackGroup {
	name: string;
	purpose: string;
	items: StackItem[];
}

/**
 * Deliberately has no proficiency field. Self-assigned levels are the least
 * reliable evidence on a portfolio, and 44 of them read as breadth-anxiety.
 * What a technology is used for is checkable in conversation; "Expert" is not.
 */
export const stackGroups: StackGroup[] = [
	{
		name: "Services and APIs",
		purpose: "What I reach for when the work is a backend that has to stay up.",
		items: [
			{ name: "Node.js + TypeScript", usedFor: "Most production services since 2021", since: "2019" },
			{ name: "Express", usedFor: "HTTP layer on the Node services", since: "2019" },
			{ name: "Laravel / PHP", usedFor: "Enterprise applications at BJIT and Annon Lab", since: "2020" },
			{ name: "PostgreSQL", usedFor: "Primary datastore; schema design and query tuning", since: "2021" },
			{ name: "Redis", usedFor: "Caching and queues in front of hot paths", since: "2021" },
		],
	},
	{
		name: "AWS and delivery",
		purpose: "Where those services run, and how they get there.",
		items: [
			{ name: "Lambda + API Gateway", usedFor: "Event-driven and request-scoped workloads", since: "2021" },
			{ name: "S3 + CloudFront", usedFor: "Media storage and delivery on the VOD work", since: "2022" },
			{ name: "ECS + EC2", usedFor: "Long-running containerised services", since: "2022" },
			{ name: "Terraform", usedFor: "Environment provisioning; parity between staging and prod", since: "2023" },
			{ name: "GitHub Actions", usedFor: "Build, test and deploy pipelines with rollback", since: "2022" },
		],
	},
	{
		name: "Interfaces",
		purpose: "The front end I build when the product needs one.",
		items: [
			{ name: "React", usedFor: "Product interfaces and internal tools", since: "2020" },
			{ name: "Next.js", usedFor: "Server-rendered product surfaces", since: "2022" },
			{ name: "Tailwind CSS", usedFor: "Styling, including this site", since: "2022" },
		],
	},
];
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/data`

Expected: PASS once every `<<REPLACE>>` is filled from the worksheet. Until
then, the placeholder assertions fail by design.

- [ ] **Step 7: Commit**

```bash
git add src/data/profile.ts src/data/roles.ts src/data/stack.ts src/data/data.test.ts
git commit -m "$(cat <<'EOF'
feat: replace claim-shaped data with scope and evidence

One positioning line, impact statements with methods, stack grouped by
purpose. Drops self-assigned proficiency levels entirely.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Remove the junior surfaces

The largest single improvement in this plan, and it is all deletion: the AI chatbot with a bundled API key, the tutorial-channel page, the self-graded skills page with fabricated certifications, the placeholder blog, both canvas backgrounds, the fake terminal, and four dead effect components. Do this before building new pages so the new pages are written against a clean route table.

**Files:**
- Delete: `src/pages/AskAi.tsx`, `src/pages/YouTube.tsx`, `src/pages/Blogs.tsx`, `src/pages/Skills.tsx`, `src/pages/Projects.tsx`, `src/pages/Experience.tsx`, `src/pages/Index.tsx`
- Delete: `src/data/youtube.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/personal.ts`, `src/data/experience.ts`
- Delete: `src/components/ParticleBackground.tsx`, `src/components/InteractiveBackground.tsx`, `src/components/Terminal.tsx`, `src/components/FloatingIcons.tsx`, `src/components/TypingEffect.tsx`, `src/components/StatsCounter.tsx`, `src/components/LoadingScreen.tsx`, `src/App.css`
- Delete: `.env`, `.env.example`
- Modify: `src/App.tsx`, `src/components/Layout.tsx`, `src/components/Navigation.tsx`, `src/components/Footer.tsx`, `src/pages/Home.tsx` (drop `Terminal` import only), `src/pages/About.tsx`, `src/pages/Contact.tsx` (swap `personalInfo` → `profile`)
- Create: `src/App.test.tsx`

**Interfaces:**
- Consumes: `profile` from `@/data/profile`, `caseStudies` from `@/content/case-studies`.
- Produces: route table `/`, `/work`, `/work/:slug`, `/about`, `/contact`, plus redirects `/projects` → `/work`, `/skills` → `/about#stack`, `/experience` → `/about#track-record`. `NAV_ITEMS` exported from `@/components/Navigation`.

- [ ] **Step 1: Write the failing routing test**

Create `src/App.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "@/components/Navigation";
import { renderWithRouter } from "@/test/render";
import App from "@/App";

describe("navigation", () => {
	it("exposes four primary items", () => {
		expect(NAV_ITEMS.map((item) => item.label)).toEqual(["Work", "About", "Writing", "Contact"]);
	});

	it("does not offer a YouTube or Ask AI destination", () => {
		const hrefs = NAV_ITEMS.map((item) => item.href).join(" ");
		expect(hrefs).not.toMatch(/youtube|ask-ai/);
	});
});

describe("routes", () => {
	it("404s the removed AI chatbot route", async () => {
		renderWithRouter(<App />, { route: "/ask-ai" });
		expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
	});

	it("404s the removed YouTube route", async () => {
		renderWithRouter(<App />, { route: "/youtube" });
		expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
	});

	it("redirects the old projects URL to work", async () => {
		renderWithRouter(<App />, { route: "/projects" });
		expect(await screen.findByRole("heading", { level: 1, name: /selected work/i })).toBeInTheDocument();
	});
});
```

`App` currently mounts its own `BrowserRouter`, so this test will fail on a
nested-router error until Step 3 lifts routing out of `App`.

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/App.test.tsx`

Expected: FAIL — `NAV_ITEMS` is not exported, and `App` renders its own router.

- [ ] **Step 3: Delete the files**

```bash
git rm src/pages/AskAi.tsx src/pages/YouTube.tsx src/pages/Blogs.tsx \
       src/pages/Skills.tsx src/pages/Projects.tsx src/pages/Experience.tsx \
       src/pages/Index.tsx
git rm src/data/youtube.ts src/data/projects.ts src/data/skills.ts \
       src/data/personal.ts src/data/experience.ts
git rm src/components/ParticleBackground.tsx src/components/InteractiveBackground.tsx \
       src/components/Terminal.tsx src/components/FloatingIcons.tsx \
       src/components/TypingEffect.tsx src/components/StatsCounter.tsx \
       src/components/LoadingScreen.tsx src/App.css
git rm --cached .env 2>/dev/null || true
rm -f .env .env.example
```

`.env` is already gitignored, so `git rm --cached` is a safety net; the `|| true`
covers the case where it was never tracked.

- [ ] **Step 4: Move the router out of App and rewrite the route table**

Replace `src/App.tsx` in full:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEOProvider } from "@/components/SEO";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { notes } from "@/content/notes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const Home = lazy(() => import("@/pages/Home"));
const Work = lazy(() => import("@/pages/Work"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Writing = lazy(() => import("@/pages/Writing"));
const Note = lazy(() => import("@/pages/Note"));

function PageLoader() {
	return <div className="min-h-[60vh]" aria-busy="true" />;
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SEOProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<Layout>
						<Suspense fallback={<PageLoader />}>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/work" element={<Work />} />
								<Route path="/work/:slug" element={<CaseStudy />} />
								<Route path="/about" element={<About />} />
								<Route path="/contact" element={<Contact />} />
								{notes.length > 0 && (
									<>
										<Route path="/writing" element={<Writing />} />
										<Route path="/writing/:slug" element={<Note />} />
									</>
								)}
								{/* Old URLs keep working; inbound links and search results still land. */}
								<Route path="/projects" element={<Navigate to="/work" replace />} />
								<Route path="/skills" element={<Navigate to="/about#stack" replace />} />
								<Route path="/experience" element={<Navigate to="/about#track-record" replace />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</Suspense>
					</Layout>
				</TooltipProvider>
			</SEOProvider>
		</QueryClientProvider>
	);
}
```

The empty `PageLoader` replaces "Loading portfolio…" — a visible loading string
on a route transition that takes 40ms is worse than nothing.

- [ ] **Step 5: Mount the router at the entry point**

Modify `src/main.tsx` so `BrowserRouter` wraps `<App />` there. Read the current
file first; the change is to wrap the existing `<App />` element:

```tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
```

If `main.tsx` currently imports `./App.css`, remove that import — the file is deleted.

- [ ] **Step 6: Strip the decorative layer from Layout**

Replace `src/components/Layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-background">
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
			>
				Skip to content
			</a>
			<Navigation />
			<main id="main">{children}</main>
			<Footer />
		</div>
	);
}
```

Two canvas animations are gone and a skip link is in. `React.memo` on a layout
that takes `children` never helped — children change identity every render.

- [ ] **Step 7: Rewrite Navigation**

Replace `src/components/Navigation.tsx`:

```tsx
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { notes } from "@/content/notes";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface NavItem {
	label: string;
	href: string;
}

/**
 * Four items. The old eight-item bar was breadth-first; this one exists to get
 * a reader to one deep artefact. "Writing" is listed but only routed when a
 * note exists — an empty writing section is worse than no writing section.
 */
export const NAV_ITEMS: NavItem[] = [
	{ label: "Work", href: "/work" },
	{ label: "About", href: "/about" },
	{ label: "Writing", href: "/writing" },
	{ label: "Contact", href: "/contact" },
];

export function Navigation() {
	const [open, setOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setOpen(false);
	}, [location]);

	const items = NAV_ITEMS.filter((item) => item.href !== "/writing" || notes.length > 0);

	return (
		<header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-5 sm:px-8">
				<Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
					{profile.name}
				</Link>

				<nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
					{items.map((item) => (
						<Link
							key={item.href}
							to={item.href}
							aria-current={location.pathname.startsWith(item.href) ? "page" : undefined}
							className={cn(
								"rounded-md px-3 py-2 text-sm transition-colors",
								location.pathname.startsWith(item.href)
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{item.label}
						</Link>
					))}
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="ml-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						Résumé
					</a>
					<ThemeToggle />
				</nav>

				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-controls="mobile-nav"
					aria-label={open ? "Close menu" : "Open menu"}
					className="rounded-md p-2 text-muted-foreground sm:hidden"
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			<nav
				id="mobile-nav"
				aria-label="Primary"
				hidden={!open}
				className="border-t border-border/70 px-5 pb-5 pt-2 sm:hidden"
			>
				{items.map((item) => (
					<Link key={item.href} to={item.href} className="block py-2.5 text-sm text-muted-foreground">
						{item.label}
					</Link>
				))}
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="block py-2.5 text-sm text-muted-foreground"
				>
					Résumé
				</a>
				<div className="pt-3">
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
```

Sticky replaces fixed, so the spacer `<div className="h-16" />` and the scroll
listener both go. The wordmark is the name rather than `Anwar.dev`.

- [ ] **Step 8: Rewrite the Footer**

Replace `src/components/Footer.tsx`:

```tsx
import { Link } from "react-router-dom";
import { NAV_ITEMS } from "@/components/Navigation";
import { notes } from "@/content/notes";
import { profile } from "@/data/profile";

export function Footer() {
	const items = NAV_ITEMS.filter((item) => item.href !== "/writing" || notes.length > 0);

	return (
		<footer className="mt-24 border-t border-border/70">
			<div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
				<p>
					{profile.name} · {profile.location}
				</p>
				<nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
					{items.map((item) => (
						<Link key={item.href} to={item.href} className="transition-colors hover:text-foreground">
							{item.label}
						</Link>
					))}
					{profile.links.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer"
							className="transition-colors hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
```

- [ ] **Step 9: Unblock the remaining compile errors**

`Home.tsx`, `About.tsx` and `Contact.tsx` still import the deleted data modules.
Those pages are rewritten in Tasks 8–11; for now make the tree compile:

- In `src/pages/Home.tsx`: delete the `Terminal` import and its `<Terminal />` usage; change `import { personalInfo } from "@/data/personal"` to `import { profile } from "@/data/profile"` and replace `personalInfo.name` → `profile.name`, `personalInfo.bio.short` → `profile.pitch[0]`, `personalInfo.avatar` → `"/images/profile.png"`, `personalInfo.linkedin` → the LinkedIn entry from `profile.links`, `personalInfo.title`/`subtitle` → `profile.positioning`, `personalInfo.highlights` → `profile.headline`. Delete the `featuredProjects`, `topSkills` and `experienceStats` imports and the sections that use them.
- In `src/pages/About.tsx` and `src/pages/Contact.tsx`: same substitution for `personalInfo` → `profile`; delete `experienceStats` usage and the `socialLinks` import (use `profile.links`).

These pages are replaced wholesale in Tasks 9–11. This step only needs `bun run build` to pass.

- [ ] **Step 10: Add an empty notes registry so imports resolve**

Create `src/content/notes/index.ts`:

```ts
import type { Note } from "@/content/schema";

/**
 * Empty until a real note exists. The /writing route and its nav item are
 * conditional on this array, so an empty writing section can never ship.
 */
export const notes: Note[] = [];

export function getNote(slug: string): Note | undefined {
	return notes.find((note) => note.slug === slug);
}
```

- [ ] **Step 11: Create placeholder page modules so the route table compiles**

The lazy imports in `App.tsx` reference four pages that do not exist yet. Create
minimal versions now; Tasks 8–12 fill them in.

```bash
for page in Work CaseStudy Writing Note; do
	printf 'export default function %s() {\n\treturn null;\n}\n' "$page" > "src/pages/$page.tsx"
done
```

- [ ] **Step 12: Give NotFound something to say**

Replace `src/pages/NotFound.tsx`:

```tsx
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";

export default function NotFound() {
	return (
		<>
			<SEOHead title="Page not found" noIndex />
			<div className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
				<h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
				<p className="mt-3 max-w-prose text-muted-foreground">
					That page does not exist. The work is at{" "}
					<Link to="/work" className="text-foreground underline underline-offset-4">
						/work
					</Link>
					.
				</p>
			</div>
		</>
	);
}
```

`SEOHead` does not accept `noIndex` yet — Task 13 adds it. Until then, omit the
prop or add the boolean to `SEOProps` as a one-line change.

- [ ] **Step 13: Run the tests to verify they pass**

Run: `bun run test`

Expected: PASS. The `/projects` redirect test still fails until `Work.tsx` renders
its heading in Task 8 — mark that one `it.todo` if you need a green run here, and
restore it in Task 8 Step 6.

- [ ] **Step 14: Verify the build**

Run: `bun run lint && bun run build`

Expected: both succeed. Confirm no `VITE_GEMINI` reference survives:

```bash
grep -rn "GEMINI\|gemini" src/ index.html || echo "clean"
```

Expected: `clean`.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor: remove chatbot, tutorials, self-graded skills and decoration

Deletes the client-side Gemini key path, the YouTube page, the fabricated
certifications, the placeholder blog, two canvas backgrounds and four dead
effect components. Nav goes from eight items to four; old URLs redirect.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Case study presentation components

Three small components carry the case-study page. They are separate files because each has one job and each gets its own test, and because `CaseStudy.tsx` stays readable as a result.

**Files:**
- Create: `src/components/case-study/EvidenceBadge.tsx`
- Create: `src/components/case-study/DecisionBlock.tsx`
- Create: `src/components/case-study/ResultsTable.tsx`
- Create: `src/components/case-study/case-study.test.tsx`
- Create: `src/components/Prose.tsx`

**Interfaces:**
- Consumes: `Decision`, `Result`, `EvidenceLevel` from `@/content/schema`.
- Produces:
  - `<EvidenceBadge level={EvidenceLevel} />`
  - `<DecisionBlock decision={Decision} index={number} />`
  - `<ResultsTable results={Result[]} />`
  - `<Prose>{children}</Prose>` — 68ch measure wrapper

- [ ] **Step 1: Write the failing component test**

Create `src/components/case-study/case-study.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { ResultsTable } from "@/components/case-study/ResultsTable";

const decision = {
	question: "How do we make large uploads survive a dropped connection?",
	chose: "Direct-to-S3 multipart uploads with presigned URLs",
	rejected: [
		{
			option: "Keep proxying uploads through the API",
			why: "A deploy during an upload would kill the transfer regardless of retries",
		},
	],
	tradeoff: "Validation moved after the upload, so rejected files consume storage.",
};

const results = [
	{
		metric: "Failed uploads over 1GB",
		before: "18% of attempts",
		after: "under 2% of attempts",
		method: "Ingest service logs, 30 days either side of the cutover, same editor cohort",
	},
];

describe("EvidenceBadge", () => {
	it("labels measured evidence", () => {
		render(<EvidenceBadge level="measured" />);
		expect(screen.getByText("Measured")).toBeInTheDocument();
	});

	it("labels qualitative evidence honestly rather than hiding it", () => {
		render(<EvidenceBadge level="qualitative" />);
		expect(screen.getByText("No metrics claimed")).toBeInTheDocument();
	});
});

describe("DecisionBlock", () => {
	it("shows the question, the choice, the rejected option with its reason, and the cost", () => {
		render(<DecisionBlock decision={decision} index={0} />);
		expect(screen.getByText(decision.question)).toBeInTheDocument();
		expect(screen.getByText(decision.chose)).toBeInTheDocument();
		expect(screen.getByText(decision.rejected[0].option)).toBeInTheDocument();
		expect(screen.getByText(decision.rejected[0].why)).toBeInTheDocument();
		expect(screen.getByText(decision.tradeoff)).toBeInTheDocument();
	});
});

describe("ResultsTable", () => {
	it("renders the method alongside every number", () => {
		render(<ResultsTable results={results} />);
		expect(screen.getByText(results[0].method)).toBeInTheDocument();
		expect(screen.getByText("18% of attempts")).toBeInTheDocument();
	});

	it("renders nothing when there are no results", () => {
		const { container } = render(<ResultsTable results={[]} />);
		expect(container).toBeEmptyDOMElement();
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/case-study`

Expected: FAIL — unresolved imports for all three components.

- [ ] **Step 3: Implement EvidenceBadge**

Create `src/components/case-study/EvidenceBadge.tsx`:

```tsx
import type { EvidenceLevel } from "@/content/schema";

const LABELS: Record<EvidenceLevel, { text: string; hint: string }> = {
	measured: {
		text: "Measured",
		hint: "Numbers below come with the instrument and window used to collect them.",
	},
	estimated: {
		text: "Estimated",
		hint: "Numbers below are defensible approximations, not instrumented measurements.",
	},
	qualitative: {
		text: "No metrics claimed",
		hint: "I do not have figures I can source for this work, so none are given.",
	},
};

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
	const label = LABELS[level];

	return (
		<span
			title={label.hint}
			className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
		>
			{label.text}
		</span>
	);
}

export { LABELS as EVIDENCE_LABELS };
```

Saying "No metrics claimed" out loud is the point. Silence about missing numbers
reads as an omission; stating it reads as a standard.

- [ ] **Step 4: Implement DecisionBlock**

Create `src/components/case-study/DecisionBlock.tsx`:

```tsx
import type { Decision } from "@/content/schema";

export function DecisionBlock({ decision, index }: { decision: Decision; index: number }) {
	return (
		<article className="border-t border-border/70 pt-8">
			<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
				Decision {index + 1}
			</p>
			<h3 className="mt-3 max-w-[46ch] text-xl font-semibold leading-snug tracking-tight">
				{decision.question}
			</h3>

			<dl className="mt-6 grid gap-6 sm:grid-cols-2">
				<div>
					<dt className="text-sm font-medium text-foreground">Chose</dt>
					<dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{decision.chose}</dd>
				</div>
				<div>
					<dt className="text-sm font-medium text-foreground">
						Rejected
					</dt>
					<dd className="mt-2 space-y-4">
						{decision.rejected.map((option) => (
							<div key={option.option}>
								<p className="text-[15px] leading-relaxed text-muted-foreground">{option.option}</p>
								<p className="mt-1 text-[15px] leading-relaxed text-muted-foreground/80">
									{option.why}
								</p>
							</div>
						))}
					</dd>
				</div>
			</dl>

			<div className="mt-6 border-l-2 border-accent/60 pl-4">
				<p className="text-sm font-medium text-foreground">What it cost</p>
				<p className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
					{decision.tradeoff}
				</p>
			</div>
		</article>
	);
}
```

- [ ] **Step 5: Implement ResultsTable**

Create `src/components/case-study/ResultsTable.tsx`:

```tsx
import type { Result } from "@/content/schema";

export function ResultsTable({ results }: { results: Result[] }) {
	if (results.length === 0) {
		return null;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
				<caption className="sr-only">Measured results, with the method used for each</caption>
				<thead>
					<tr className="border-b border-border">
						<th scope="col" className="py-2.5 pr-6 text-sm font-medium text-muted-foreground">Metric</th>
						<th scope="col" className="py-2.5 pr-6 text-sm font-medium text-muted-foreground">Before</th>
						<th scope="col" className="py-2.5 pr-6 text-sm font-medium text-muted-foreground">After</th>
					</tr>
				</thead>
				<tbody>
					{results.map((result) => (
						<tr key={result.metric} className="border-b border-border/60 align-top">
							<th scope="row" className="py-4 pr-6 font-normal text-foreground">
								{result.metric}
								{/* The method is the reason the number is worth anything. It sits with
								    the row rather than in a footnote so it cannot be skimmed past. */}
								<span className="mt-1.5 block text-[13px] leading-relaxed text-muted-foreground">
									{result.method}
								</span>
							</th>
							<td className="py-4 pr-6 text-muted-foreground">{result.before}</td>
							<td className="py-4 pr-6 text-foreground">{result.after}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
```

- [ ] **Step 6: Implement Prose**

Create `src/components/Prose.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Constrains running text to a readable measure. Long-form case studies are the
 * point of this site, and full-width paragraphs on a 1440px display are the
 * fastest way to make nobody read them.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("max-w-[68ch] text-[17px] leading-[1.75] text-muted-foreground", className)}>
			{children}
		</div>
	);
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `bun run test src/components/case-study`

Expected: PASS — `5 passed`.

- [ ] **Step 8: Commit**

```bash
git add src/components/case-study src/components/Prose.tsx
git commit -m "$(cat <<'EOF'
feat: add decision, results and evidence components

Every number renders next to its method; every decision renders next to
the alternative it beat and the cost it carried.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Work index page

**Files:**
- Modify: `src/pages/Work.tsx` (replace the stub from Task 6)
- Create: `src/pages/Work.test.tsx`

**Interfaces:**
- Consumes: `caseStudies` from `@/content/case-studies`, `EvidenceBadge`, `SEOHead`.
- Produces: default-exported `Work` page component. `h1` text is "Selected work" — `App.test.tsx` asserts on it.

- [ ] **Step 1: Write the failing page test**

Create `src/pages/Work.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import Work from "@/pages/Work";
import { renderWithRouter } from "@/test/render";

describe("Work", () => {
	it("lists every case study as a link to its detail page", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			const link = screen.getByRole("link", { name: new RegExp(study.title, "i") });
			expect(link).toHaveAttribute("href", `/work/${study.slug}`);
		}
	});

	it("shows the evidence level for each entry on the index", () => {
		renderWithRouter(<Work />);
		expect(screen.getAllByTitle(/numbers below|do not have figures/i).length).toBe(
			caseStudies.length,
		);
	});

	it("does not render a technology count or a projects-delivered counter", () => {
		renderWithRouter(<Work />);
		expect(screen.queryByText(/50\+/)).not.toBeInTheDocument();
		expect(screen.queryByText(/projects delivered/i)).not.toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/pages/Work.test.tsx`

Expected: FAIL — the stub renders `null`, so `getByRole("link")` finds nothing.

- [ ] **Step 3: Implement the page**

Replace `src/pages/Work.tsx`:

```tsx
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { caseStudies } from "@/content/case-studies";

export default function Work() {
	return (
		<>
			<SEOHead
				title="Selected work"
				description="Three engineering case studies: the constraints, the decisions and the alternatives rejected, with the method behind every number."
				path="/work"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<header className="max-w-[58ch]">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Selected work</h1>
					<p className="mt-5 text-[17px] leading-[1.75] text-muted-foreground">
						Three systems, written up in full: what the situation was, what boxed the solution
						in, what I chose and what I turned down, and how the results were measured. Fewer
						entries than a project grid, on purpose — these are the ones I can talk through for
						an hour.
					</p>
				</header>

				<ol className="mt-16 space-y-16">
					{caseStudies.map((study) => (
						<li key={study.slug} className="border-t border-border/70 pt-8">
							<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
								<span>{study.organisation}</span>
								<span aria-hidden="true">·</span>
								<span>{study.period}</span>
								<span aria-hidden="true">·</span>
								<span>{study.domain}</span>
								<EvidenceBadge level={study.evidence} />
							</div>

							<h2 className="mt-4 max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">
								<Link
									to={`/work/${study.slug}`}
									className="transition-colors hover:text-accent focus-visible:text-accent"
								>
									{study.title}
								</Link>
							</h2>

							<p className="mt-4 max-w-[64ch] text-[17px] leading-[1.75] text-muted-foreground">
								{study.summary}
							</p>

							<p className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground/85">
								<span className="text-foreground">Scope. </span>
								{study.scope}
							</p>

							<p className="mt-5 text-sm text-muted-foreground">{study.stack.join(" · ")}</p>

							<p className="mt-6">
								<Link
									to={`/work/${study.slug}`}
									className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-accent"
								>
									Read the case study
								</Link>
							</p>
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
```

Each entry shows its scope boundary on the index, before anyone clicks. That is
the fastest available seniority signal and it costs one line.

- [ ] **Step 4: Run the page test to verify it passes**

Run: `bun run test src/pages/Work.test.tsx`

Expected: PASS — `3 passed`.

- [ ] **Step 5: Restore the redirect assertion**

If Task 6 Step 13 marked the `/projects` redirect test `it.todo`, restore it to `it` now.

Run: `bun run test src/App.test.tsx`

Expected: PASS — `5 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Work.tsx src/pages/Work.test.tsx src/App.test.tsx
git commit -m "$(cat <<'EOF'
feat: add work index with scope and evidence on every entry

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Case study detail page

The page the whole site exists to deliver a reader to.

**Files:**
- Modify: `src/pages/CaseStudy.tsx` (replace the stub)
- Create: `src/pages/CaseStudy.test.tsx`

**Interfaces:**
- Consumes: `getCaseStudy` from `@/content/case-studies`; `DecisionBlock`, `ResultsTable`, `EvidenceBadge`, `Prose`; `useParams` from React Router.
- Produces: default-exported `CaseStudy` page. Unknown slugs render `NotFound`.

- [ ] **Step 1: Write the failing page test**

Create `src/pages/CaseStudy.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { caseStudies } from "@/content/case-studies";
import CaseStudy from "@/pages/CaseStudy";
import { renderWithRouter } from "@/test/render";

const study = caseStudies[0];

function renderAt(slug: string) {
	return renderWithRouter(
		<Routes>
			<Route path="/work/:slug" element={<CaseStudy />} />
		</Routes>,
		{ route: `/work/${slug}` },
	);
}

describe("CaseStudy", () => {
	it("renders the title as the page heading", () => {
		renderAt(study.slug);
		expect(screen.getByRole("heading", { level: 1, name: study.title })).toBeInTheDocument();
	});

	it("renders context, constraints, every decision and the reflection", () => {
		renderAt(study.slug);
		expect(screen.getByRole("heading", { name: /the situation/i })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: /constraints/i })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: /what i'd do differently/i })).toBeInTheDocument();
		for (const decision of study.decisions) {
			expect(screen.getByText(decision.question)).toBeInTheDocument();
		}
	});

	it("states the scope boundary", () => {
		renderAt(study.slug);
		expect(screen.getByText(study.scope)).toBeInTheDocument();
	});

	it("renders the method for every result", () => {
		renderAt(study.slug);
		for (const result of study.results) {
			expect(screen.getByText(result.method)).toBeInTheDocument();
		}
	});

	it("renders a not-found page for an unknown slug", () => {
		renderAt("no-such-case-study");
		expect(screen.getByText(/page not found/i)).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/pages/CaseStudy.test.tsx`

Expected: FAIL — the stub renders `null`.

- [ ] **Step 3: Implement the page**

Replace `src/pages/CaseStudy.tsx`:

```tsx
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { ResultsTable } from "@/components/case-study/ResultsTable";
import { getCaseStudy } from "@/content/case-studies";
import NotFound from "@/pages/NotFound";

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="mt-14 border-t border-border/70 pt-8">
			<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</h2>
			<div className="mt-5">{children}</div>
		</section>
	);
}

export default function CaseStudy() {
	const { slug } = useParams();
	const study = slug ? getCaseStudy(slug) : undefined;

	if (!study) {
		return <NotFound />;
	}

	return (
		<>
			<SEOHead
				title={study.title}
				description={study.summary}
				path={`/work/${study.slug}`}
				type="article"
			/>
			<article className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<Link
					to="/work"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					All work
				</Link>

				<header className="mt-8">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
						<span>{study.organisation}</span>
						<span aria-hidden="true">·</span>
						<span>{study.period}</span>
						<span aria-hidden="true">·</span>
						<span>{study.domain}</span>
						<EvidenceBadge level={study.evidence} />
					</div>

					<h1 className="mt-5 max-w-[22ch] text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[40px]">
						{study.title}
					</h1>

					<p className="mt-6 max-w-[64ch] text-[19px] leading-[1.65] text-muted-foreground">
						{study.summary}
					</p>

					<dl className="mt-10 grid gap-6 border-t border-border/70 pt-6 sm:grid-cols-3">
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Role</dt>
							<dd className="mt-2 text-[15px] text-foreground">{study.role}</dd>
						</div>
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Team</dt>
							<dd className="mt-2 text-[15px] text-foreground">{study.team}</dd>
						</div>
						<div>
							<dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stack</dt>
							<dd className="mt-2 text-[15px] text-foreground">{study.stack.join(" · ")}</dd>
						</div>
					</dl>
				</header>

				{/* Scope sits above the narrative on purpose: a reader should know what
				    was mine before they read what happened. */}
				<Section title="What I owned">
					<Prose>
						<p>{study.scope}</p>
					</Prose>
				</Section>

				<Section title="The situation">
					<Prose>
						<p>{study.context}</p>
					</Prose>
				</Section>

				<Section title="Constraints">
					<ul className="max-w-[68ch] space-y-3">
						{study.constraints.map((constraint) => (
							<li
								key={constraint}
								className="border-l-2 border-border pl-4 text-[17px] leading-[1.7] text-muted-foreground"
							>
								{constraint}
							</li>
						))}
					</ul>
				</Section>

				<Section title="Decisions">
					<div className="space-y-12">
						{study.decisions.map((decision, index) => (
							<DecisionBlock key={decision.question} decision={decision} index={index} />
						))}
					</div>
				</Section>

				{study.results.length > 0 && (
					<Section title="Results">
						<ResultsTable results={study.results} />
					</Section>
				)}

				<Section title="What I'd do differently">
					<Prose>
						<p>{study.reflection}</p>
					</Prose>
				</Section>

				{study.links.length > 0 && (
					<Section title="Links">
						<ul className="space-y-2">
							{study.links.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer"
										className="text-[15px] text-foreground underline underline-offset-4 hover:text-accent"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</Section>
				)}
			</article>
		</>
	);
}
```

- [ ] **Step 4: Run the page test to verify it passes**

Run: `bun run test src/pages/CaseStudy.test.tsx`

Expected: PASS — `5 passed`.

- [ ] **Step 5: Look at it in the browser**

Run: `bun run dev` and open `http://localhost:3000/work/<slug>`.

Check: the reading measure is comfortable, the decision blocks are the visual
centre of the page, and the results table scrolls rather than overflowing on a
375px viewport.

- [ ] **Step 6: Commit**

```bash
git add src/pages/CaseStudy.tsx src/pages/CaseStudy.test.tsx
git commit -m "$(cat <<'EOF'
feat: add case study detail page

Scope, situation, constraints, decisions with rejected alternatives,
results with methods, and a reflection.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Home page

The ninety-second page. One positioning line, three case studies, one contact path. No metric tiles, no skill cloud, no services grid, no terminal.

**Files:**
- Modify: `src/pages/Home.tsx` (full replacement)
- Create: `src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `profile`, `featuredCaseStudies`, `EvidenceBadge`, `SEOHead`.
- Produces: default-exported `Home`.

- [ ] **Step 1: Write the failing page test**

Create `src/pages/Home.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { featuredCaseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";
import Home from "@/pages/Home";
import { renderWithRouter } from "@/test/render";

describe("Home", () => {
	it("leads with the positioning line, not a job title", () => {
		renderWithRouter(<Home />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.positioning);
	});

	it("links every featured case study", () => {
		renderWithRouter(<Home />);
		for (const study of featuredCaseStudies) {
			expect(screen.getByRole("link", { name: new RegExp(study.title, "i") })).toHaveAttribute(
				"href",
				`/work/${study.slug}`,
			);
		}
	});

	it("does not render vanity counters", () => {
		renderWithRouter(<Home />);
		expect(screen.queryByText(/years experience/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/projects delivered/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/core technologies/i)).not.toBeInTheDocument();
	});

	it("offers exactly one primary contact path", () => {
		renderWithRouter(<Home />);
		expect(screen.getAllByRole("link", { name: /get in touch|contact/i })).toHaveLength(1);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/pages/Home.test.tsx`

Expected: FAIL — the h1 still contains the name plus a gradient tagline.

- [ ] **Step 3: Implement the page**

Replace `src/pages/Home.tsx`:

```tsx
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { featuredCaseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";

export default function Home() {
	return (
		<>
			<SEOHead description={profile.positioning} path="/" />
			<div className="mx-auto max-w-5xl px-5 sm:px-8">
				<section className="py-20 sm:py-28">
					{/* The name is in the nav and the footer. The h1 is the only line a
					    scanning reader is guaranteed to read, so it states the problem
					    shape rather than the job title. */}
					<h1 className="max-w-[20ch] text-[32px] font-semibold leading-[1.15] tracking-tight sm:text-[46px]">
						{profile.positioning}
					</h1>

					<div className="mt-8 max-w-[64ch] space-y-5 text-[17px] leading-[1.75] text-muted-foreground">
						{profile.pitch.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
						<Link
							to="/contact"
							className="rounded-md bg-foreground px-4 py-2.5 font-medium text-background transition-opacity hover:opacity-90"
						>
							Get in touch
						</Link>
						<a
							href={profile.resumePath}
							target="_blank"
							rel="noreferrer"
							className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
						>
							Résumé (PDF)
						</a>
						{profile.links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						))}
					</div>
				</section>

				<section className="border-t border-border/70 py-16">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Selected work
					</h2>

					<ol className="mt-10 space-y-14">
						{featuredCaseStudies.map((study) => (
							<li key={study.slug}>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
									<span>{study.organisation}</span>
									<span aria-hidden="true">·</span>
									<span>{study.period}</span>
									<EvidenceBadge level={study.evidence} />
								</div>
								<h3 className="mt-3 max-w-[26ch] text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
									<Link to={`/work/${study.slug}`} className="transition-colors hover:text-accent">
										{study.title}
									</Link>
								</h3>
								<p className="mt-3 max-w-[64ch] text-[17px] leading-[1.7] text-muted-foreground">
									{study.summary}
								</p>
							</li>
						))}
					</ol>

					<p className="mt-12">
						<Link
							to="/work"
							className="text-sm text-foreground underline underline-offset-4 transition-colors hover:text-accent"
						>
							All work
						</Link>
					</p>
				</section>

				<section className="border-t border-border/70 py-16">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						What I'm hired for
					</h2>
					<ul className="mt-8 max-w-[62ch] space-y-4">
						{profile.headline.map((point) => (
							<li key={point} className="text-[17px] leading-[1.7] text-muted-foreground">
								{point}
							</li>
						))}
					</ul>
					<p className="mt-10 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
						{profile.availability} {profile.responseTime}
					</p>
				</section>
			</div>
		</>
	);
}
```

- [ ] **Step 4: Run the page test to verify it passes**

Run: `bun run test src/pages/Home.test.tsx`

Expected: PASS — `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/pages/Home.test.tsx
git commit -m "$(cat <<'EOF'
feat: rewrite home around positioning and three case studies

Drops the metric tiles, skill cloud, services grid and terminal widget.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: About page

Absorbs Experience and Skills. Three pages become one because a reader looking for background wants it in one scroll, and because a dedicated Skills page cannot exist without reintroducing the self-grading it was built on.

**Files:**
- Modify: `src/pages/About.tsx` (full replacement)
- Create: `src/pages/About.test.tsx`

**Interfaces:**
- Consumes: `profile`, `roles`, `stackGroups`, `Prose`, `SEOHead`.
- Produces: default-exported `About` with anchors `#track-record` and `#stack` — the `/experience` and `/skills` redirects from Task 6 target them.

- [ ] **Step 1: Write the failing page test**

Create `src/pages/About.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { roles } from "@/data/roles";
import About from "@/pages/About";
import { renderWithRouter } from "@/test/render";

describe("About", () => {
	it("carries the anchors the old /experience and /skills URLs redirect to", () => {
		const { container } = renderWithRouter(<About />);
		expect(container.querySelector("#track-record")).not.toBeNull();
		expect(container.querySelector("#stack")).not.toBeNull();
	});

	it("lists every role with its scope", () => {
		renderWithRouter(<About />);
		for (const role of roles) {
			expect(screen.getByText(role.company)).toBeInTheDocument();
			expect(screen.getByText(role.scope)).toBeInTheDocument();
		}
	});

	it("shows no proficiency levels in the stack section", () => {
		const { container } = renderWithRouter(<About />);
		expect(container.textContent).not.toMatch(/\bExpert\b|\bAdvanced\b|\bIntermediate\b/);
	});

	it("shows no certifications section", () => {
		renderWithRouter(<About />);
		expect(screen.queryByText(/certification|credential/i)).not.toBeInTheDocument();
	});

	it("mentions teaching once, as a link rather than a section", () => {
		renderWithRouter(<About />);
		expect(screen.getAllByRole("link", { name: /youtube|tutorial/i })).toHaveLength(1);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/pages/About.test.tsx`

Expected: FAIL — no `#track-record` anchor exists.

- [ ] **Step 3: Implement the page**

Replace `src/pages/About.tsx`:

```tsx
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { stackGroups } from "@/data/stack";

export default function About() {
	return (
		<>
			<SEOHead
				title="About"
				description={`${profile.name} — ${profile.positioning}`}
				path="/about"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<header className="max-w-[58ch]">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About</h1>
					<div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-muted-foreground">
						{profile.pitch.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
					<p className="mt-6 text-sm text-muted-foreground">
						{profile.location} · {profile.timezone}
					</p>
				</header>

				<section id="track-record" className="mt-20 scroll-mt-24 border-t border-border/70 pt-8">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Track record
					</h2>

					<ol className="mt-10 space-y-12">
						{roles.map((role) => (
							<li key={role.id}>
								<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<h3 className="text-lg font-semibold tracking-tight">{role.title}</h3>
									<span className="text-muted-foreground">{role.company}</span>
									<span className="text-sm text-muted-foreground">{role.period}</span>
								</div>

								<p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground">
									{role.scope}
								</p>

								<ul className="mt-4 max-w-[64ch] space-y-2.5">
									{role.impact.map((item) => (
										<li
											key={item}
											className="border-l-2 border-border pl-4 text-[16px] leading-[1.7] text-muted-foreground"
										>
											{item}
										</li>
									))}
								</ul>

								<p className="mt-4 text-sm text-muted-foreground">{role.stack.join(" · ")}</p>
							</li>
						))}
					</ol>
				</section>

				<section id="stack" className="mt-20 scroll-mt-24 border-t border-border/70 pt-8">
					<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stack</h2>
					<Prose className="mt-5">
						<p>
							Grouped by what I use each thing for. There are no proficiency ratings here —
							what a tool is used for is something you can check in conversation, and a
							self-assigned grade is not.
						</p>
					</Prose>

					<div className="mt-10 space-y-10">
						{stackGroups.map((group) => (
							<div key={group.name}>
								<h3 className="text-lg font-semibold tracking-tight">{group.name}</h3>
								<p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
									{group.purpose}
								</p>
								<dl className="mt-5 space-y-3">
									{group.items.map((item) => (
										<div key={item.name} className="sm:flex sm:gap-6">
											<dt className="text-[15px] text-foreground sm:w-56 sm:shrink-0">
												{item.name}
											</dt>
											<dd className="text-[15px] leading-relaxed text-muted-foreground">
												{item.usedFor} <span className="text-muted-foreground/70">· since {item.since}</span>
											</dd>
										</div>
									))}
								</dl>
							</div>
						))}
					</div>
				</section>

				{profile.teaching && (
					<section className="mt-20 border-t border-border/70 pt-8">
						<h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Also
						</h2>
						<Prose className="mt-5">
							<p>
								I recorded a{" "}
								<a
									href={profile.teaching.href}
									target="_blank"
									rel="noreferrer"
									className="text-foreground underline underline-offset-4 hover:text-accent"
								>
									{profile.teaching.label}
								</a>{" "}
								for engineers starting out. It is not what I want to be hired for, but
								explaining things is part of how I work on a team.
							</p>
						</Prose>
					</section>
				)}
			</div>
		</>
	);
}
```

That last paragraph is the whole reframe: teaching goes from a nav item that
defines you to a footnote that says something true about how you work.

- [ ] **Step 4: Run the page test to verify it passes**

Run: `bun run test src/pages/About.test.tsx`

Expected: PASS — `5 passed`.

- [ ] **Step 5: Verify the redirects land on the anchors**

Run: `bun run dev`, then visit `http://localhost:3000/experience` and `http://localhost:3000/skills`.

Expected: both land on `/about` scrolled to the right section.

- [ ] **Step 6: Commit**

```bash
git add src/pages/About.tsx src/pages/About.test.tsx
git commit -m "$(cat <<'EOF'
feat: merge experience and skills into about

Roles carry scope and impact; stack is grouped by purpose with no
proficiency ratings and no certifications section.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Writing surface

One engineering note outweighs another project card. This task builds the surface and leaves it hidden until a real note exists — the route and the nav item are both conditional, so an empty writing section is structurally unable to ship.

**Files:**
- Modify: `src/content/notes/index.ts`
- Create: `src/content/notes/notes.test.ts`
- Modify: `src/pages/Writing.tsx`, `src/pages/Note.tsx` (replace stubs)
- Create: `src/pages/Writing.test.tsx`

**Interfaces:**
- Consumes: `parseNote`, `Note` from `@/content/schema`.
- Produces:
  - `notes: NoteEntry[]` where `NoteEntry = Note & { body: () => JSX.Element }`
  - `getNote(slug): NoteEntry | undefined`
  - Pages `Writing` and `Note`

- [ ] **Step 1: Write the failing notes test**

Create `src/content/notes/notes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getNote, notes } from "@/content/notes";

describe("notes registry", () => {
	it("is sorted newest first", () => {
		const dates = notes.map((note) => note.published);
		expect([...dates].sort().reverse()).toEqual(dates);
	});

	it("has unique slugs", () => {
		const slugs = notes.map((note) => note.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("returns undefined for an unknown slug", () => {
		expect(getNote("not-a-note")).toBeUndefined();
	});

	it("gives every note a body", () => {
		for (const note of notes) {
			expect(typeof note.body).toBe("function");
		}
	});
});
```

These all pass on an empty array, which is correct — the registry has to be
valid whether or not anything is published yet.

- [ ] **Step 2: Run it**

Run: `bun run test src/content/notes`

Expected: PASS — `4 passed` (vacuously, on an empty registry).

- [ ] **Step 3: Implement the registry**

Replace `src/content/notes/index.ts`:

```tsx
import type { ReactElement } from "react";
import { type Note, parseNote } from "@/content/schema";

export interface NoteEntry extends Note {
	body: () => ReactElement;
}

function defineNote(meta: unknown, body: () => ReactElement): NoteEntry {
	return { ...parseNote(meta), body };
}

/**
 * Empty until a real note exists. Both the /writing route and its nav item are
 * conditional on `notes.length`, so an empty writing section cannot ship.
 *
 * To publish: create src/content/notes/<slug>.tsx exporting a metadata object
 * and a body component, then register it here with defineNote().
 */
export const notes: NoteEntry[] = [];

notes.sort((a, b) => b.published.localeCompare(a.published));

export function getNote(slug: string): NoteEntry | undefined {
	return notes.find((note) => note.slug === slug);
}

export { defineNote };
```

- [ ] **Step 4: Add the note authoring template**

Create `src/content/notes/TEMPLATE.md` (documentation, not compiled):

````markdown
# Writing a note

Create `src/content/notes/<slug>.tsx`:

```tsx
import { defineNote } from "@/content/notes";

export const meta = {
	slug: "why-we-moved-uploads-off-the-api",
	title: "Why we moved uploads off the API",
	summary: "Proxying large uploads through application servers ties transfer lifetime to deploy lifetime. Here is what that costs and what we did instead.",
	published: "2026-03-14",
	readingMinutes: 7,
	tags: ["AWS", "Architecture"],
};

export function Body() {
	return (
		<>
			<p>...</p>
		</>
	);
}
```

Then register it in `src/content/notes/index.ts`:

```tsx
import { Body as UploadsBody, meta as uploadsMeta } from "./why-we-moved-uploads-off-the-api";

export const notes: NoteEntry[] = [defineNote(uploadsMeta, UploadsBody)];
```

**What to write about.** The best note is the decision you almost got wrong.
Second best is a thing that surprised you in production. Avoid tutorials —
"How to set up X" is the genre this site was rebuilt to get away from.
````

- [ ] **Step 5: Write the failing Writing page test**

Create `src/pages/Writing.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { notes } from "@/content/notes";
import Writing from "@/pages/Writing";
import { renderWithRouter } from "@/test/render";

describe("Writing", () => {
	it("renders a heading", () => {
		renderWithRouter(<Writing />);
		expect(screen.getByRole("heading", { level: 1, name: /writing/i })).toBeInTheDocument();
	});

	it("links every published note", () => {
		renderWithRouter(<Writing />);
		for (const note of notes) {
			expect(screen.getByRole("link", { name: new RegExp(note.title, "i") })).toHaveAttribute(
				"href",
				`/writing/${note.slug}`,
			);
		}
	});
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `bun run test src/pages/Writing.test.tsx`

Expected: FAIL — the stub renders `null`.

- [ ] **Step 7: Implement both pages**

Replace `src/pages/Writing.tsx`:

```tsx
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEO";
import { notes } from "@/content/notes";

export default function Writing() {
	return (
		<>
			<SEOHead
				title="Writing"
				description="Engineering notes on decisions, tradeoffs and things that surprised me in production."
				path="/writing"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Writing</h1>
				<p className="mt-5 max-w-[62ch] text-[17px] leading-[1.75] text-muted-foreground">
					Notes on decisions I nearly got wrong and things production taught me. Not tutorials.
				</p>

				<ol className="mt-14 space-y-10">
					{notes.map((note) => (
						<li key={note.slug} className="border-t border-border/70 pt-6">
							<p className="text-sm text-muted-foreground">
								<time dateTime={note.published}>{note.published}</time> · {note.readingMinutes} min
							</p>
							<h2 className="mt-2 max-w-[26ch] text-xl font-semibold leading-snug tracking-tight">
								<Link to={`/writing/${note.slug}`} className="transition-colors hover:text-accent">
									{note.title}
								</Link>
							</h2>
							<p className="mt-3 max-w-[64ch] text-[17px] leading-[1.7] text-muted-foreground">
								{note.summary}
							</p>
						</li>
					))}
				</ol>
			</div>
		</>
	);
}
```

Replace `src/pages/Note.tsx`:

```tsx
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Prose } from "@/components/Prose";
import { SEOHead } from "@/components/SEO";
import { getNote } from "@/content/notes";
import NotFound from "@/pages/NotFound";

export default function Note() {
	const { slug } = useParams();
	const note = slug ? getNote(slug) : undefined;

	if (!note) {
		return <NotFound />;
	}

	const Body = note.body;

	return (
		<>
			<SEOHead
				title={note.title}
				description={note.summary}
				path={`/writing/${note.slug}`}
				type="article"
				publishedTime={note.published}
			/>
			<article className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<Link
					to="/writing"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					All writing
				</Link>

				<header className="mt-8">
					<p className="text-sm text-muted-foreground">
						<time dateTime={note.published}>{note.published}</time> · {note.readingMinutes} min ·{" "}
						{note.tags.join(", ")}
					</p>
					<h1 className="mt-4 max-w-[24ch] text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[38px]">
						{note.title}
					</h1>
				</header>

				<Prose className="mt-10 space-y-5">
					<Body />
				</Prose>
			</article>
		</>
	);
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `bun run test src/pages/Writing.test.tsx src/content/notes`

Expected: PASS — `6 passed`.

- [ ] **Step 9: Commit**

```bash
git add src/content/notes src/pages/Writing.tsx src/pages/Note.tsx src/pages/Writing.test.tsx
git commit -m "$(cat <<'EOF'
feat: add writing surface, hidden until a note exists

Route and nav item are both conditional on the notes registry, so an
empty writing section cannot ship.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Contact page and SEO

The contact form posts to `mailto:` — it opens a mail client and pretends to be a form. Replace it with the honest version. SEO changes in the same task because both are about not overstating: the `keywords` meta tag has been ignored by search engines for over a decade and its presence is itself a dated signal.

**Files:**
- Modify: `src/pages/Contact.tsx` (full replacement)
- Modify: `src/components/SEO.tsx`
- Create: `src/components/StructuredData.tsx`
- Create: `src/pages/Contact.test.tsx`
- Modify: `index.html`, `public/sitemap.xml`

**Interfaces:**
- Consumes: `profile`.
- Produces: `SEOHead` gains `path?: string`, `noIndex?: boolean`; drops `keywords`. `<StructuredData />` emits JSON-LD `Person`.

- [ ] **Step 1: Write the failing contact test**

Create `src/pages/Contact.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import Contact from "@/pages/Contact";
import { renderWithRouter } from "@/test/render";

describe("Contact", () => {
	it("offers a direct mailto link rather than a form that fakes a submit", () => {
		renderWithRouter(<Contact />);
		expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
			"href",
			`mailto:${profile.email}`,
		);
	});

	it("renders no form controls", () => {
		const { container } = renderWithRouter(<Contact />);
		expect(container.querySelector("form")).toBeNull();
		expect(container.querySelector("input")).toBeNull();
	});

	it("states availability and response time", () => {
		renderWithRouter(<Contact />);
		expect(screen.getByText(profile.availability)).toBeInTheDocument();
		expect(screen.getByText(profile.responseTime)).toBeInTheDocument();
	});

	it("does not show a phone number", () => {
		const { container } = renderWithRouter(<Contact />);
		expect(container.textContent).not.toMatch(/\+880/);
	});
});
```

Dropping the phone number is deliberate: a public phone number on a portfolio
attracts recruiter cold-calls, not the senior conversations this site is for.

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/pages/Contact.test.tsx`

Expected: FAIL — the current page renders a form and a phone number.

- [ ] **Step 3: Implement the page**

Replace `src/pages/Contact.tsx`:

```tsx
import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";

export default function Contact() {
	return (
		<>
			<SEOHead
				title="Contact"
				description={`Get in touch with ${profile.name}. ${profile.availability}`}
				path="/contact"
			/>
			<div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>

				<div className="mt-6 max-w-[62ch] space-y-4 text-[17px] leading-[1.75] text-muted-foreground">
					<p>{profile.availability}</p>
					<p>{profile.responseTime}</p>
					<p>
						Email is best. If you are writing about a role, the two things that make a reply
						useful are the team's actual problem and the constraints around it.
					</p>
				</div>

				<dl className="mt-12 space-y-6 border-t border-border/70 pt-8">
					<div className="sm:flex sm:gap-8">
						<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">Email</dt>
						<dd>
							<a
								href={`mailto:${profile.email}`}
								className="text-[17px] text-foreground underline underline-offset-4 hover:text-accent"
							>
								{profile.email}
							</a>
						</dd>
					</div>
					{profile.links.map((link) => (
						<div key={link.href} className="sm:flex sm:gap-8">
							<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">{link.label}</dt>
							<dd>
								<a
									href={link.href}
									target="_blank"
									rel="noreferrer"
									className="text-[17px] text-foreground underline underline-offset-4 hover:text-accent"
								>
									{link.href.replace(/^https:\/\//, "")}
								</a>
							</dd>
						</div>
					))}
					<div className="sm:flex sm:gap-8">
						<dt className="text-sm text-muted-foreground sm:w-32 sm:shrink-0">Location</dt>
						<dd className="text-[17px] text-foreground">
							{profile.location} · {profile.timezone}
						</dd>
					</div>
				</dl>
			</div>
		</>
	);
}
```

- [ ] **Step 4: Update SEOHead**

Replace the `defaultSEO` object and `SEOHead` signature in `src/components/SEO.tsx`. Keep the `HelmetProvider` export (`SEOProvider`) as-is.

```tsx
import { Helmet } from "react-helmet-next";
import { profile } from "@/data/profile";

const SITE_URL = "https://anwarportfolio.vercel.app";

const defaults = {
	title: `${profile.name} — Senior Software Engineer`,
	description: profile.positioning,
	image: `${SITE_URL}/og.png`,
};

interface SEOProps {
	title?: string;
	description?: string;
	/** Site-relative path, e.g. "/work/vod-ingest". Builds canonical + og:url. */
	path?: string;
	image?: string;
	type?: "website" | "article";
	publishedTime?: string;
	noIndex?: boolean;
}

export function SEOHead({
	title,
	description = defaults.description,
	path = "/",
	image = defaults.image,
	type = "website",
	publishedTime,
	noIndex = false,
}: SEOProps) {
	const fullTitle = title ? `${title} — ${profile.name}` : defaults.title;
	const url = `${SITE_URL}${path}`;

	return (
		<Helmet>
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<meta name="author" content={profile.name} />
			<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
			<link rel="canonical" href={url} />

			<meta property="og:type" content={type} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={profile.name} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			{type === "article" && publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
		</Helmet>
	);
}
```

The `keywords` prop and meta tag are gone everywhere. Delete the `keywords={...}`
props still being passed from any page.

- [ ] **Step 5: Add structured data**

Create `src/components/StructuredData.tsx`:

```tsx
import { Helmet } from "react-helmet-next";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";

export function StructuredData() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: profile.name,
		jobTitle: "Senior Software Engineer",
		email: `mailto:${profile.email}`,
		url: "https://anwarportfolio.vercel.app",
		address: { "@type": "PostalAddress", addressLocality: profile.location },
		sameAs: profile.links.map((link) => link.href),
		worksFor: { "@type": "Organization", name: roles[0].company },
		description: profile.positioning,
	};

	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(data)}</script>
		</Helmet>
	);
}
```

Mount it once, inside `SEOProvider` in `src/components/SEO.tsx`, so it applies site-wide.

- [ ] **Step 6: Update index.html and the sitemap**

In `index.html`: delete the `<meta name="keywords">` tag, and replace the
description and og/twitter description strings with the positioning line so the
pre-hydration meta matches what `SEOHead` renders. Update `og:image` and
`twitter:image` to `https://anwarportfolio.vercel.app/og.png`.

Replace `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://anwarportfolio.vercel.app/</loc><priority>1.0</priority></url>
	<url><loc>https://anwarportfolio.vercel.app/work</loc><priority>0.9</priority></url>
	<url><loc>https://anwarportfolio.vercel.app/about</loc><priority>0.7</priority></url>
	<url><loc>https://anwarportfolio.vercel.app/contact</loc><priority>0.5</priority></url>
</urlset>
```

Add one `<url>` entry per case study slug at priority `0.8`.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `bun run test`

Expected: PASS across the suite.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Contact.tsx src/pages/Contact.test.tsx src/components/SEO.tsx \
        src/components/StructuredData.tsx index.html public/sitemap.xml
git commit -m "$(cat <<'EOF'
feat: honest contact page, per-route canonicals, JSON-LD

Replaces the mailto-backed form with a direct email path. Drops the
keywords meta tag and adds Person structured data.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Design restraint pass

Content is now senior; the styling still shouts. `font-black` on forty headings, gradient text, glow shadows, a grid pattern behind every page and a class literally named `premium-card`. The fix is subtraction plus one deliberate typographic choice.

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`
- Create: `src/index.css.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `.surface`, `.rule`, `.eyebrow` utility classes. Removes `.premium-card`, `.gradient-text`, `.mesh-gradient`, `.hero-glow`, `.interactive-card`, `.slide-in-up`, `.fade-in-stagger`, `.hover-scale`, `.metric-tile`, `.section-shell`.

- [ ] **Step 1: Write the failing style-contract test**

Create `src/index.css.test.ts`:

```ts
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(process.cwd(), "src");
const css = readFileSync(path.join(SRC, "index.css"), "utf8");

describe("stylesheet", () => {
	it("no longer defines the decorative classes", () => {
		for (const removed of [".premium-card", ".gradient-text", ".mesh-gradient", ".hero-glow"]) {
			expect(css).not.toContain(removed);
		}
	});

	it("does not paint a grid behind the whole page", () => {
		expect(css).not.toContain("--bg-grid");
	});

	it("honours prefers-reduced-motion", () => {
		expect(css).toContain("prefers-reduced-motion");
	});

	it("keeps both palettes defined", () => {
		expect(css).toContain(".light");
		expect(css).toMatch(/:root,\s*\.dark/);
	});
});
```

Also add a repo-wide check in the same file. It walks the filesystem rather than
shelling out to `git grep`, so it behaves the same on Windows and CI:

```ts
const REMOVED_CLASSES = [
	"premium-card",
	"gradient-text",
	"mesh-gradient",
	"section-shell",
	"metric-tile",
	"interactive-card",
	"slide-in-up",
	"font-black",
];

function sourceFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return sourceFiles(full);
		return /\.tsx?$/.test(entry.name) ? [full] : [];
	});
}

describe("component classes", () => {
	it("has no remaining references to the removed classes", () => {
		const offenders = sourceFiles(SRC)
			.filter((file) => !file.endsWith("index.css.test.ts"))
			.filter((file) => {
				const source = readFileSync(file, "utf8");
				return REMOVED_CLASSES.some((name) => source.includes(name));
			})
			.map((file) => path.relative(SRC, file));

		expect(offenders).toEqual([]);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/index.css.test.ts`

Expected: FAIL — all four decorative classes are still defined.

- [ ] **Step 3: Rewrite the token block**

In `src/index.css`, replace the `:root, .dark` block's decorative entries. Keep
every semantic token name — components depend on them — and change values:

```css
	:root,
	.dark {
		--background: 222 24% 6%;
		--foreground: 210 20% 96%;
		--card: 222 20% 9%;
		--card-foreground: 210 20% 96%;
		--card-border: 218 14% 18%;
		--popover: 222 20% 9%;
		--popover-foreground: 210 20% 96%;
		/* One accent, used sparingly: links on hover, the tradeoff rule. */
		--primary: 200 70% 62%;
		--primary-foreground: 222 24% 6%;
		--secondary: 220 16% 13%;
		--secondary-foreground: 210 20% 94%;
		--accent: 200 70% 62%;
		--accent-foreground: 222 24% 6%;
		--muted: 220 16% 13%;
		--muted-foreground: 214 12% 68%;
		--destructive: 0 62% 56%;
		--destructive-foreground: 210 20% 96%;
		--border: 218 14% 18%;
		--input: 218 14% 18%;
		--ring: 200 70% 62%;
		--radius: 0.375rem;
	}
```

Delete every `--gradient-*`, `--shadow-glow`, `--shadow-premium`,
`--shadow-elevated`, `--primary-glow`, `--accent-glow`, `--success*`,
`--bg-grid*`, `--curve-*` and `--sidebar-*` custom property. Saturation drops
from 100% to 70% and the radius from 0.5rem to 0.375rem; both read as calmer
without looking unfinished.

Mirror the same reductions in the `.light` block.

- [ ] **Step 4: Strip the body decoration**

Replace the `body` rule:

```css
	body {
		@apply bg-background text-foreground font-sans antialiased;
		min-width: 320px;
		font-feature-settings: "cv11", "ss01";
		text-rendering: optimizeLegibility;
	}
```

The `background-image` grid, `background-attachment: fixed`, `max-width: 100vw`
and `overflow-x: hidden` all go. `overflow-x: hidden` on `html`/`body` is a
workaround for layouts that overflow; the layouts here do not.

- [ ] **Step 5: Replace the component layer**

Replace the whole `@layer components { ... }` block:

```css
@layer components {
	.surface {
		@apply rounded-md border border-border bg-card;
	}

	.rule {
		@apply border-t border-border/70;
	}

	.eyebrow {
		@apply text-xs uppercase tracking-[0.18em] text-muted-foreground;
	}
}

@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

Delete the trailing `.typing-cursor`, `.animate-blink`, `.mesh-gradient` and
`.scrollbar-thin` rules — every consumer was deleted in Task 6.

- [ ] **Step 6: Set the type scale**

In `tailwind.config.ts`, replace the `fontFamily` block:

```ts
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
				display: ["Newsreader", "Georgia", "serif"],
				mono: ["JetBrains Mono", "ui-monospace", "monospace"],
			},
```

Update the font import at the top of `src/index.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap");
```

Inter drops from six weights to three — the site no longer uses 700, 800 or 900,
and that alone removes most of the shouting. Newsreader is loaded for case-study
titles: use `font-display` on the `h1` in `CaseStudy.tsx` and on the `h1` in
`Note.tsx`. One serif on long-form headings is the cheapest available signal that
somebody made a typographic decision.

Also remove the now-dangling `backgroundImage` gradient entries and the
`boxShadow` glow entries from `tailwind.config.ts`.

- [ ] **Step 7: Sweep the removed classes out of the components**

```bash
git grep -n "premium-card\|gradient-text\|mesh-gradient\|section-shell\|metric-tile\|interactive-card\|slide-in-up\|font-black" -- src
```

Replace as you go: `premium-card` → `surface`, `section-shell` → `mx-auto max-w-5xl px-5 sm:px-8`, `font-black` → `font-semibold`, and delete `gradient-text`, `interactive-card`, `slide-in-up` and `shadow-glow` outright. Pages written in Tasks 8–13 already avoid all of them; this catches `ThemeToggle`, `NotFound` and anything in `components/ui/`.

- [ ] **Step 8: Run the tests to verify they pass**

Run: `bun run test`

Expected: PASS — including both new style-contract tests.

- [ ] **Step 9: Compare both themes in the browser**

Run: `bun run dev`, then toggle light and dark on `/`, `/work`, `/work/<slug>`, `/about`, `/contact`.

Check: no element loses contrast in light mode, the accent appears at most twice per screen, and no heading is heavier than `font-semibold`.

- [ ] **Step 10: Commit**

```bash
git add src/index.css src/index.css.test.ts tailwind.config.ts src/
git commit -m "$(cat <<'EOF'
style: restraint pass on tokens, type scale and component classes

Removes gradient text, glow shadows, the page-wide grid and the
premium-card layer. Inter drops to three weights; Newsreader carries
long-form headings. Adds prefers-reduced-motion.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Accessibility and performance pass

The repo is a work sample. A senior portfolio that fails colour contrast or ships a 400KB bundle for six pages of text undercuts its own content.

**Files:**
- Create: `src/test/a11y.test.tsx`
- Modify: `package.json` (adds `vitest-axe`)
- Modify: whichever components the audit implicates

**Interfaces:**
- Consumes: every page component.
- Produces: an axe assertion per route; a documented bundle budget.

- [ ] **Step 1: Install the accessibility matcher**

```bash
bun add -d vitest-axe axe-core
```

- [ ] **Step 2: Write the failing accessibility test**

Create `src/test/a11y.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { Route, Routes } from "react-router-dom";
import { caseStudies } from "@/content/case-studies";
import About from "@/pages/About";
import CaseStudy from "@/pages/CaseStudy";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import { renderWithRouter } from "@/test/render";

expect.extend(matchers);

describe("accessibility", () => {
	it.each([
		["Home", <Home key="h" />],
		["Work", <Work key="w" />],
		["About", <About key="a" />],
		["Contact", <Contact key="c" />],
	])("%s has no axe violations", async (_name, element) => {
		const { container } = renderWithRouter(element);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("CaseStudy has no axe violations", async () => {
		const { container } = renderWithRouter(
			<Routes>
				<Route path="/work/:slug" element={<CaseStudy />} />
			</Routes>,
			{ route: `/work/${caseStudies[0].slug}` },
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
```

- [ ] **Step 3: Run it and fix what it finds**

Run: `bun run test src/test/a11y.test.tsx`

Expected on first run: failures. The likely ones and their fixes:

- *Heading order* — a page jumping `h1` → `h3`. Fix the level, not the size; size is a class.
- *Colour contrast* — `text-muted-foreground/70` and `/80` against `--card`. Raise the muted foreground lightness in `index.css` until axe passes rather than removing the token.
- *Link name* — icon-only links. Add `aria-label`.
- *Region* — content outside a landmark. Task 6 put `<main id="main">` in `Layout`; page tests render the page without it, so scope the assertion to the container or wrap the test render in a `<main>`.

Iterate until green.

- [ ] **Step 4: Measure the bundle**

Run: `bun run build`

Record the reported gzip sizes. Budget for this site: **under 120KB gzipped for the initial route**. If it is over, the usual causes here are:

- Unused shadcn components in `src/components/ui/` — 47 files are present and roughly six are used after this rebuild. Delete the unused ones:
  ```bash
  for f in src/components/ui/*.tsx; do
  	name=$(basename "$f" .tsx)
  	git grep -q "components/ui/$name" -- src ':!src/components/ui' || echo "unused: $f"
  done
  ```
  Delete what that prints, then rebuild.
- `recharts` (~90KB) and `embla-carousel-react` — pulled in only by unused `ui/chart.tsx` and `ui/carousel.tsx`. Remove both dependencies once those files are gone.
- `lodash` — imported solely for `debounce` in the old `Navigation`, which Task 6 deleted. Remove the dependency and `@types/lodash`.

```bash
bun remove recharts embla-carousel-react lodash @types/lodash
```

Check nothing else imports them before removing:

```bash
git grep -n "recharts\|embla\|from \"lodash\"" -- src || echo "safe to remove"
```

- [ ] **Step 5: Re-run the full suite and build**

Run: `bun run verify`

Expected: tests pass, lint clean, build succeeds, bundle under budget.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: resolve axe violations and trim the bundle

Adds per-route accessibility assertions. Drops unused shadcn components
and the recharts, embla and lodash dependencies they pulled in.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: README, CI and final review

The repo is the last surface a hiring manager looks at, and often the one they look at hardest.

**Files:**
- Modify: `README.md`
- Create: `.github/workflows/ci.yml`
- Create: `docs/REVIEW-CHECKLIST.md`

**Interfaces:**
- Consumes: `bun run verify` from Task 1.
- Produces: CI on push and PR.

- [ ] **Step 1: Rewrite the README**

Replace `README.md`:

```markdown
# anwarportfolio.vercel.app

Portfolio site. React 19, Vite, Tailwind, deployed on Vercel.

## Why it is built this way

**Content is validated, not just typed.** Case studies go through a zod schema
(`src/content/schema.ts`) that enforces the rules the site is trying to keep:
a case study claiming `evidence: "measured"` must carry results, and every
result must state the instrument, window and baseline used to produce it. A
case study declaring `qualitative` may not carry numbers at all. Placeholder
tokens — `TODO`, `TBD`, `example.com`, `<<REPLACE>>` — fail the test suite.
The intent is that shipping an unsourced number is impossible rather than
merely discouraged.

**Three case studies, not a project grid.** Depth is the thing being
demonstrated. Each has a scope boundary saying what I did and did not own, at
least one decision with the alternative it beat and the cost it carried, and a
reflection.

**No client-side secrets.** An earlier version of this site shipped a Gemini
API key in the bundle to power a chatbot. Both are gone.

**No self-assigned proficiency levels.** What a technology is used for is
checkable in conversation; a grade I award myself is not.

## Running it

```bash
bun install
bun run dev       # http://localhost:3000
bun run verify    # tests, lint, build
```

## Layout

| Path | Contents |
|---|---|
| `src/content/schema.ts` | Content model and validation rules |
| `src/content/case-studies/` | One file per case study, validated at import |
| `src/content/notes/` | Engineering notes; the route is hidden when empty |
| `src/data/` | Profile, roles, stack |
| `src/pages/` | One file per route |
| `docs/CONTENT-WORKSHEET.md` | What has to be answered before content is written |
```

- [ ] **Step 2: Add CI**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, new-design-with-react]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun run test
      - run: bunx biome ci .
      - run: bun run build
```

`biome ci` is used rather than `bun run lint`, because `lint` writes fixes and
CI should fail on unformatted code rather than silently correcting it.

- [ ] **Step 3: Add the review checklist**

Create `docs/REVIEW-CHECKLIST.md`:

```markdown
# Pre-publish checklist

Run before every deploy that changes content.

## Truth
- [ ] Every number on the site has a method next to it.
- [ ] Every case study's `scope` says what I did *not* own.
- [ ] No badge, label or icon asserts verification the site cannot back.
- [ ] Nothing described as shipped was actually a design exercise.
- [ ] Every external link resolves to the thing it claims to be. No link to a
      GitHub profile standing in for a project.

## Résumé alignment
- [ ] Job titles, companies and dates on the site match `public/resume.pdf`.
- [ ] Any figure that appears in both places is identical in both places.
- [ ] The résumé's headline says the same thing as `profile.positioning`.

## Interview readiness
- [ ] I can talk through each case study for 45 minutes.
- [ ] For each decision, I can name a second rejected alternative not on the page.
- [ ] For each metric, I can say what the instrument was and where the baseline
      came from.
- [ ] For each reflection, the regret is specific enough to be uncomfortable.

## Mechanics
- [ ] `bun run verify` passes.
- [ ] Light and dark both legible on every route.
- [ ] `/projects`, `/skills`, `/experience` still redirect.
- [ ] `/youtube` and `/ask-ai` 404.
- [ ] Initial route under 120KB gzipped.
```

- [ ] **Step 4: Verify the résumé matches**

Open `public/resume.pdf` and check it against `docs/REVIEW-CHECKLIST.md`'s
"Résumé alignment" section. A site that says one thing and a PDF that says
another is the kind of discrepancy an interviewer notices and asks about. If
the PDF is stale, replacing it is out of scope for this plan — record it as
follow-up work rather than editing content to match a stale document.

- [ ] **Step 5: Final verification**

Run:

```bash
bun run verify
git grep -rn "gemini\|GEMINI\|youtube\|Ask AI\|premium-card\|isVerified\|CV-aligned" -- src || echo "clean"
```

Expected: `verify` passes; the grep prints `clean` or only the single intentional
`profile.teaching` YouTube link in `src/data/profile.ts`.

- [ ] **Step 6: Commit**

```bash
git add README.md .github/workflows/ci.yml docs/REVIEW-CHECKLIST.md
git commit -m "$(cat <<'EOF'
docs: rewrite README around decisions, add CI and review checklist

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Appendix A: What was cut and why

Kept here so the decision is recoverable if any of it is ever missed.

| Removed | Reason | Where it went |
|---|---|---|
| Ask AI chatbot (609 lines) | API key in the bundle; asked visitors for their own key; added nothing the page didn't already say | Deleted |
| YouTube page + data | Tutorial series in primary nav reframes everything else as learner output | One line in About |
| Skills page | Self-graded proficiency across 44 items | Stack section in About, grouped by purpose |
| `certifications` array | Self-issued credentials marked `verified: true` | Deleted outright |
| 7 project cards | Shallow, mixed designs with shipped work, all linking one profile URL | 3 case studies |
| `experienceStats` counters | Uncheckable, repeated on three pages | Deleted |
| Blogs page | Three posts pointing at `example.com` | Writing surface, hidden until real |
| ParticleBackground, InteractiveBackground | Two canvas animations behind every page | Deleted |
| Terminal widget | Decoration below the home fold | Deleted |
| FloatingIcons, TypingEffect, StatsCounter, LoadingScreen | Already unused; dead code in a work sample | Deleted |
| Contact form | Posted to `mailto:` — a form that isn't one | Direct email, availability, response time |
| Phone number | Attracts cold-calls, not senior conversations | Deleted |
| `keywords` meta | Ignored by search engines for a decade; its presence is a dated signal | Deleted |
| recharts, embla, lodash | Pulled in by unused UI components | Removed from dependencies |

## Appendix B: Sequencing notes

- **Task 3 blocks Task 4.** Task 4 cannot be executed by an agent without the filled worksheet. If you reach it and the worksheet is empty, stop and say so rather than inventing content — the schema will reject it anyway, and inventing content is the exact failure this plan exists to fix.
- **Task 6 is the highest-value single commit.** If time runs out after only one task, make it that one. Deleting the chatbot, the tutorials page and the fabricated certifications removes more junior signal than anything added later adds senior signal.
- **Tasks 8–13 are independent** once Tasks 5 and 6 land. They can be parallelised across agents; each touches its own page file plus its own test.
- **Task 14 must come after 8–13**, because the class sweep in Step 7 needs the new pages to already exist.
- **Task 15 must come last** before Task 16 — accessibility findings depend on the final markup.
