# One-Page Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a single-page, anchor-navigated editorial site in the visual language of taher.xyz — warm paper ground, serif display type, monospace eyebrows, hairline rules — while keeping both light and dark themes.

**Architecture:** The site currently has six routes and a passing 73-test suite. This plan collapses the primary experience onto `/`, composed of numbered sections joined by anchor navigation. Existing page components are decomposed into section components rather than rewritten from scratch, so the content model, the zod validation and the test harness all survive intact. The design system is replaced wholesale: the cool-blue HSL token set becomes a warm OKLCH set derived from taher.xyz, expressed in both themes.

**Tech Stack:** Unchanged — React 19, TypeScript, Vite 7, React Router 7, Tailwind 3.4, zod 4, Vitest, Biome, Bun. Two font families added: Newsreader (already loaded) and Hind Siliguri.

---

## Context: where this starts

Tasks 1–14 of `2026-09-07-senior-portfolio-rebuild.md` are complete and on `new-design-with-react`. State at HEAD `00d527d`:

- **Suite:** 15 files, 73 tests, 0 failures.
- **Routes:** `/`, `/work`, `/work/:slug`, `/about`, `/contact`, conditional `/writing` + `/writing/:slug`, redirects from `/projects`, `/skills`, `/experience`.
- **Content:** three schema-validated case studies (`vod-delivery`, `analytics-platform`, `release-path`), all `evidence: "qualitative"`; `profile.ts`, `roles.ts`, `stack.ts`.
- **Components:** `Navigation`, `Footer`, `Layout`, `Prose`, `SEO`, `StructuredData`, `ThemeToggle`, `case-study/{DecisionBlock,ResultsTable,EvidenceBadge}`, plus ~47 largely unused `components/ui/*`.
- **Bundle:** 475 kB raw / 149.66 kB gzip. Over budget; Task 12 here addresses it.
- **Known open items** carried over: `public/og.png` is referenced but does not exist; `components/ui/chart.tsx` and `resizable.tsx` have pre-existing TypeScript errors.

## Decision this plan encodes, and its cost

You chose the full one-page anchor structure over keeping the multi-route site. Stated plainly once, then not raised again: taher.xyz has no case studies, no dates and no project detail because it sells scraping services to buyers, and a single page is the right shape for that. This site's three case studies — scope boundaries, rejected alternatives, named tradeoffs — are what make it read senior to a hiring manager, and a one-page site has no room to render them in full.

**Task 9 is therefore the load-bearing decision in this plan.** It keeps `/work/:slug` as deep-dive detail pages reachable from the one-page Work section, so the home page is the single-page experience you asked for and the depth is still one click away. Two alternatives are written out there — a full delete, and an accordion-in-page variant. If you want the case studies gone entirely, Task 9 is where to say so, and nothing before it depends on the answer.

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Package manager is Bun.** `bun add`, never npm or yarn.
- **Formatting is Biome:** tabs, double quotes, semicolons. Lint **scoped to touched files only** — `bunx biome check --write <paths>`. Never `bun run lint`; it is repo-wide `biome check --write .` and rewrites ~20 unrelated pre-existing files.
- **Commit messages: exactly one line.** `feat: short thing done`. No body, no `Co-Authored-By`, no footers.
- **Path alias `@/` → `src/`.** Never `../../`.
- **Both themes must work.** Every colour is defined in `:root, .dark` *and* `.light`. No colour may exist in only one block. The `ThemeToggle` stays functional.
- **The suite stays green.** 73 tests pass at the start of this plan. Tests may be moved or rewritten as pages become sections, but the count must not silently drop — a deleted test is a decision to state in the report, not a side effect.
- **The content schema is untouchable.** `src/content/schema.ts` and `src/content/guards.ts` do not change. No case study may gain a numeric claim without a `method`.
- **No fabricated content.** Testimonials, newsletter subscribers and client quotes do not exist for this site. Sections that would display them are gated on a non-empty registry, exactly as `/writing` already is.
- **Exact palette values** are given in Task 1 and are copied verbatim; do not re-derive or "adjust" them.

---

## Design system reference

Extracted from `https://taher.xyz/_astro/index.BLq9Zw2c.css` and its rendered markup.

**Light palette (verbatim from source):**

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `oklch(96.5% .012 85)` | page ground |
| `--color-surface` | `oklch(93.8% .014 85)` | raised block |
| `--color-surface-deep` | `oklch(90% .016 85)` | deepest block |
| `--color-ink` | `oklch(21% .014 70)` | body + headings |
| `--color-muted` | `oklch(45% .012 70)` | secondary text |
| `--color-faint` | `oklch(60% .012 75)` | tertiary text |
| `--color-line` | `oklch(80% .012 80)` | hairline rules |
| `--color-accent` | `oklch(52% .17 35)` | rust, used sparingly |

Every neutral sits on hue 70–85. The warmth is what makes it read editorial rather than SaaS; do not neutralise it.

**Type:**
- Display: `Newsreader`, fallback `Georgia, "Times New Roman", serif`. Used on **every** heading, h1 through h3.
- Body: `Hind Siliguri`, weights 400/500/600.
- Weights never exceed 600. Large headings are `font-medium` (500); small headings `font-semibold` (600).
- `tracking-tight` (`-0.025em`) on all headings. Leading tightens as size grows: `1.04` at h1, `1.08` at h2, `1.12` at h3.
- h1 `2.75rem → 3.75rem → 4.5rem`. h2 `2.25rem → 3rem`. h3 `1.5rem → 1.875rem`.
- **Eyebrow — the signature detail:** `font-mono text-[11px] uppercase tracking-[0.18em] text-muted`.
- Containers: `max-w-6xl` (72rem) outer shell, `max-w-2xl` (42rem) for running prose.

---

## File Structure

### Created

```
src/styles/tokens.css                     Warm OKLCH palette, both themes
src/components/section/Section.tsx        Numbered section wrapper + anchor target
src/components/section/Eyebrow.tsx        Mono uppercase label
src/components/section/SectionHeading.tsx Serif h2 with consistent scale
src/components/section/index.ts           Barrel for the three above
src/components/AnchorNav.tsx              Anchor nav with active-section tracking
src/sections/Hero.tsx                     01
src/sections/WhatIDo.tsx                  02
src/sections/Work.tsx                     03
src/sections/Process.tsx                  04
src/sections/Stack.tsx                    05
src/sections/Proof.tsx                    06 — gated on real recognition
src/sections/Contact.tsx                  07
src/data/process.ts                       How-I-work steps
src/data/recognition.ts                   Real awards only; empty array is valid
```

