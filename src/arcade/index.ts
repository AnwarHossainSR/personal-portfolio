import "@/arcade/arcade.css";
import { Game } from "@/arcade/engine";
import { canRunArcade } from "@/arcade/gate";

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
 * Re-exported from gate.ts, which the React components import directly. It
 * lives there rather than here so asking "can this run?" does not drag the
 * engine into the main bundle.
 */
export { canRunArcade as canRun } from "@/arcade/gate";

export function isRunning(): boolean {
	return game !== null;
}

export function start(): void {
	if (game || !canRunArcade()) return;
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
