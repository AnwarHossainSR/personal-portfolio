# Arcade Overlay and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the two things `entrptaher/taherxyz` does that this site does not — a playable arcade overlay that treats the real page as its level geometry, and a motion layer that makes sections arrive rather than appear — into this portfolio, on this stack, without spending the evidence discipline or the performance budget the rebuild bought.

**Architecture:** The reference is an Astro MPA; this is a Vite + React Router SPA. That difference is the whole engineering problem and most of this plan. The game itself is framework-agnostic vanilla DOM code and ports almost verbatim; what does not port is *when it starts, when it stops, and what happens on a route change*. So the engine lands as a plain TypeScript module with an explicit `start()`/`stop()` contract, mounted by one thin React component, code-split so it never enters the main bundle.

**Tech Stack:** Unchanged — React 19, TypeScript 5.8, Vite 7, React Router 7, Tailwind 3.4, zod 4, Vitest, Biome, Bun. **No new runtime dependencies.** Specifically not `framer-motion`; see Task 1.

---

## What the reference actually contains

Cloned from `github.com/entrptaher/taherxyz`, depth 1, September 2026. The whole site is 17 files. Three of them matter here.

### `src/components/MouseCar.astro` — 1,908 lines

Not an animation. A complete twin-stick arcade shooter that uses the live DOM as its collision world. Inventory of what is in there:

| System | Implementation |
| --- | --- |
| **Player** | Rocket, WASD thrust + mouse aim, momentum with drag, `heading()` decoupled from sprite angle |
| **Level geometry** | `solid(el)` classifies any DOM element as an obstacle by *computed style* — background alpha > 0.06, background image, box shadow, or a visible border. Images, canvases, inputs are always solid |
| **Text as terrain** | `textRect()` + `glyphAt()` walk text nodes with `Range` to get per-character rects. Bullets destroy individual glyphs (`destroyChar`) and whole elements (`destroyElement`) |
| **Camera** | `scrollWithRocket()` — the page scrolls to follow the rocket, with acceleration and a max rate |
| **Enemies** | Three levels, each a full stat block: health, radius, speed, acceleration, turn rate, fire range, fire delay, spread, projectile speed, multi-shot `fireOffsets` |
| **Enemy AI** | `steerAround()` — samples 8 headings, scores them against obstacle rects, steers toward the player around blockers. Not a straight-line chase |
| **Ballistics** | `bulletPath()`, `segmentsWithinDistance()`, `pointSegmentDistanceSquared()` — swept-segment collision, so bullets cannot tunnel through thin elements at high speed. Player and enemy bullets shoot each other down (`resolveBulletCollisions`) |
| **Guns** | Four modes on keys 1–4: `normal`, `character`, `tetris`, `curve` (homing, `CURVE_HOMING_TURN_RATE`). Mode persisted to `localStorage` |
| **Pickups** | Score orbs that relocate if ignored; gun powerups with a timed damage multiplier |
| **Feel** | Particle explosions, muzzle flash, spawn-protection strobe, revive animation, WebAudio (`brrr()`, `modeSound()`) |
| **Persistence** | Scores sealed with a WebCrypto key held in **IndexedDB**, ciphertext base64'd into `localStorage`. Debounced writes through a promise chain |
| **Debug** | Hold `V` to render every collision rect onto a full-screen canvas |
| **Gate** | `if (reduced.matches || !fine.matches) return` — off entirely under `prefers-reduced-motion` and on any non-fine pointer |

Roughly 60 kB of raw source. It is the most substantial thing in that repository by an order of magnitude.

### `src/islands/Reveal.tsx` — 28 lines

A `framer-motion` wrapper: `opacity 0 → 1`, `y 26 → 0`, `blur(5px) → none`, 0.6s on `[0.16, 1, 0.3, 1]`, `viewport={{ once: true, margin: '-64px' }}`, staggered by a `delay` prop. Returns children unwrapped when `useReducedMotion()` is true. Used in Solutions, Experience, Process and Newsletter, always `client:visible`.

### `src/styles/global.css` — the hero entrance

Above the fold does **not** use framer-motion. It uses a plain `@keyframes rise` (same values as `Reveal`) with four delay classes, so the first paint costs zero JavaScript. That is a deliberate choice and worth copying exactly.

### `src/islands/ExtractionPanel.tsx` — 128 lines

