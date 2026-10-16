/**
 * Input and camera rules that do not need the engine to answer, kept apart so
 * they can be tested without a layout engine.
 */

export type MoveKey = "w" | "a" | "s" | "d";

/*
 * Arrow keys fly the rocket as well as WASD. Most people reach for the arrows
 * first, and an overlay that ignores the keys you tried reads as broken rather
 * than as having different controls.
 */
const ALIASES: Record<string, MoveKey> = {
	arrowup: "w",
	arrowleft: "a",
	arrowdown: "s",
	arrowright: "d",
};

/** The movement a key means, or null when it is not a movement key. */
export function movementKey(key: string): MoveKey | null {
	const k = key.toLowerCase();
	if (k in ALIASES) return ALIASES[k];
	return k === "w" || k === "a" || k === "s" || k === "d" ? k : null;
}

/** How far past the top or bottom of the viewport the rocket may drift. */
export const LEFT_BEHIND_MARGIN = 48;

/**
 * Whether the rocket has been left behind by the reader. The camera only
 * follows the rocket, never the other way round, so anyone who scrolls with
 * the wheel, the trackpad or the scrollbar leaves it at its old position in
 * the document — four thousand pixels above the screen, by the time they are
 * reading the contact section. From there the game looks dead.
 */
export function leftBehind(screenY: number, viewportHeight: number): boolean {
	return (
		screenY < -LEFT_BEHIND_MARGIN ||
		screenY > viewportHeight + LEFT_BEHIND_MARGIN
	);
}
