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
  motion/           Scroll reveal, on IntersectionObserver rather than a library
  arcade/           The overlay engine — see below. Lazily imported, never in the
                    main chunk
docs/               The rebuild plans and the content confirmation checklist
```

## The arcade overlay

`src/arcade/` is a twin-stick shooter that uses this page as its level, ported
from [entrptaher/taherxyz](https://github.com/entrptaher/taherxyz) — see
*Credit* below. It is the most substantial code in the repository, so it is
worth saying what it is and how it is contained.

**What it does.** It classifies every element on the page as an obstacle from
computed style — background alpha above 0.06, a background image, a box shadow,
a visible border — and walks text nodes with a `Range` to get per-character
rectangles. The collision world is the layout itself. Bullets sweep the segment
they travelled each frame rather than testing where they landed, so they cannot
pass through a hairline rule at 1650 px/s. Enemies sample eight headings and
steer around obstacles instead of chasing in a straight line. Hold `V` to draw
the collision world onto a canvas, from the same classifier the engine collides
against.

**How to turn it on.** The `Arcade` button in the header, next to the theme
toggle. The choice is remembered in `localStorage` under `arcade:enabled:v1`.
`Esc` turns it off, as do the header button and the `Stop` control on the
panel. While it runs, an `Arcade stats` button sits in the bottom-right corner;
clicking it opens the telemetry panel, which also holds the sound switch
(off by default) and a note on how the thing works.

**How it is gated.** `src/arcade/gate.ts` refuses to start under
`prefers-reduced-motion: reduce` or on any pointer that is not `fine`. That gate
is also why the game never runs in the test suite: `src/test/setup.ts` stubs
`matchMedia` to match nothing, and `src/arcade/lifecycle.test.ts` asserts the
consequence rather than assuming it.

**Why it is lazy.** The engine and its stylesheet are reached only through
`await import("@/arcade")` in `ArcadeMount.tsx`, and the panel only through
`lazy()`. A reader who never turns it on downloads none of it.
`src/arcade/budget.test.ts` asserts that over the module graph — three small
modules (the gate, the on/off store, the storage keys) are allowed into the main
bundle and nothing else is.

**What differs from the reference, and why.**

| | |
| --- | --- |
| `stop()` genuinely restores the page | The reference is an Astro MPA, where a destroyed heading returns on the next page load. This is a React SPA: React will not put back a text node deleted underneath it. Every destruction registers its reversal first — `src/arcade/undo.ts` |
| A border collides as a line, not a box | Every section here is a full-width block with a rule on top. Treating that as filled made the whole document solid — nowhere to spawn, and every bullet dead on leaving the barrel |
| An element the size of the viewport is ground | This site paints its paper on a wrapper `div` rather than on `body` |
| Off by default | The reference runs unconditionally. The reader who most needs to take the case studies seriously is the one most likely to be mid-sentence when a rocket arrives |
| Audio starts muted | Unprompted audio on a portfolio is worse than silence. The `AudioContext` is constructed on the first shot, never at load |
| No `framer-motion` | ~30 kB gzip for one fade and a translate. `src/motion/Reveal.tsx` does it with an `IntersectionObserver` |
| The site chrome is pass-through | The header is sticky, painted and viewport-wide, which made it a wall nothing could cross — enemies queued along the top edge. `<header>` and `<footer>` carry `data-arcade-keep`: not obstacles, not destructible, and bullets bounce off them |
| Enemies before the page in collision | The reference tests the page first. On a page this dense with text that means an aimed shot dies on a glyph a few pixels short of its target. Enemies are drawn on top, so they are hit first |
| Enemies arrive on four edges | The reference uses only top and bottom, which bunches every arrival into two lanes |
| It opens faster | First enemy at 2.5s rather than 12s, three concurrent rather than one. The reference starts itself on every visit and needs a grace period; this one was asked for |
| The rocket spawns in the middle of the screen | `clearSpot` throws random darts, which on a page with wide margins lands it in the gutter |
| The panel opens on click | Closed it is one button. A readout permanently docked over a page whose job is to be read is an obstruction, and the numbers are optional |

The score is sealed with a non-extractable AES-GCM key held in IndexedDB. That
stops it being edited in devtools storage. It does not stop anyone who opens the
console — the page can decrypt, so a visitor can too.

## Credit

The visual system and the arcade overlay both come from
[entrptaher/taherxyz](https://github.com/entrptaher/taherxyz). The design
language was taken from that site during the rebuild; `src/arcade/` is a port of
its `MouseCar.astro`, with the deviations listed above. The enemy stat blocks
and the ballistics constants are that project's, unchanged.

## Adding a case study

1. Create `src/content/case-studies/<slug>.ts` exporting
   `parseCaseStudy({ ... })`.
2. Register it in `src/content/case-studies/index.ts`. Order there is
   editorial — the first entry is the one most readers see.
3. Add its URL to `public/sitemap.xml`.
4. `bun run verify`. The schema will tell you what the entry is missing.

## Licence

Content and design are personal. The code is here to be read.