The score readout, dressed as a scraper telemetry table — selectors down the left, live counts down the middle. The game writes into it by `id` (`mc-s-broken`, `mc-enemy-level-2-current`, …); React never re-renders it. Carries `data-mc-keep` so its own bullets cannot destroy it. This is the joke that makes the whole thing work: the game's score panel is themed as the product the site is selling.

---

## The decision this plan encodes, and its cost

You asked for this functionality with your own content, which is the right instinct — the game is the strongest signal on that site, and it is not decoration. It is DOM measurement, swept-segment collision, steering behaviour, WebAudio and a WebCrypto/IndexedDB persistence layer, all shipped and working. A hiring manager who opens devtools finds more engineering in the overlay than in most portfolios' actual projects.

**The cost is that this site's thesis is different from that site's.** taher.xyz sells scraping services; a destructible page is on-message. This site says *"Software gets judged in production, not in review"* and enforces it with a schema that rejects a number without a method. An arcade shooter that dismantles your case study headings is a tonal argument against your own copy — and the reader who most needs to take you seriously is the one most likely to be mid-sentence when a rocket eats the sentence.

Two things resolve it, and both are in this plan rather than optional:

1. **Task 9 makes it opt-in and reversible.** The reference is always-on. Here it starts parked behind a discoverable control, and there is always a way out that restores the page without a reload.
2. **Task 11 gives it a reason to exist on this site.** The telemetry panel is not a score table; it is framed as what it actually is — a note about the overlay, what it does technically, and a link to the source. The game becomes an artifact you can click into rather than a gimmick you have to explain away.

If you disagree with either, Task 9 is the single place to say so and nothing before it depends on the answer.

---

## Global Constraints

Every task's requirements implicitly include this section.

- **Package manager is Bun.** `bun add`, never npm or yarn.
- **No new runtime dependencies.** If a task appears to need one, stop and report rather than adding it.
- **Formatting is Biome:** tabs, double quotes, semicolons. Lint **scoped to touched files** — `bunx biome check --write <paths>`. `bun run lint` is repo-wide and rewrites files you did not touch.
- **Commit messages: exactly one line.** `feat: short thing done`. No body, no `Co-Authored-By`, no footers.
- **Path alias `@/` → `src/`.** Never `../../`.
- **Both themes must work.** Every colour is defined in `:root, .dark` *and* `.light` in `src/styles/tokens.css`. A colour that exists in only one block is a bug, and the game runs over both grounds.
- **The suite stays green.** 96 tests pass at the start of this plan. The count must not silently drop.
- **The game may never run in tests.** `src/test/setup.ts` stubs `matchMedia` to return `matches: false` for every query, so the reference's own gate (`!fine.matches → return`) already keeps it inert. Do not weaken that gate. Task 10 adds a test that proves it.
- **The game may never enter the main bundle.** It is `import()`-ed lazily. Task 10 asserts the main chunk did not grow.
- **The content schema is untouchable.** `src/content/schema.ts` and `src/content/guards.ts` do not change.
- **Nothing the game injects is in the accessibility tree.** `aria-hidden="true"` on the root, and the axe tests in `src/test/a11y.test.tsx` must still pass.

---

## File structure this plan creates

```
src/
  motion/
    Reveal.tsx              Scroll-reveal wrapper — IntersectionObserver, no dependency
    useReducedMotion.ts     Shared media-query hook
  arcade/
    index.ts                start()/stop() — the only export the app touches
    engine.ts               Loop, state machine, player, camera
    world.ts                DOM to collision geometry: solid(), textRect(), glyphAt(), probe()
    bullets.ts              Ballistics, swept collision, gun modes
    enemies.ts              Stat blocks, spawning, steerAround()
    effects.ts              Particles, explosions, muzzle flash
    audio.ts                WebAudio, lazily constructed on first shot
    score.ts                WebCrypto + IndexedDB sealed score
    telemetry.ts            Writes counts into the panel's DOM ids
    sprites.ts              Inline SVG markup for rocket, enemies, orbs
    arcade.css              Everything visual the engine needs
  components/
    ArcadeMount.tsx         The one React component: lazy import, lifecycle, off switch
    ArcadePanel.tsx         Static telemetry panel the engine writes into
```

---

## Task 1: Motion primitives, without framer-motion