### Modified

```
src/index.css                 imports tokens.css; component layer rewritten
tailwind.config.ts            OKLCH colour bridge, font families, type scale
src/App.tsx                   route table collapses to one page + detail routes
src/components/Navigation.tsx becomes a thin wrapper over AnchorNav
src/components/Footer.tsx     warm palette, anchor links
src/components/Layout.tsx     paper ground
src/pages/Home.tsx            composes the seven sections
src/pages/CaseStudy.tsx       restyled to the new system (Task 9)
src/components/case-study/*   restyled; behaviour unchanged
src/components/Prose.tsx      measure + serif-aware leading
src/components/ThemeToggle.tsx warm palette
index.html                    font preconnect + stylesheet
```

### Deleted

```
src/pages/Work.tsx            becomes src/sections/Work.tsx
src/pages/About.tsx           absorbed into sections
src/pages/Contact.tsx         becomes src/sections/Contact.tsx
src/pages/Work.test.tsx       replaced by section tests
src/pages/About.test.tsx      replaced by section tests
src/pages/Contact.test.tsx    replaced by section tests
```

---

## Task 1: Warm OKLCH token system

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/tokens.test.ts`
- Modify: `src/index.css`, `tailwind.config.ts`

**Interfaces:**
- Produces Tailwind colour utilities `paper`, `surface`, `surface-deep`, `ink`, `muted`, `faint`, `line`, `accent`. Every later task uses these names and no others.

- [ ] **Step 1: Write the failing token test**

Create `src/styles/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(process.cwd(), "src/styles/tokens.css"), "utf8");

const TOKENS = [
	"--color-paper",
	"--color-surface",
	"--color-surface-deep",
	"--color-ink",
	"--color-muted",
	"--color-faint",
	"--color-line",
	"--color-accent",
];

