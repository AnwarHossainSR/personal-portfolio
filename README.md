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
| Type | Geist, Geist Mono, Instrument Serif (Google Fonts) |
| Content | zod 4 schemas |
| Tests | Vitest, Testing Library, jsdom, axe |
| Tooling | Biome |
| Hosting | Vercel |

Design tokens are stored as bare OKLCH channels (`52% 0.17 35`) and wrapped in
`oklch(var(--token) / <alpha-value>)` by the Tailwind config. That is what makes
opacity modifiers such as `bg-paper/85` work — Tailwind cannot inject an alpha
value into a `var()` that already contains a complete `oklch()` call.

## Design

The page reads as an agent's run console. That is not decoration for its own
sake: the work it describes — take a change from a plan to production, then
keep it there — is the shape of an agent run, and the AI and MCP work is part
of what is on offer.

- **Palette.** Warm graphite neutrals (hue 70–85 at very low chroma, held there
  by `tokens.test.ts`) with two colours on top, each with one job: *ember*
  (`accent`) is the human hand — the primary action, links, emphasis; *phosphor*
  (`signal`) is the system — live status, a step that passed. Dark is the
  default; light re-resolves the same roles. Every text pair is at least 4.5:1
  against paper, surface and surface-deep in both themes.
- **Three voices.** Geist carries the structure. Geist Mono is the system
  talking — labels, paths, the trace. Instrument Serif italic is the human
  talking, and is used only where a sentence is a judgement: the creed, and
  *Keep it running.*
- **The headline is a plan.** Each sentence of the positioning line is a
  numbered step. The numbers are generated content with empty alt text, so the
  `h1`'s accessible name is still exactly `profile.positioning` — a test checks
  `textContent` for equality, not containment.
- **The trace is labelled.** The console beside the headline says on screen
  that it is an illustration, not a log, and `AgentTrace.test.tsx` fails if a
  digit ever appears in it — a duration there would be a measurement nobody
  took.
- **Decoration cannot be hit.** Every decorative layer (the dot field, halos,
  packet wires, the card spotlight) is `pointer-events: none`. The arcade finds
  walls with `elementsFromPoint`, so a hittable backdrop would be a wall the
  size of the hero; `index.css.test.ts` holds each layer to it.
- **The output, drawn.** The *Output* section shows the three things the
  work produces — a chart, a map and a broadcast graphic — rendered live from
  this site's own data: tools by the year each came into use (from the Stack
  section, with a table view), a dot-matrix map of Dhaka and the everviz
  product group in Norway with live clocks, and a 16:9 broadcast package
  (lower third, live bug, ticker) sized in container units so it scales like
  video. The land grid comes from Natural Earth via `world-atlas`, rasterised
  by `scripts/rasterize-world.py`.
- **Readable by agents.** `/llms.txt` (the llmstxt.org format) and
  `/llms-full.txt` (every case study in full) are rendered from the same
  schema-checked content by a Vite plugin during `vite build`, and served live
  by the dev server. Each case study carries its evidence level, so a model is
  told what the work does and does not claim, the same as a person is.
- **Keyboard first.** `⌘K` / `Ctrl K` opens a command palette — a native
  `<dialog>` with the ARIA combobox pattern — for every section, case study,
  link, and the theme. It is lazy, so the case-study titles it lists do not
  ride in the main chunk.

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
| `bun run typecheck` | `tsc` against the app and the Node config, one project at a time |
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
  sections/         The one page, in order: Hero (with AgentTrace), WhatIDo
                    (with McpDiagram), Showcase, Work, Process, Stack, Proof,
                    Contact
    showcase/       The chart, the map and the broadcast frame, and their data
  content/llms.ts   /llms.txt and /llms-full.txt, rendered at build time
  components/       Layout, navigation, section primitives
    command/        ⌘K palette: a tiny open/closed store, the shortcut, and
                    the dialog (lazy)
  pages/            Home, CaseStudy, Writing, Note, NotFound
  styles/tokens.css OKLCH palette for both themes
  motion/           Scroll reveal on IntersectionObserver rather than a library,
                    and the pointer-tracked card spotlight
  arcade/           The overlay engine — see below. Lazily imported, never in the
                    main chunk
docs/               The rebuild plans and the content confirmation checklist
scripts/            rasterize-world.py, which builds the map's land grid
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
toggle. A *How to play* card says the controls the moment it starts — fly
with WASD or the arrow keys, click to fire, 1–4 for guns, Esc to end — and
leaves on the first move. The choice is remembered in `localStorage` under `arcade:enabled:v1`.
`Esc` turns it off, as do the header button and the `Stop` control on the
panel. While it runs, an `Arcade stats` button sits in the bottom-right corner;
clicking it opens the telemetry panel, which also holds the sound switch
(off by default), a two-step `Clear score` control, and a note on how the thing
works.

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
| The rocket follows the reader | The camera only ever followed the rocket. Scroll with the wheel and the rocket stayed where it was — four thousand pixels above the screen by the contact section — and the game looked dead. Left behind for 350ms, it is brought back into view, with no death counted and no hull refilled (`src/arcade/controls.ts`) |
| Cards are floor | This design is built from painted cards 16px apart, and a painted box is a wall: whole sections were sealed off from a 56px rocket. `data-arcade-ground` makes a surface floor; the text on it still collides glyph by glyph and can still be shot |
| Arrow keys fly too | Most people try the arrows first. They are read as WASD, and stopped from also scrolling the page |
| The panel opens on click | Closed it is one button. A readout permanently docked over a page whose job is to be read is an obstruction, and the numbers are optional |
| Clearing the score does not reload | The reference removes the stored ciphertext and calls `location.reload()`, which an MPA can afford. A reload here would throw away the run **and** the restored page, so the engine zeroes its counters in place and the telemetry sweep picks them up on the next frame |

The score is sealed with a non-extractable AES-GCM key held in IndexedDB. That
stops it being edited in devtools storage. It does not stop anyone who opens the
console — the page can decrypt, so a visitor can too. `Clear score` in the panel
drops the stored value and zeroes the live counters; the key itself is left
alone, being per-browser rather than per-score.

## Credit

The arcade overlay comes from
[entrptaher/taherxyz](https://github.com/entrptaher/taherxyz): `src/arcade/` is
a port of its `MouseCar.astro`, with the deviations listed above. The enemy
stat blocks and the ballistics constants are that project's, unchanged. The
previous visual system was also taken from that site; the current one,
described under *Design*, replaced it.

## Adding a case study

1. Create `src/content/case-studies/<slug>.ts` exporting
   `parseCaseStudy({ ... })`.
2. Register it in `src/content/case-studies/index.ts`. Order there is
   editorial — the first entry is the one most readers see.
3. Add its URL to `public/sitemap.xml`.
4. `bun run verify`. The schema will tell you what the entry is missing.

## Licence

Content and design are personal. The code is here to be read.