**The decision, stated once:** the reference uses `framer-motion` for `Reveal`. This site does not get to. Current bundle is **126 kB gzip total** against a 120 kB target that has already been missed; `framer-motion` adds roughly 30 kB gzip for one effect that `IntersectionObserver` plus a CSS transition does identically. This site already runs an `IntersectionObserver` in `AnchorNav.tsx`, so the pattern is established rather than new.

If you later want spring physics or layout animation, that is the moment to reconsider — not now, for a fade and a translate.

### Requirements

- [ ] Create `src/motion/useReducedMotion.ts` — a hook over `matchMedia('(prefers-reduced-motion: reduce)')` that subscribes to changes, not just the initial value, and returns `false` when `matchMedia` is absent.
- [ ] Create `src/motion/Reveal.tsx`:
  - Props: `children`, `delay?: number` (seconds), `className?: string`, `as?: ElementType` (default `div`).
  - Observes itself with `IntersectionObserver`, `rootMargin: "0px 0px -64px 0px"`, unobserves after the first intersection — matching the reference's `once: true`.
  - Hidden state: `opacity: 0; transform: translateY(26px); filter: blur(5px)`. Revealed: all three cleared. Transition `0.6s cubic-bezier(0.16, 1, 0.3, 1)`, `transition-delay` from `delay`.
  - When `useReducedMotion()` is true, or `IntersectionObserver` is unavailable, render children with **no wrapper styles at all** and no observer.
- [ ] Add the hero entrance to `src/index.css` as pure CSS, copying the reference's values verbatim: `@keyframes rise` (`opacity 0→1`, `translateY(22px)→none`, `blur(6px)→none`), `.hero-rise { animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }` and `.hero-rise-1..4` at `0.05s / 0.15s / 0.25s / 0.35s`. Zero JS above the fold is the point.
- [ ] Add `@media (prefers-reduced-motion: reduce) { .hero-rise { animation: none; } }`.
- [ ] Apply `.hero-rise` classes to the hero in `src/sections/` — heading, pitch, links, meta row, in that stagger order.
- [ ] Wrap the repeating blocks in `Work`, `Process` and `Stack` in `<Reveal delay={index * 0.08}>`.

### Do not

- Wrap `Section` itself. Revealing the section heading and its body separately is what produces the staggered feel; revealing the whole section as one block just makes it fade.
- Animate anything on the case-study detail pages. They are reading surfaces.

### Verification

- [ ] `bun run test` — 96 tests still pass.
- [ ] New test `src/motion/Reveal.test.tsx`: renders children when the observer never fires (content must never be trapped behind an unfired observer); renders children unwrapped when reduced motion is on.
- [ ] `bun run build` — main chunk gzip has not grown by more than 1 kB.

---

## Task 2: Arcade palette tokens

The engine reads colours from CSS custom properties so it inherits the theme instead of hard-coding hex. The reference uses `--color-accent` and `--color-accent-deep`; this site has the first and not the second.

### Requirements

- [ ] Add to **both** blocks in `src/styles/tokens.css`, as bare OKLCH channels matching the existing convention:
  - `--color-accent-deep` — light: `44% 0.16 32`; dark: `58% 0.14 32`.
  - `--color-arcade-enemy` — a cool neutral that reads as "not yours" against a warm page. Light: `38% 0.02 260`; dark: `72% 0.02 260`.
  - `--color-arcade-danger` — the hit and explosion colour, hotter than accent. Light: `58% 0.19 28`; dark: `68% 0.19 28`.
- [ ] Add `"accent-deep"` and the two arcade colours to `tailwind.config.ts` in the same `oklch(var(--token) / <alpha-value>)` form. The panel in Task 11 needs them as utilities.
- [ ] Extend `src/styles/tokens.test.ts`: every `--color-*` defined in `:root, .dark` also exists in `.light`, and vice versa. Write it as a parse of the file, so it catches the next token too, not just these three.

### Verification

- [ ] `bun run test` — the new token test fails if you delete one of the three from either block. Prove it by deleting one, running, and restoring.
- [ ] Build the CSS and confirm `bg-accent-deep/50` emits a real `oklch(... / 0.5)` — the `<alpha-value>` trap from the redesign is still live and still silent when you get it wrong.

---

## Task 3: The world module — DOM as collision geometry