describe("design tokens", () => {
	it("defines every token in both themes", () => {
		const light = css.slice(css.indexOf(".light"));
		const dark = css.slice(css.indexOf(":root"), css.indexOf(".light"));
		for (const token of TOKENS) {
			expect(dark, `${token} missing from dark`).toContain(token);
			expect(light, `${token} missing from light`).toContain(token);
		}
	});

	it("uses oklch for every colour", () => {
		const declarations = css.match(/--color-[a-z-]+:\s*([^;]+);/g) ?? [];
		expect(declarations.length).toBeGreaterThan(0);
		for (const declaration of declarations) {
			expect(declaration).toContain("oklch(");
		}
	});

	it("keeps the neutrals warm", () => {
		const hues = [...css.matchAll(/--color-(?:paper|surface|ink|muted|faint|line)[a-z-]*:\s*oklch\([\d.]+%\s+[\d.]+\s+(\d+)\)/g)].map(
			(match) => Number(match[1]),
		);
		expect(hues.length).toBeGreaterThan(0);
		for (const hue of hues) {
			expect(hue).toBeGreaterThanOrEqual(60);
			expect(hue).toBeLessThanOrEqual(95);
		}
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/styles/tokens.test.ts`

Expected: FAIL — `ENOENT: no such file or directory, open '.../src/styles/tokens.css'`.

- [ ] **Step 3: Write the tokens**

Create `src/styles/tokens.css`:

```css
/*
 * Warm paper palette. Every neutral sits on hue 70–85; the single accent is at
 * hue 35. The warmth is the design — neutralising these hues turns the site
 * back into generic SaaS blue-grey.
 *
 * Light values are taken verbatim from the reference implementation. Dark is
 * derived by inverting lightness while holding hue and chroma, so the warm
 * character survives the theme switch.
 */
:root,
.dark {
	--color-paper: oklch(18% 0.012 85);
	--color-surface: oklch(22% 0.014 85);
	--color-surface-deep: oklch(26% 0.016 85);
	--color-ink: oklch(94% 0.012 85);
	--color-muted: oklch(72% 0.012 75);
	--color-faint: oklch(58% 0.012 75);
	--color-line: oklch(34% 0.012 80);
	--color-accent: oklch(68% 0.15 35);
}

.light {
	--color-paper: oklch(96.5% 0.012 85);
	--color-surface: oklch(93.8% 0.014 85);
	--color-surface-deep: oklch(90% 0.016 85);
	--color-ink: oklch(21% 0.014 70);
	--color-muted: oklch(45% 0.012 70);
	--color-faint: oklch(60% 0.012 75);
	--color-line: oklch(80% 0.012 80);
	--color-accent: oklch(52% 0.17 35);
}
```

- [ ] **Step 4: Bridge the tokens into Tailwind**

In `tailwind.config.ts`, replace the `colors` object in `theme.extend` with:

```ts
			colors: {
				paper: "var(--color-paper)",
				surface: "var(--color-surface)",
				"surface-deep": "var(--color-surface-deep)",
				ink: "var(--color-ink)",
				muted: "var(--color-muted)",
				faint: "var(--color-faint)",
				line: "var(--color-line)",
				accent: "var(--color-accent)",
			},
```

Delete the `primary`, `secondary`, `card`, `popover`, `destructive`, `success`, `sidebar` and `border` colour entries and the `backgroundImage` gradient entries. Several `components/ui/*` files reference them; those files are unused and are deleted in Task 12. If the build breaks on one, note which and continue — do not restore a token to satisfy a file nobody renders.

- [ ] **Step 5: Import the tokens**

At the very top of `src/index.css`, above the `@tailwind` directives:

```css
@import "./styles/tokens.css";
```

Then delete the old `:root, .dark` and `.light` blocks from `src/index.css` entirely — `tokens.css` is now the only place colours are defined.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/styles/tokens.test.ts`

Expected: PASS — `3 passed`.

- [ ] **Step 7: Commit**

```bash
git add src/styles tailwind.config.ts src/index.css
git commit -m "feat: replace palette with warm oklch tokens"
```

---

## Task 2: Typography

**Files:**
- Modify: `index.html`, `tailwind.config.ts`, `src/index.css`
- Modify: `src/index.css.test.ts` (extend)

**Interfaces:**
- Produces font utilities `font-display` (Newsreader), `font-sans` (Hind Siliguri), `font-mono`.

- [ ] **Step 1: Load the fonts**

In `index.html`, inside `<head>`, replace any existing Google Fonts link with:

```html
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&family=Hind+Siliguri:wght@400;500;600&display=swap"
    />
```

Remove the `@import url(...)` for fonts from the top of `src/index.css` — loading them from the document head avoids the render-blocking CSS import chain.

- [ ] **Step 2: Wire the families**

In `tailwind.config.ts`, replace `fontFamily`:

```ts
			fontFamily: {
				display: ["Newsreader", "Georgia", "Times New Roman", "serif"],
				sans: ["Hind Siliguri", "system-ui", "-apple-system", "sans-serif"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			},
```

- [ ] **Step 3: Set the base**

In `src/index.css`, replace the `body` rule:

```css
	body {
		@apply bg-paper text-ink font-sans antialiased;
		min-width: 320px;
		font-feature-settings: "cv11", "ss01";
		text-rendering: optimizeLegibility;
	}
```

- [ ] **Step 4: Extend the style-contract test**

In `src/index.css.test.ts`, add:

```ts
describe("typography contract", () => {
	it("loads fonts from the document head, not a css import", () => {
		expect(css).not.toContain("@import url(\"https://fonts.googleapis.com");
	});

	it("paints the paper ground on body", () => {
		expect(css).toMatch(/body\s*\{[^}]*bg-paper/s);
	});
});
```

- [ ] **Step 5: Run the suite**

Run: `bun run test`

Expected: PASS. Some page tests may fail on removed colour class names — that is Task 10's cleanup; note any and continue only if the failures are class-name assertions, not behaviour.

- [ ] **Step 6: Commit**

```bash
git add index.html tailwind.config.ts src/index.css src/index.css.test.ts
git commit -m "feat: adopt newsreader and hind siliguri type system"
```

---

## Task 3: Section primitives

The three components that give every section its rhythm. Building them once is what stops seven sections from drifting apart.

**Files:**
- Create: `src/components/section/Eyebrow.tsx`, `SectionHeading.tsx`, `Section.tsx`, `index.ts`
- Create: `src/components/section/section.test.tsx`

**Interfaces:**
- `<Eyebrow>{children}</Eyebrow>`
- `<SectionHeading>{children}</SectionHeading>` — renders `h2`
- `<Section id={string} number={string} eyebrow={string} title={string}>{children}</Section>`

- [ ] **Step 1: Write the failing test**

Create `src/components/section/section.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow, Section, SectionHeading } from "@/components/section";

describe("Eyebrow", () => {
	it("renders monospace uppercase label text", () => {
		render(<Eyebrow>Selected work</Eyebrow>);
		const el = screen.getByText("Selected work");
		expect(el.className).toContain("font-mono");
		expect(el.className).toContain("uppercase");
	});
});

describe("SectionHeading", () => {
	it("renders a level-2 heading in the display face", () => {
		render(<SectionHeading>What I do</SectionHeading>);
		const heading = screen.getByRole("heading", { level: 2, name: "What I do" });
		expect(heading.className).toContain("font-display");
	});
});

describe("Section", () => {
	it("exposes an anchor target and labels itself by its heading", () => {
		render(
			<Section id="work" number="03" eyebrow="Selected work" title="Built in production">
				<p>body</p>
			</Section>,
		);
		const region = screen.getByRole("region", { name: /built in production/i });
		expect(region).toHaveAttribute("id", "work");
		expect(screen.getByText("03")).toBeInTheDocument();
		expect(screen.getByText("body")).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/section`

Expected: FAIL — `Failed to resolve import "@/components/section"`.

- [ ] **Step 3: Implement Eyebrow**

Create `src/components/section/Eyebrow.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The signature detail of this design: a tiny monospace label above each
 * section heading. Wide tracking is what makes it read as a label rather than
 * as small body text.
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<p className={cn("font-mono text-[11px] uppercase tracking-[0.18em] text-muted", className)}>
			{children}
		</p>
	);
}
```

- [ ] **Step 4: Implement SectionHeading**

Create `src/components/section/SectionHeading.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<h2
			className={cn(
				"mt-3 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink md:text-5xl",
				className,
			)}
		>
			{children}
		</h2>
	);
}
```

- [ ] **Step 5: Implement Section**

Create `src/components/section/Section.tsx`:

```tsx
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/section/Eyebrow";
import { SectionHeading } from "@/components/section/SectionHeading";

interface SectionProps {
	id: string;
	number: string;
	eyebrow: string;
	title: string;
	children: ReactNode;
}

export function Section({ id, number, eyebrow, title, children }: SectionProps) {
	const headingId = `${id}-heading`;

	return (
		<section
			id={id}
			aria-labelledby={headingId}
			className="scroll-mt-24 border-t border-line py-20 md:py-28"
		>
			<div className="mx-auto max-w-6xl px-5 sm:px-8">
				<div className="flex items-baseline gap-4">
					<span className="font-mono text-[11px] tracking-[0.18em] text-faint">{number}</span>
					<Eyebrow>{eyebrow}</Eyebrow>
				</div>
				<SectionHeading className="max-w-[22ch]" >
					<span id={headingId}>{title}</span>
				</SectionHeading>
				<div className="mt-10">{children}</div>
			</div>
		</section>
	);
}
```

- [ ] **Step 6: Barrel the exports**

Create `src/components/section/index.ts`:

```ts
export { Eyebrow } from "./Eyebrow";
export { Section } from "./Section";
export { SectionHeading } from "./SectionHeading";
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `bun run test src/components/section`

Expected: PASS — `3 passed`.

- [ ] **Step 8: Commit**

```bash
git add src/components/section
git commit -m "feat: add section primitives with mono eyebrows"
```

---

## Task 4: Anchor navigation

**Files:**
- Create: `src/components/AnchorNav.tsx`, `src/components/AnchorNav.test.tsx`
- Modify: `src/components/Navigation.tsx`

**Interfaces:**
- Produces `SECTIONS: { id: string; label: string }[]` and `<AnchorNav />`. Task 10's Home composition and Task 11's Footer both import `SECTIONS`.

- [ ] **Step 1: Write the failing test**

Create `src/components/AnchorNav.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnchorNav, SECTIONS } from "@/components/AnchorNav";
import { renderWithRouter } from "@/test/render";

describe("AnchorNav", () => {
	it("links every section by fragment", () => {
		renderWithRouter(<AnchorNav />);
		for (const section of SECTIONS) {
			const link = screen.getByRole("link", { name: section.label });
			expect(link).toHaveAttribute("href", `#${section.id}`);
		}
	});

	it("keeps the mobile menu target in the DOM while collapsed", () => {
		const { container } = renderWithRouter(<AnchorNav />);
		const toggle = screen.getByRole("button", { name: /menu/i });
		const controls = toggle.getAttribute("aria-controls");
		expect(controls).toBeTruthy();
		expect(container.querySelector(`#${controls}`)).not.toBeNull();
	});
});
```

The second test exists because the previous navigation shipped an `aria-controls` pointing at a conditionally-mounted element, which axe flags. Do not reintroduce that pattern.

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/components/AnchorNav.test.tsx`

Expected: FAIL — unresolved import.

- [ ] **Step 3: Implement AnchorNav**

Create `src/components/AnchorNav.tsx`:

```tsx
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface SectionLink {
	id: string;
	label: string;
}

export const SECTIONS: SectionLink[] = [
	{ id: "what-i-do", label: "What I do" },
	{ id: "work", label: "Work" },
	{ id: "process", label: "Process" },
	{ id: "stack", label: "Stack" },
	{ id: "contact", label: "Contact" },
];

export function AnchorNav() {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<string>("");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				}
			},
			{ rootMargin: "-45% 0px -50% 0px" },
		);

		for (const section of SECTIONS) {
			const el = document.getElementById(section.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
				<a href="#top" className="font-display text-base font-semibold tracking-tight text-ink">
					{profile.name}
				</a>

				<nav aria-label="Sections" className="hidden items-center gap-1 sm:flex">
					{SECTIONS.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							aria-current={active === section.id ? "true" : undefined}
							className={cn(
								"rounded px-3 py-2 text-sm transition-colors",
								active === section.id ? "text-ink" : "text-muted hover:text-ink",
							)}
						>
							{section.label}
						</a>
					))}
					<a
						href={profile.resumePath}
						target="_blank"
						rel="noreferrer"
						className="ml-2 rounded border border-line px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
					>
						Résumé
					</a>
					<ThemeToggle />
				</nav>

				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-controls="anchor-nav-mobile"
					aria-label={open ? "Close menu" : "Open menu"}
					className="rounded p-2 text-muted sm:hidden"
				>
					{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			{/* Always mounted so aria-controls always resolves; visibility is toggled. */}
			<nav
				id="anchor-nav-mobile"
				aria-label="Sections"
				hidden={!open}
				className="border-t border-line px-5 pb-5 pt-2 sm:hidden"
			>
				{SECTIONS.map((section) => (
					<a
						key={section.id}
						href={`#${section.id}`}
						onClick={() => setOpen(false)}
						className="block py-2.5 text-sm text-muted"
					>
						{section.label}
					</a>
				))}
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="block py-2.5 text-sm text-muted"
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

- [ ] **Step 4: Point Navigation at it**

Replace the whole body of `src/components/Navigation.tsx`:

```tsx
export { AnchorNav as Navigation, SECTIONS } from "@/components/AnchorNav";
```

This keeps `Layout.tsx`'s existing `import { Navigation }` working without touching it.

- [ ] **Step 5: Add the jsdom guard**

`IntersectionObserver` does not exist in jsdom. Append to `src/test/setup.ts`:

```ts
if (!("IntersectionObserver" in globalThis)) {
	class NoopIntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
		root = null;
		rootMargin = "";
		thresholds = [];
	}
	// @ts-expect-error — minimal stub for tests
	globalThis.IntersectionObserver = NoopIntersectionObserver;
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/components/AnchorNav.test.tsx`

Expected: PASS — `2 passed`.

- [ ] **Step 7: Commit**

```bash
git add src/components/AnchorNav.tsx src/components/AnchorNav.test.tsx src/components/Navigation.tsx src/test/setup.ts
git commit -m "feat: add anchor nav with active section tracking"
```

---

## Task 5: Hero and What I do

**Files:**
- Create: `src/sections/Hero.tsx`, `src/sections/WhatIDo.tsx`, `src/sections/sections.test.tsx`

**Interfaces:**
- `<Hero />`, `<WhatIDo />` — both default to reading `profile`.

- [ ] **Step 1: Write the failing test**

Create `src/sections/sections.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { Hero } from "@/sections/Hero";
import { WhatIDo } from "@/sections/WhatIDo";
import { renderWithRouter } from "@/test/render";

describe("Hero", () => {
	it("leads with the positioning line as the only h1", () => {
		renderWithRouter(<Hero />);
		const headings = screen.getAllByRole("heading", { level: 1 });
		expect(headings).toHaveLength(1);
		expect(headings[0]).toHaveTextContent(profile.positioning);
	});

	it("renders no vanity counters", () => {
		const { container } = renderWithRouter(<Hero />);
		expect(container.textContent).not.toMatch(/years experience|projects delivered/i);
	});
});

describe("WhatIDo", () => {
	it("renders one block per headline point", () => {
		renderWithRouter(<WhatIDo />);
		for (const point of profile.headline) {
			expect(screen.getByText(point)).toBeInTheDocument();
		}
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/sections/sections.test.tsx`

Expected: FAIL — unresolved imports.

- [ ] **Step 3: Implement Hero**

Create `src/sections/Hero.tsx`:

```tsx
import { profile } from "@/data/profile";

export function Hero() {
	return (
		<section id="top" className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
			<h1 className="max-w-[16ch] font-display text-[2.75rem] font-medium leading-[1.04] tracking-tight text-ink sm:text-6xl md:text-7xl">
				{profile.positioning}
			</h1>

			<div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
				{profile.pitch.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</div>

			<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
				<a
					href="#contact"
					className="rounded bg-ink px-4 py-2.5 font-medium text-paper transition-opacity hover:opacity-90"
				>
					Get in touch
				</a>
				<a
					href={profile.resumePath}
					target="_blank"
					rel="noreferrer"
					className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
				>
					Résumé (PDF)
				</a>
				{profile.links.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noreferrer"
						className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
					>
						{link.label}
					</a>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 4: Implement WhatIDo**

Create `src/sections/WhatIDo.tsx`:

```tsx
import { Section } from "@/components/section";
import { profile } from "@/data/profile";

export function WhatIDo() {
	return (
		<Section id="what-i-do" number="01" eyebrow="Capabilities" title="What I do">
			<div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
				{profile.headline.map((point, index) => (
					<div key={point}>
						<span className="font-mono text-[11px] tracking-[0.18em] text-faint">
							{String(index + 1).padStart(2, "0")}
						</span>
						<p className="mt-3 font-display text-2xl font-medium leading-[1.12] tracking-tight text-ink md:text-3xl">
							{point}
						</p>
					</div>
				))}
			</div>
		</Section>
	);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun run test src/sections/sections.test.tsx`

Expected: PASS — `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/sections
git commit -m "feat: add hero and capabilities sections"
```

---

## Task 6: Work section

**Files:**
- Create: `src/sections/Work.tsx`, `src/sections/Work.test.tsx`

**Interfaces:**
- `<Work />` reads `caseStudies`. Each entry links to `/work/<slug>`.

- [ ] **Step 1: Write the failing test**

Create `src/sections/Work.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/case-studies";
import { Work } from "@/sections/Work";
import { renderWithRouter } from "@/test/render";

describe("Work section", () => {
	it("lists every case study with a link to its detail page", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			const link = screen.getByRole("link", { name: new RegExp(study.title, "i") });
			expect(link).toHaveAttribute("href", `/work/${study.slug}`);
		}
	});

	it("shows the scope boundary for each entry", () => {
		renderWithRouter(<Work />);
		for (const study of caseStudies) {
			expect(screen.getByText(study.scope)).toBeInTheDocument();
		}
	});

	it("shows no card borders or decorative chrome around entries", () => {
		const { container } = renderWithRouter(<Work />);
		expect(container.querySelectorAll(".shadow-lg, .rounded-xl")).toHaveLength(0);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/sections/Work.test.tsx`

Expected: FAIL — unresolved import.

- [ ] **Step 3: Implement Work**

Create `src/sections/Work.tsx`:

```tsx
import { Link } from "react-router-dom";
import { EvidenceBadge } from "@/components/case-study/EvidenceBadge";
import { Section } from "@/components/section";
import { caseStudies } from "@/content/case-studies";

export function Work() {
	return (
		<Section id="work" number="02" eyebrow="Selected work" title="Built and run in production">
			<ol className="space-y-14">
				{caseStudies.map((study) => (
					<li key={study.slug} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
							<span>{study.organisation}</span>
							<span aria-hidden="true">·</span>
							<span>{study.period}</span>
							<span aria-hidden="true">·</span>
							<span>{study.domain}</span>
							<EvidenceBadge level={study.evidence} />
						</div>

						<h3 className="mt-3 max-w-[26ch] font-display text-2xl font-semibold leading-[1.12] tracking-tight text-ink md:text-3xl">
							<Link to={`/work/${study.slug}`} className="transition-colors hover:text-accent">
								{study.title}
							</Link>
						</h3>

						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{study.summary}</p>

						<p className="mt-4 max-w-2xl leading-relaxed text-muted">
							<span className="text-ink">Scope. </span>
							{study.scope}
						</p>

						<p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
							{study.stack.join(" · ")}
						</p>

						<p className="mt-5">
							<Link
								to={`/work/${study.slug}`}
								className="text-sm text-ink underline underline-offset-4 transition-colors hover:text-accent"
							>
								Read the case study
							</Link>
						</p>
					</li>
				))}
			</ol>
		</Section>
	);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `bun run test src/sections/Work.test.tsx`

Expected: PASS — `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Work.tsx src/sections/Work.test.tsx
git commit -m "feat: add work section listing case studies"
```

---

## Task 7: Process and Stack

**Files:**
- Create: `src/data/process.ts`, `src/sections/Process.tsx`, `src/sections/Stack.tsx`, `src/sections/process-stack.test.tsx`

**Interfaces:**
- `processSteps: { title: string; body: string }[]` from `@/data/process`
- `<Process />`, `<Stack />`

- [ ] **Step 1: Write the failing test**

Create `src/sections/process-stack.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { processSteps } from "@/data/process";
import { stackGroups } from "@/data/stack";
import { Process } from "@/sections/Process";
import { Stack } from "@/sections/Stack";
import { renderWithRouter } from "@/test/render";

describe("process data", () => {
	it("has exactly three steps and no placeholder text", () => {
		expect(processSteps).toHaveLength(3);
		expect(findPlaceholders(processSteps)).toEqual([]);
	});
});

describe("Process", () => {
	it("renders every step title", () => {
		renderWithRouter(<Process />);
		for (const step of processSteps) {
			expect(screen.getByText(step.title)).toBeInTheDocument();
		}
	});
});

describe("Stack", () => {
	it("renders every group with no proficiency ratings", () => {
		const { container } = renderWithRouter(<Stack />);
		for (const group of stackGroups) {
			expect(screen.getByText(group.name)).toBeInTheDocument();
		}
		expect(container.textContent).not.toMatch(/\bExpert\b|\bAdvanced\b|\bIntermediate\b/);
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/sections/process-stack.test.tsx`

Expected: FAIL — unresolved imports.

- [ ] **Step 3: Write the process data**

Create `src/data/process.ts`:

```ts
export interface ProcessStep {
	title: string;
	body: string;
}

/**
 * How the work actually goes, stated as three steps. Written to be true of the
 * case studies on this site rather than as a generic agency methodology — if a
 * step here does not describe how a piece of work in the Work section went,
 * the step is wrong.
 */
export const processSteps: ProcessStep[] = [
	{
		title: "Find the constraint",
		body: "Before anything gets designed I want to know what actually boxes the solution in — the deploy schedule, the team that has to maintain it, the system upstream that will not change. Most bad architecture is a good idea applied to the wrong constraint.",
	},
	{
		title: "Ship the smaller change",
		body: "The version that survives is usually smaller than the one first proposed. I would rather put a narrow thing into production and learn from it than land a broad one that nobody can operate.",
	},
	{
		title: "Make it someone else's to run",
		body: "Work is not finished when it passes review. It is finished when another engineer can deploy it, debug it at two in the morning, and change it without asking me what I was thinking.",
	},
];
```

- [ ] **Step 4: Implement Process**

Create `src/sections/Process.tsx`:

```tsx
import { Section } from "@/components/section";
import { processSteps } from "@/data/process";

export function Process() {
	return (
		<Section id="process" number="03" eyebrow="How I work" title="Three things that shape the work">
			<div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
				{processSteps.map((step, index) => (
					<div key={step.title}>
						<span className="font-mono text-[11px] tracking-[0.18em] text-faint">
							{String(index + 1).padStart(2, "0")}
						</span>
						<h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{step.title}
						</h3>
						<p className="mt-3 leading-relaxed text-muted">{step.body}</p>
					</div>
				))}
			</div>
		</Section>
	);
}
```

- [ ] **Step 5: Implement Stack**

Create `src/sections/Stack.tsx`:

```tsx
import { Section } from "@/components/section";
import { stackGroups } from "@/data/stack";

export function Stack() {
	return (
		<Section id="stack" number="04" eyebrow="Tools" title="The tools behind the work">
			<p className="max-w-2xl leading-relaxed text-muted">
				Grouped by what I use each thing for. No proficiency ratings — what a tool is used for is
				something you can check in conversation, and a grade I award myself is not.
			</p>

			<div className="mt-10 space-y-10">
				{stackGroups.map((group) => (
					<div key={group.name} className="border-t border-line pt-6">
						<h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{group.name}
						</h3>
						<p className="mt-2 max-w-2xl leading-relaxed text-muted">{group.purpose}</p>
						<dl className="mt-5 space-y-3">
							{group.items.map((item) => (
								<div key={item.name} className="sm:flex sm:gap-6">
									<dt className="text-ink sm:w-56 sm:shrink-0">{item.name}</dt>
									<dd className="leading-relaxed text-muted">
										{item.usedFor} <span className="text-faint">· since {item.since}</span>
									</dd>
								</div>
							))}
						</dl>
					</div>
				))}
			</div>
		</Section>
	);
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `bun run test src/sections/process-stack.test.tsx`

Expected: PASS — `4 passed`.

- [ ] **Step 7: Commit**

```bash
git add src/data/process.ts src/sections/Process.tsx src/sections/Stack.tsx src/sections/process-stack.test.tsx
git commit -m "feat: add process and stack sections"
```

---

## Task 8: Proof section, gated on real recognition

taher.xyz has a testimonials section. This site has no testimonials, and inventing them is out of the question — a fabricated client quote is the single most damaging thing that could go on a portfolio. What it does have is a real, attributable award. This task builds the section so it renders only when the registry has something in it.

**Files:**
- Create: `src/data/recognition.ts`, `src/sections/Proof.tsx`, `src/sections/Proof.test.tsx`

**Interfaces:**
- `recognition: RecognitionItem[]` — `{ title, issuer, year, note? }`
- `<Proof />` returns `null` when the registry is empty.

- [ ] **Step 1: Write the failing test**

Create `src/sections/Proof.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "@/content/guards";
import { recognition } from "@/data/recognition";
import { Proof } from "@/sections/Proof";
import { renderWithRouter } from "@/test/render";

describe("recognition data", () => {
	it("carries an issuer and a year on every entry", () => {
		for (const item of recognition) {
			expect(item.issuer.length).toBeGreaterThan(2);
			expect(item.year).toMatch(/^\d{4}$/);
		}
	});

	it("has no placeholder text", () => {
		expect(findPlaceholders(recognition)).toEqual([]);
	});
});

describe("Proof", () => {
	it("renders every entry with its issuer", () => {
		const { container } = renderWithRouter(<Proof />);
		if (recognition.length === 0) {
			expect(container).toBeEmptyDOMElement();
			return;
		}
		for (const item of recognition) {
			expect(screen.getByText(item.title)).toBeInTheDocument();
			expect(screen.getByText(new RegExp(item.issuer))).toBeInTheDocument();
		}
	});
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/sections/Proof.test.tsx`

Expected: FAIL — unresolved imports.

- [ ] **Step 3: Write the recognition data**

Create `src/data/recognition.ts`:

```ts
export interface RecognitionItem {
	title: string;
	issuer: string;
	year: string;
	note?: string;
}

/**
 * Real, attributable recognition only. This is where the previous version of
 * this site displayed self-issued "certifications" with an issuer of
 * "Portfolio and product workflow experience" and a verified badge — the
 * single most damaging thing on it. An empty array is a perfectly good state;
 * an invented entry is not.
 */
export const recognition: RecognitionItem[] = [
	{
		title: "Best Employee of the Year",
		issuer: "BJIT Group Ltd.",
		year: "2023",
		note: "Awarded for sustained delivery and cross-team impact across multiple product lines.",
	},
];
```

- [ ] **Step 4: Implement Proof**

Create `src/sections/Proof.tsx`:

```tsx
import { Section } from "@/components/section";
import { recognition } from "@/data/recognition";

export function Proof() {
	if (recognition.length === 0) {
		return null;
	}

	return (
		<Section id="proof" number="05" eyebrow="Recognition" title="What the work earned">
			<ul className="space-y-8">
				{recognition.map((item) => (
					<li key={`${item.title}-${item.year}`} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
						<h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
							{item.title}
						</h3>
						<p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
							{item.issuer} · {item.year}
						</p>
						{item.note && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.note}</p>}
					</li>
				))}
			</ul>
		</Section>
	);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun run test src/sections/Proof.test.tsx`

Expected: PASS — `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/data/recognition.ts src/sections/Proof.tsx src/sections/Proof.test.tsx
git commit -m "feat: add recognition section gated on real awards"
```

---

## Task 9: Case study detail routes — the decision point

**This is the task where the one-page structure meets the case-study depth.** Three options are written out. **The plan proceeds with Option A unless told otherwise**; nothing in Tasks 1–8 depends on which is chosen, so the decision can be made here without rework.

### Option A — keep `/work/:slug`, restyle it (default)

The home page is the single-page anchor experience you asked for. Each Work entry links to a full case study at its own URL. Cost: two routes remain, so it is not literally a one-page site. Benefit: the decisions, tradeoffs and reflections stay readable and linkable, and a hiring manager can be sent straight to one.

### Option B — delete the case studies entirely

Matches taher.xyz exactly: the Work section shows organisation, period, title and scope, and there is nowhere to click. Cost: the three case studies and everything derived from them are removed from the site. Their source files can stay in the repo unreferenced, but they stop being part of the product.

### Option C — expand in place

Case studies expand inside the Work section as disclosure panels. Genuinely one page. Cost: a fully expanded case study is long, so the page becomes very tall, and deep-linking to one requires extra work.

- [ ] **Step 1: Confirm the option**

If Option B or C is chosen, stop and rewrite this task before continuing. The steps below implement **Option A**.

- [ ] **Step 2: Restyle the case study page**

In `src/pages/CaseStudy.tsx`, apply the new system by substitution. The structure and all `SEOHead` wiring stay exactly as they are; only classes change:

- `text-muted-foreground` → `text-muted`
- `text-foreground` → `text-ink`
- `border-border`, `border-border/70` → `border-line`
- `bg-background` → `bg-paper`
- `hover:text-accent` stays (the token now resolves to rust)
- The `h1` keeps `font-display`; add `font-medium` and `leading-[1.04]` to match the hero scale
- Section headings (`Section` helper inside the file) become `font-mono text-[11px] uppercase tracking-[0.18em] text-faint`

- [ ] **Step 3: Restyle the case study components**

Apply the same substitution in `src/components/case-study/DecisionBlock.tsx`, `ResultsTable.tsx` and `EvidenceBadge.tsx`, and in `src/components/Prose.tsx`. Behaviour must not change — the existing 5 tests in `src/components/case-study/case-study.test.tsx` prove it. Do not modify those tests.

- [ ] **Step 4: Run the tests**

Run: `bun run test src/components/case-study src/pages/CaseStudy.test.tsx`

Expected: PASS — `10 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CaseStudy.tsx src/components/case-study src/components/Prose.tsx
git commit -m "style: restyle case study pages to the warm system"
```

---

## Task 10: Compose the one page and collapse the routes

**Files:**
- Modify: `src/pages/Home.tsx`, `src/App.tsx`, `src/components/Layout.tsx`
- Delete: `src/pages/Work.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx` and their tests
- Create: `src/sections/Contact.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- `/` renders all sections. `/work`, `/about`, `/contact` become fragment redirects.

- [ ] **Step 1: Write the failing routing test**

Replace the routing describe block in `src/App.test.tsx`:

```tsx
describe("one page routing", () => {
	it("renders every section on the home route", async () => {
		renderWithRouter(<App />, { route: "/" });
		for (const section of SECTIONS) {
			expect(await screen.findByRole("region", { name: new RegExp(section.label, "i") })).toBeTruthy();
		}
	});

	it("keeps case study detail routes reachable", async () => {
		renderWithRouter(<App />, { route: `/work/${caseStudies[0].slug}` });
		expect(
			await screen.findByRole("heading", { level: 1, name: caseStudies[0].title }),
		).toBeInTheDocument();
	});

	it("redirects retired page routes onto the one page", async () => {
		renderWithRouter(<App />, { route: "/about" });
		expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(profile.positioning);
	});
});
```

Add the imports it needs at the top of the file: `SECTIONS` from `@/components/AnchorNav`, `caseStudies` from `@/content/case-studies`, `profile` from `@/data/profile`.

Note: the section `aria-label` comes from the section title, not the nav label, so where a nav label and section title differ, match on the section title instead. Adjust the regex per section rather than loosening the assertion.

- [ ] **Step 2: Run it to verify it fails**

Run: `bun run test src/App.test.tsx`

Expected: FAIL — sections are not composed onto `/` yet.

- [ ] **Step 3: Write the Contact section**

Create `src/sections/Contact.tsx` by moving the body of `src/pages/Contact.tsx` into a `Section` wrapper with `id="contact"`, `number="06"`, `eyebrow="Contact"`, `title="Get in touch"`. Keep the `mailto:` link, the availability line, the response-time line and the location. Drop the page's own `SEOHead` — the home page owns the document head now. Apply the palette substitution from Task 9 Step 2.

- [ ] **Step 4: Compose Home**

Replace `src/pages/Home.tsx`:

```tsx
import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Process } from "@/sections/Process";
import { Proof } from "@/sections/Proof";
import { Stack } from "@/sections/Stack";
import { WhatIDo } from "@/sections/WhatIDo";
import { Work } from "@/sections/Work";

export default function Home() {
	return (
		<>
			<SEOHead description={profile.positioning} path="/" />
			<Hero />
			<WhatIDo />
			<Work />
			<Process />
			<Stack />
			<Proof />
			<Contact />
		</>
	);
}
```

- [ ] **Step 5: Collapse the route table**

In `src/App.tsx`, remove the lazy imports and routes for `Work`, `About` and `Contact` pages, and replace their routes with fragment redirects:

```tsx
								<Route path="/work" element={<Navigate to="/#work" replace />} />
								<Route path="/about" element={<Navigate to="/#what-i-do" replace />} />
								<Route path="/contact" element={<Navigate to="/#contact" replace />} />
								<Route path="/projects" element={<Navigate to="/#work" replace />} />
								<Route path="/skills" element={<Navigate to="/#stack" replace />} />
								<Route path="/experience" element={<Navigate to="/#work" replace />} />
```

Keep `/work/:slug`, the conditional `/writing` routes and the `*` NotFound route exactly as they are. `/work/:slug` must be declared **before** `/work` so the more specific pattern is not shadowed.

- [ ] **Step 6: Delete the retired pages**

```bash
git rm src/pages/Work.tsx src/pages/Work.test.tsx \
       src/pages/About.tsx src/pages/About.test.tsx \
       src/pages/Contact.tsx src/pages/Contact.test.tsx
```

The assertions in those tests that still carry value — no proficiency ratings, no certifications section, no phone number, exactly one teaching link — must be carried over into the section tests rather than dropped. State in your report which assertions you moved and where.

- [ ] **Step 7: Paint the ground**

In `src/components/Layout.tsx`, change the root wrapper to `className="min-h-screen bg-paper"` and update the skip link's classes to the new palette.

- [ ] **Step 8: Run the full suite**

Run: `bun run test && bun run build`

Expected: both pass. Report the final test count against the 73-test baseline and account for every difference.

- [ ] **Step 9: Commit**

```bash
git add -u && git add src/sections src/pages/Home.tsx src/App.tsx src/App.test.tsx src/components/Layout.tsx
git commit -m "feat: collapse site onto one anchored page"
```

---

## Task 11: Footer, theme toggle and remaining chrome

**Files:**
- Modify: `src/components/Footer.tsx`, `src/components/ThemeToggle.tsx`, `src/pages/NotFound.tsx`, `src/pages/Writing.tsx`, `src/pages/Note.tsx`

- [ ] **Step 1: Restyle the footer**

Replace the nav item source in `src/components/Footer.tsx` with `SECTIONS` from `@/components/AnchorNav`, rendering fragment links (`#${section.id}`) rather than routes. Apply the palette substitution. Keep `profile.links` and the location line.

- [ ] **Step 2: Restyle the remaining pages**

Apply the same palette substitution in `NotFound.tsx`, `Writing.tsx` and `Note.tsx`. `Note.tsx` keeps `font-display` on its `h1`.

- [ ] **Step 3: Verify the theme toggle still switches both palettes**

Run: `bun run dev`, open `http://localhost:3000`, toggle the theme, and confirm on each section that text contrast holds and the accent stays legible in both. Warm dark is the palette most likely to have a weak spot — check `text-faint` on `bg-paper` specifically.

- [ ] **Step 4: Run the suite and commit**

```bash
bun run test
git add src/components/Footer.tsx src/components/ThemeToggle.tsx src/pages/NotFound.tsx src/pages/Writing.tsx src/pages/Note.tsx
git commit -m "style: restyle footer and remaining pages"
```

---

## Task 12: Accessibility and bundle

Folds in Task 15 of the previous plan, which was never executed.

**Files:**
- Create: `src/test/a11y.test.tsx`
- Modify: `package.json`, and whatever the audit implicates
- Delete: unused `src/components/ui/*`

- [ ] **Step 1: Install the matcher**

```bash
bun add -d vitest-axe axe-core
```

- [ ] **Step 2: Write the accessibility test**

Create `src/test/a11y.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { Route, Routes } from "react-router-dom";
import { caseStudies } from "@/content/case-studies";
import CaseStudy from "@/pages/CaseStudy";
import Home from "@/pages/Home";
import { renderWithRouter } from "@/test/render";

expect.extend(matchers);

describe("accessibility", () => {
	it("the one page has no axe violations", async () => {
		const { container } = renderWithRouter(<Home />);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("a case study page has no axe violations", async () => {
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

- [ ] **Step 3: Fix what it finds**

Run: `bun run test src/test/a11y.test.tsx`

Likely findings and their fixes:
- **Colour contrast** on `text-faint` against `bg-paper`. Raise the lightness of `--color-faint` in whichever theme fails until axe passes. Change the token, not the usage.
- **Heading order** — the one page now has one `h1` and many `h2`/`h3`. Verify no section jumps a level.
- **Landmark nesting** — `AnchorNav` and `Footer` both render `<nav>`; each needs a distinct `aria-label`.

Iterate until green.

- [ ] **Step 4: Delete unused shadcn components**

```bash
for f in src/components/ui/*.tsx; do
	name=$(basename "$f" .tsx)
	git grep -q "components/ui/$name" -- src ':!src/components/ui' || echo "unused: $f"
done
```

Delete what that prints. This resolves the pre-existing TypeScript errors in `ui/chart.tsx` and `ui/resizable.tsx`, which are unused.

- [ ] **Step 5: Drop the dependencies they pulled in**

```bash
git grep -n "recharts\|embla\|react-resizable-panels\|from \"lodash\"" -- src || echo "safe to remove"
bun remove recharts embla-carousel-react react-resizable-panels lodash @types/lodash
```

- [ ] **Step 6: Verify the budget**

Run: `bun run build`

Target: **under 120 kB gzipped** for the initial route. Baseline before this task is 149.66 kB gzip. Report the figure reached; if still over, name what is left in the bundle rather than lowering the target.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: resolve axe violations and trim the bundle"
```

---

## Task 13: SEO, README and CI

Folds in Task 16 of the previous plan.

**Files:**
- Modify: `public/sitemap.xml`, `src/components/SEO.tsx`, `README.md`
- Create: `.github/workflows/ci.yml`, `public/og.png`

- [ ] **Step 1: Fix the sitemap for the new structure**

Replace `public/sitemap.xml` with the home route at priority `1.0` plus one entry per case study slug at `0.8`. Remove `/about`, `/work` and `/contact` — they are now redirects, and listing a redirect in a sitemap is a soft error.

- [ ] **Step 2: Resolve the missing OG image**

`public/og.png` is referenced by `SEOHead` and `index.html` but does not exist, so every social share currently renders a broken image. Create a 1200×630 PNG carrying the name and positioning line on the warm paper ground. If you cannot generate an image, remove the `og:image` and `twitter:image` meta tags instead — a missing tag degrades better than a broken URL.

- [ ] **Step 3: Update the README**

Rewrite `README.md` to describe the current architecture: one anchored page plus case-study detail routes, the warm OKLCH token system in two themes, the zod-validated content model, and the rule that no numeric claim ships without its method. Keep the "Why it is built this way" framing — it is the part of the README a reviewer actually reads.

- [ ] **Step 4: Add CI**

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

`biome ci` rather than `bun run lint`, because `lint` writes fixes and CI must fail on unformatted code rather than silently correcting it.

- [ ] **Step 5: Final verification**

```bash
bun run test && bun run build
git grep -n "premium-card\|gradient-text\|--primary\|text-muted-foreground" -- src || echo "clean"
```

Expected: tests and build pass; the grep prints `clean`.

- [ ] **Step 6: Commit**

```bash
git add README.md .github public/sitemap.xml public/og.png src/components/SEO.tsx
git commit -m "docs: update readme, sitemap and ci for the one page site"
```

---

## Appendix: what is deliberately not copied from taher.xyz

| Their section | Why it is not reproduced as-is |
| --- | --- |
| Newsletter signup | This site has no newsletter and no subscribers. A signup form that goes nowhere is worse than no form. If a newsletter starts, add the section then. |
| Client testimonials ("Proof") | There are no client quotes to publish. Task 8 puts a real, attributable award in that slot instead, and renders nothing if the registry is emptied. |
| "Solutions" framing | Their four solutions are services sold to buyers. This site's audience is hiring managers, so the equivalent section states capabilities rather than offers. |
| Pricing / engagement model | Not applicable to a hiring-focused site. |
| Astro / static generation | Migrating off Vite + React Router is a rewrite, not a redesign, and would discard the passing test suite. The visual result does not depend on it. |
| Hind Siliguri as the *only* sans | Adopted as chosen, but note it is a Bengali-script family; its Latin subset is what this site uses. |

## Appendix: sequencing

- **Tasks 1–2 are the foundation** and everything after them assumes the new token and font names. Do them first, in order, alone.
- **Task 3 blocks Tasks 5–8.** All four section tasks import the primitives.
- **Tasks 5, 6, 7, 8 are independent** once Task 3 lands — they touch separate files under `src/sections/` and can be run in parallel.
- **Task 9 is a decision gate.** Confirm the option before implementing.
- **Task 10 must follow 5–9**, since it composes and deletes.
- **Tasks 11, 12, 13 are strictly sequential** at the end; the accessibility audit depends on final markup and the bundle check depends on the deletions.
