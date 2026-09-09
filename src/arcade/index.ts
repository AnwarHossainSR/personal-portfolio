import "@/arcade/arcade.css";
import { Game } from "@/arcade/engine";

/**
 * The only surface the application touches.
 *
 * Two functions, both idempotent. Everything behind them is vanilla DOM — no
 * React, no router — because the game has to survive a route change, a
 * re-render, and being switched off mid-firefight, and the cleanest way to
 * guarantee that is to make React's only responsibility calling `stop()`.
 *
 * This module is reached exclusively through `await import("@/arcade")` in
 * ArcadeMount.tsx. A static import anywhere would pull ~25 kB of engine into
 * the main chunk for every reader, including the ones who never turn it on;
 * src/arcade/budget.test.ts asserts that has not happened.
 */

let game: Game | null = null;

/**
 * The gate, copied from the reference and deliberately not softened.
 *
 * `prefers-reduced-motion` is a request, not a hint. A non-fine pointer means
 * either a touch device — where there is no aim, no WASD, and the camera
 * fights the scroll — or an environment with no pointer at all, which is what
 * jsdom reports. The test stub in src/test/setup.ts answers `false` to every
 * media query, so this one check is also what keeps the game out of the test
 * suite; see src/arcade/lifecycle.test.ts.
 */
export function canRun(): boolean {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return false;
	}
	return window.matchMedia("(pointer: fine)").matches;
}

export function isRunning(): boolean {
	return game !== null;
}

export function start(): void {
	if (game || !canRun()) return;
	const root = document.createElement("div");
	root.id = "arcade-root";
	// The overlay is not content. Nothing it injects may reach a screen reader,
	// and the axe suite in src/test/a11y.test.tsx holds that.
	root.setAttribute("aria-hidden", "true");
	document.body.appendChild(root);
	document.documentElement.classList.add("arcade-no-select");
	game = new Game(root);
	game.start();
}

/**
 * Stops the game and restores the page — every destroyed glyph, every hidden
 * element, every listener, the scroll behaviour, and the root itself. See
 * undo.ts for why restoration is not optional in a single-page app.
 */
export function stop(): void {
	const current = game;
	game = null;
	current?.stop();
}