This is the part worth understanding before writing it, and the part that will be slow if you do not.

### Requirements

- [ ] Create `src/arcade/world.ts` porting, with types:
  - `solid(el: Element): boolean` — the computed-style classifier. Elements inside the arcade root are never solid. `alpha()` parses `rgb()`/`rgba()` strings; the 0.06 threshold is deliberate, keep it.
  - `textRect(el: Element): DOMRect | null` — null for hidden, zero-size, or non-text elements. `TEXT_TAGS` copied verbatim.
  - `glyphAt(px, py, cell?)` — per-character hit test via `Range`. Returns the glyph rect and its text node offset.
  - `probe(px, py, out)` — `elementsFromPoint` narrowed to solid elements.
  - `circleRect(cx, cy, cr, rect)` — circle/AABB overlap.
  - `blockingRect(px, py)` and `blockingWorldRect(px, py)` — viewport vs document coordinates. Confusing these two is the single most common bug in this port; name them exactly this and never mix them in one function.
- [ ] Port the obstacle cache: `Map` keyed by element, invalidated when `window.scrollY` moves. `getBoundingClientRect()` per element per frame is a layout thrash that will drop frames on the case-study pages.
- [ ] Everything in this module is pure with respect to the game — it reads the DOM and returns geometry. No mutation here. Destruction lives in Task 5.

### Verification

- [ ] New `src/arcade/world.test.ts` running in jsdom against fixture DOM: `solid()` returns true for an element with a background colour and false for a bare `<span>`; `circleRect()` boundary cases; `blockingRect` vs `blockingWorldRect` differ by exactly `window.scrollY`.
- [ ] jsdom returns zero-size rects for everything, so assert on the *classification* logic, not on measured geometry. Do not fake `getBoundingClientRect` globally; pass rects in.

---

## Task 4: Engine core — loop, player, camera, lifecycle

### Requirements

- [ ] Create `src/arcade/engine.ts` with a state machine: `parked → drive → blasted → drive`.
- [ ] Port `moveRocket()` (WASD thrust, drag, `turnRate`), `heading()`, `bounceEdges()`, `collide()` with `bounceX`/`bounceY`, `scrollWithRocket()` with `CAMERA_ACCEL` / `CAMERA_MAX`, `spawn()`, `clearSpot()`, `spotClear()`, `safePointAround()`, `startSpawnProtection()`, `revive()`, `blast()`, `respawn()`.
- [ ] Port the `NaN` guard in the loop verbatim. `car.x` going non-finite is reachable and the reference handles it by relocating rather than crashing.
- [ ] **The part that is not a port:** `src/arcade/index.ts` exports exactly two functions.
  - `start(): void` — idempotent. Creates the root, binds listeners, starts the RAF loop.
  - `stop(): void` — cancels the RAF handle, removes **every** listener (`document` mousemove/pointermove/pointerdown/pointerup/pointercancel/keydown/keyup, `window` blur, `documentElement` mouseleave), removes the root element, removes the `no-select` class from `<html>`, and **restores every glyph and element the game destroyed**.
  - Restoration is not optional and not a nice-to-have. In an MPA a destroyed heading comes back on the next page load. In this SPA, a React re-render will not resurrect a text node the game deleted out from under it, and a user who turns the game off must not be left with a broken page. Keep an undo log: for each destruction, the parent node, the original text content, and the next sibling. `stop()` replays it in reverse.
- [ ] The gate stays exactly as the reference wrote it — `prefers-reduced-motion: reduce` or `!(pointer: fine)` means `start()` returns without doing anything.

### Verification

- [ ] `src/arcade/lifecycle.test.ts`: `start()` under the stubbed `matchMedia` (all queries false) creates no DOM and binds no listeners.
- [ ] `start(); stop();` with the gate forced open leaves `document.body.innerHTML` byte-identical to before, and `document.documentElement.className` unchanged.
- [ ] Destruction and restoration round-trip: destroy a glyph in a fixture, `stop()`, assert the text content is back.

---

## Task 5: Bullets, gun modes and destruction

### Requirements

