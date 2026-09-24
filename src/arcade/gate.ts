/**
 * The one check that decides whether the overlay may exist, in its own module
 * so the components can ask without importing the engine.
 *
 * ArcadeMount and the footer control both need this answer at render time. If
 * they imported it from index.ts they would pull the whole engine — and its
 * stylesheet — into the main bundle, which is exactly what the dynamic import
 * exists to avoid. src/arcade/budget.test.ts holds that line.
 */

/**
 * Copied from the reference and deliberately not softened.
 *
 * `prefers-reduced-motion` is a request, not a hint. A non-fine pointer means
 * either a touch device — where there is no aim, no WASD, and the camera
 * fights the scroll — or an environment with no pointer at all, which is what
 * jsdom reports. The stub in src/test/setup.ts answers `false` to every media
 * query, so this check is also what keeps a 2,000-line game engine out of
 * every other test in the suite.
 */
export function canRunArcade(): boolean {
	if (typeof window === "undefined" || !window.matchMedia) return false;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return false;
	}
	return window.matchMedia("(pointer: fine)").matches;
}
