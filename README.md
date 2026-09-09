# anwarportfolio

A one-page portfolio for **Md. Anwar Hossain** — backend, cloud and platform
engineering. One anchored page, plus a page per case study.

Live: <https://anwarportfolio.vercel.app>

## What this repository is

Most of the interesting work here is not the UI. It is the constraint that the
site cannot make a claim it cannot back:

- **Content is parsed, not just imported.** Every case study and note goes
  through a zod schema (`src/content/schema.ts`) at module load. An invalid
  entry throws during the build and the test run, not in production.
- **Evidence level is enforced.** A case study declares `evidence` as
  `measured`, `estimated` or `qualitative`. `measured` requires a `results`
  array in which every result names the `method` behind the number.
  `qualitative` requires zero results. The schema rejects anything else, so a
  number cannot appear on the site without a method next to it.
- **Placeholders fail the suite.** `src/content/guards.ts` walks any object for
  `<<REPLACE>>`, `TODO`, `TBD`, `FIXME`, `Lorem ipsum` and `example.com`, and
  the tests assert none survive.
- **Every decision names what was rejected.** `decisionSchema` requires at
  least one rejected alternative with a reason, and a `tradeoff` — the cost of
  the choice that was made.

`docs/CONTENT-CONFIRMATION.md` lists every claim on the site alongside where it
came from, and what still needs confirming.

## Stack

| | |
| --- | --- |
| Build | Vite 7, Bun |
| UI | React 19, TypeScript 5.8, React Router 7 |
| Styling | Tailwind CSS 3.4 over OKLCH design tokens (`src/styles/tokens.css`) |
| Content | zod 4 schemas |
| Tests | Vitest, Testing Library, jsdom, axe |
| Tooling | Biome |
| Hosting | Vercel |

Design tokens are stored as bare OKLCH channels (`52% 0.17 35`) and wrapped in
`oklch(var(--token) / <alpha-value>)` by the Tailwind config. That is what makes
opacity modifiers such as `bg-paper/85` work — Tailwind cannot inject an alpha
value into a `var()` that already contains a complete `oklch()` call.

## Running it

```sh
bun install
bun run dev        # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `bun run dev` | Dev server |
| `bun run build` | Production build to `dist/` |
| `bun run preview` | Serve the built output |
| `bun run test` | Vitest, once |
| `bun run test:watch` | Vitest, watching |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | Biome, writing fixes |
| `bun run lint:ci` | Biome, read-only — what CI runs |
| `bun run verify` | Typecheck, test, lint, build |

CI runs the same four steps on every push and pull request
(`.github/workflows/ci.yml`).

## Layout

```
src/
  content/          Schema-validated content
    schema.ts       zod schemas; parseCaseStudy / parseNote
    guards.ts       Placeholder detection
    case-studies/   One file per case study, registered in index.ts
    notes/          Empty by design — /writing is mounted only when a note exists
  data/             Profile, roles, stack
  sections/         The one page, in order: WhatIDo, Work, Process, Stack, Contact
  components/       Layout, navigation, section primitives
  pages/            Home, CaseStudy, Writing, Note, NotFound
  styles/tokens.css OKLCH palette for both themes
docs/               The rebuild plans and the content confirmation checklist
```

## Adding a case study

1. Create `src/content/case-studies/<slug>.ts` exporting
   `parseCaseStudy({ ... })`.
2. Register it in `src/content/case-studies/index.ts`. Order there is
   editorial — the first entry is the one most readers see.
3. Add its URL to `public/sitemap.xml`.
4. `bun run verify`. The schema will tell you what the entry is missing.

## Licence

Content and design are personal. The code is here to be read.