- [ ] Create `src/arcade/bullets.ts`. Port `spawnBullet`, `fireShot`, `updateFire`, `updateBullets`, `probeHit`, `bounceBullet`, `bulletPath`, `pointSegmentDistanceSquared`, `segmentsWithinDistance`, `resolveBulletCollisions`, `lineClear`, `bulletHitsObstacle`.
- [ ] Keep the swept-segment collision. A 1650 px/s bullet moves about 27 px per frame at 60 Hz and will tunnel straight through a hairline rule with point collision. This is why the reference does it this way.
- [ ] Keep `MAX_PLAYER_BULLETS`, `BULLET_COLLISION_STEP` and `MAX_BULLET_PROBES_PER_FRAME`. They are the frame-budget guard, not tuning knobs.
- [ ] Port the four gun modes and their `localStorage` persistence, under a namespaced key: `arcade:gun-mode:v1`.
- [ ] Port `destroyChar()` and `destroyElement()` — **and register every destruction in the undo log from Task 4 before performing it**.
- [ ] Never destroy: anything matching `a, button, input, textarea, select, label, [contenteditable], [data-arcade-keep]`, anything inside `nav`, the skip link, or the arcade panel. The reference guards the pointer-down path this way; apply the same guard to bullet impacts, which it does not.

### Verification

- [ ] `src/arcade/bullets.test.ts`: `segmentsWithinDistance` returns true for crossing segments and false for parallel ones at distance; a fast bullet spanning an obstacle registers a hit (the tunnelling case).
- [ ] Manual, in the browser: fire at a nav link and confirm it survives; fire at a paragraph and confirm the glyph goes.

---

## Task 6: Enemies and steering AI

### Requirements

- [ ] Create `src/arcade/enemies.ts`. Copy the three `ENEMY_LEVELS` stat blocks **verbatim** — they are tuned, and re-deriving them produces a game that feels wrong in ways that are expensive to diagnose.
- [ ] Port `spawnEnemy`, `moveEnemy`, `updateEnemies`, `steerAround`, `nearestEnemy`, `enemyVisible`, `enemyCount`, `enemyMaxAlive`, `enemyMaxSpeed`, `fireEnemyBullet`, `fireEnemyVolley`, `updateEnemyBullets`, `damageEnemy`, `defeatEnemy`, `registerEnemyDefeat`, `damagePlayer`, `crushCar`.
- [ ] Port the escalating spawn loop: `interval = max(2800, 8200 - elapsed * 35)`.
- [ ] `steerAround()` is the interesting one — 8 candidate headings scored against obstacle rects, best one taken, turn rate clamped. Keep the sample count and the scoring; it is what makes enemies path around your headings instead of grinding into them.
- [ ] Skip `recordEnemyShortcut()` — the `m`/`b` key sequence that force-spawns higher-level enemies. It is a debug affordance, and an unlabelled key handler on a portfolio is a support burden.

### Verification

- [ ] `src/arcade/enemies.test.ts`: `enemyMaxSpeed` scales with level and elapsed time; `steerAround` given a blocker directly ahead returns a heading that is not straight ahead.
- [ ] Manual: enemies route around a case-study card rather than pressing into it.

---

## Task 7: Effects, audio and feel

### Requirements

- [ ] Create `src/arcade/effects.ts` — `makePart`, `addPart`, `updateParts`, `boomAt`, muzzle flash, `MAX_PARTS` cap.
- [ ] Create `src/arcade/sprites.ts` — the rocket, enemy and orb SVG as template strings, with `fill` bound to the CSS custom properties from Task 2 so both themes work without a second sprite set.
- [ ] Create `src/arcade/audio.ts` — port `brrr()` and `modeSound()`.
  - **Construct the `AudioContext` on the first shot, never at module load.** A portfolio that creates an audio context on page load is a Lighthouse finding and, in some browsers, a console warning on every visit.
  - Add a mute control persisted to `localStorage` under `arcade:muted:v1`, defaulting to **muted**. Unprompted audio on a portfolio is worse than no audio. The reference does not do this; it is a correct deviation.
- [ ] Port the game CSS from the reference's stylesheet — `mc-revive`, `mc-flash`, `mc-muzzle`, `mc-boom`, `mc-respawn`, `mc-spawn-protected`, `mc-gun-powerup` — into `src/arcade/arcade.css`, renaming the prefix to `arcade-`. Import it from `src/arcade/index.ts` so Vite splits it with the chunk rather than inlining it into the main stylesheet.
- [ ] Port score orbs (`spawnScoreBall`, `relocateScoreBall`, `updateScoreBall`, `findScoreSpot`) and gun powerups (`spawnGunPowerup`, `updateGunPowerup`, `findPowerupSpot`).

