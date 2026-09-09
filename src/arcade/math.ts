/**
 * Scalar helpers shared by every arcade module. Split out of world.ts because
 * none of them touch the DOM — the plan's file list folded them into the world
 * module, which would have made the one pure file in the engine impure.
 */
export const TAU = Math.PI * 2;

export const rand = (a: number, b: number): number =>
	a + Math.random() * (b - a);

export const clamp = (v: number, a: number, b: number): number =>
	Math.max(a, Math.min(b, v));

/** Signed shortest angle from `a` to `b`, in (-π, π]. */
export function angDiff(a: number, b: number): number {
	let d = (b - a) % TAU;
	if (d > Math.PI) d -= TAU;
	if (d < -Math.PI) d += TAU;
	return d;
}

/**
 * Alpha channel of a computed colour string. Anything the browser did not
 * resolve to rgb()/rgba() — `transparent`, `none`, a colour keyword — is
 * treated as fully opaque, which is the conservative answer for a collision
 * test: an element wrongly called solid costs a bullet, an element wrongly
 * called empty lets bullets through walls.
 */
export function alpha(colour: string | null | undefined): number {
	if (!colour || colour === "transparent" || colour === "none") return 0;
	const match = colour.match(/rgba?\(([^)]+)\)/);
	if (!match) return 1;
	const parts = match[1].split(",");
	return Number(parts.length > 3 ? parts[3] : 1);
}