### Verification

- [ ] `bun run build` — the arcade CSS is in its own chunk, not in `assets/index-*.css`. Check the emitted file list.
- [ ] Manual, both themes: sprites and explosion colours read correctly on paper and on the dark ground.
- [ ] No `AudioContext` in the console until the first shot is fired.

---

## Task 8: Sealed score persistence

### Requirements

- [ ] Create `src/arcade/score.ts`. Port `openScoreDb`, `getScoreKey`, `bytesToBase64`, `base64ToBytes`, `queueScoreSave`, `loadSavedScore`, under namespaced keys: `arcade:sealed-score:v1`, DB `arcade-score-v1`.
- [ ] Keep the debounced promise chain. Writing on every kill is an IndexedDB transaction per frame in a firefight.
- [ ] Every WebCrypto and IndexedDB call is wrapped so a failure degrades to an in-memory score. Private browsing, disabled storage and Safari's ITP all break this path, and none of them may break the page.
- [ ] Be accurate about what this is when you document it in Task 12: sealing the score stops casual `localStorage` editing, and does not stop anyone who opens the console. Say so. Overclaiming the crypto on a site whose entire premise is evidence discipline would be the worst possible own goal.

### Verification

- [ ] `src/arcade/score.test.ts`: with `crypto.subtle` deleted, saving and loading still work and never throw.
- [ ] Round-trip: seal a stats object, unseal it, deep-equal.

---

## Task 9: The off switch — decision point

**This is the load-bearing task. Nothing before it depends on the answer; everything after it does.**

The reference runs the game unconditionally on every visit for every fine-pointer user. Three options:

| | Behaviour | Argument |
| --- | --- | --- |
| **A. Opt-in** *(recommended)* | Page loads normally. A control in the footer — `arcade mode` — starts it. Choice remembered. | The reader who needs to take the case studies seriously gets an undisturbed page. The reader who is curious gets the whole thing. Nothing is hidden; the control is visible, not a konami code. |
| **B. Always on, like the reference** | Starts on load for fine pointers, off switch in the panel. | Maximum impact, matches the reference exactly, and is the version that made you want this. Costs you the first impression of every recruiter who scrolls before they read. |
| **C. Konami code** | Hidden until a key sequence. | The worst of both: nobody finds it, so you built 2,500 lines for an audience of one. |

Take **A** unless you say otherwise. It keeps everything you liked and loses only the ambush.

### Requirements

- [ ] Create `src/components/ArcadeMount.tsx`:
  - Reads `arcade:enabled:v1` from `localStorage` (default per the option chosen).
  - When enabled: `const { start, stop } = await import("@/arcade")` inside an effect, then `start()`. The dynamic import is what keeps the engine out of the main chunk.
  - Returns `stop()` from the effect's cleanup, so a route change or an unmount tears it down completely.
  - Renders `null`. All game DOM is created imperatively by the engine.
  - Guarded by the same media queries as the engine, so the control does not appear at all where the game cannot run.
- [ ] Mount it once in `src/components/Layout.tsx`, **outside** `<main>`, so it is a sibling of the routed content and does not remount on navigation.
- [ ] Add the control to `src/components/Footer.tsx`, in the site's existing register — mono, uppercase, `tracking-[0.14em]`, `text-muted`. Label it plainly: `Arcade mode: on / off`, not an emoji.
- [ ] Pressing `Escape` stops the game and restores the page. Wire it through the same `stop()`.

### Verification

- [ ] `src/components/ArcadeMount.test.tsx`: renders `null`; imports nothing when the media gate is closed (assert the dynamic import was never called — spy on it).
- [ ] Manual: toggle off mid-game with destroyed text on screen, confirm the page is fully restored without a reload. Then navigate to a case study and back and confirm no double-mount.

---

## Task 10: Budget and safety guards

### Requirements

- [ ] Add `src/arcade/budget.test.ts` — an assertion over the built output, not a lint rule: the main entry chunk must not import anything from `src/arcade/`. Read `dist/` after a build, or assert on the module graph. A guard that can be defeated by a stray static import is not a guard.
- [ ] Extend `src/test/a11y.test.tsx` with a case that mounts `ArcadeMount` alongside the page and asserts zero new axe violations.
- [ ] Assert the arcade root carries `aria-hidden="true"` and `pointer-events: none` on its non-interactive layers.
- [ ] Record the bundle numbers before and after in the task report. The main chunk is **113.27 kB gzip** at the start of this plan; if it moves at all, the lazy import is not working.
- [ ] Confirm the game does not fight the site's own `IntersectionObserver` in `AnchorNav` — the camera scrolls the page, which will retrigger active-section tracking. Either is fine; a flickering nav is not. Fix by damping, not by disabling the nav.

### Verification

- [ ] `bun run verify` clean.
- [ ] Lighthouse on `/` with the game off: no regression against the current score.

---

## Task 11: The panel, and giving it a reason to exist

The reference's panel is a joke about scraping. Yours cannot be that joke. It should be the thing that converts the overlay from a gimmick into an artifact.

### Requirements

- [ ] Create `src/components/ArcadePanel.tsx` — static markup with stable ids the engine writes into. **Never re-rendered by React**; `telemetry.ts` mutates `textContent` directly. Carries `data-arcade-keep`.
- [ ] Rows: shots, glyphs destroyed, enemies by level (current / session / all-time), hull, gun mode, and the controls line — `WASD · click to fire · 1-4 guns · V boundaries · Esc to stop`.
- [ ] Render it only while the game is running, in the footer area — not in the hero. The hero's job is the positioning line.
- [ ] Write a short note next to it, in the site's voice, saying what the overlay is: that it reads the page's own elements as collision geometry from computed style, that bullets use swept-segment collision so they cannot tunnel, that enemies steer around obstacles rather than chase in straight lines, and that the score is sealed but not secure. Two or three sentences. No adjectives.
- [ ] Link to the source directory on GitHub. The code is the evidence; a claim about it is not.

### Do not

- Put a number in that note that is not measured. The site's whole schema exists to stop exactly that, and the arcade panel is outside the schema — which makes it the easiest place in the codebase to break your own rule without a test catching it.

### Verification

- [ ] `src/components/ArcadePanel.test.tsx`: every id the engine writes to exists in the rendered markup. Import the id list from `telemetry.ts` so the two cannot drift.
- [ ] Panel is legible in both themes.

---

## Task 12: Documentation and content confirmation

### Requirements

- [ ] `README.md` — a section on the arcade overlay: what it is, where it lives, how it is gated, why it is lazy-loaded, and how to turn it off. It is now the most interesting code in the repository and the README currently says nothing about it.
- [ ] `docs/CONTENT-CONFIRMATION.md` — a new section for anything the panel note claims about the overlay, held to the same standard as every other claim on the site.
- [ ] Credit `github.com/entrptaher/taherxyz` in the README, plainly, as the origin of the design language and of this mechanic. The visual system was already taken from that site; this takes the idea behind its best feature. Saying so costs nothing and not saying so is the kind of thing that gets noticed.

### Verification

- [ ] `bun run verify` clean.
- [ ] Fresh read of the README by someone who has not seen the site: can they turn the game on, and off, from the README alone?

---

## Appendix: what is deliberately not copied

- **`framer-motion`** — 30 kB gzip for one fade. Task 1.
- **`recordEnemyShortcut`** (`m`/`b` force-spawn) — undocumented key handler. Task 6.
- **Audio on by default** — starts muted here. Task 7.
- **Always-on** — opt-in here, pending Task 9.
- **Astro islands** — this is an SPA; the equivalent is one lazily imported module with a lifecycle contract. Task 4.

## Appendix: sequencing

```
Task 1 (motion)     ─┐
Task 2 (tokens)     ─┴─ independent, parallel

Task 3 (world)         needs Task 2
Task 4 (engine)        needs Task 3

Task 5 (bullets)     ─┐
Task 6 (enemies)     ─┼─ all need Task 4; parallel with each other
Task 7 (effects)     ─┤
Task 8 (score)       ─┘

Task 9 (off switch)    needs Tasks 4-8. DECISION POINT
Task 10 (guards)       needs Task 9
Task 11 (panel)        needs Tasks 8, 9
Task 12 (docs)         last
```

Realistic size: Tasks 3–8 are roughly 2,000–2,500 lines of new TypeScript. Tasks 1, 2, 9–12 are small. Do not start Task 3 expecting it to be quick.
