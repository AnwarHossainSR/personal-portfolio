import {
	BULLET_CLASH_RADIUS,
	BULLET_COLLISION_STEP,
	BULLET_LENGTH,
	BULLET_LIFE,
	BULLET_SPEED,
	CURVE_HOMING_TURN_RATE,
	type GunMode,
	MAX_BULLET_PROBES_PER_FRAME,
	MAX_PLAYER_BULLETS,
	RESPAWN_AFTER,
	SPREAD,
	STORAGE,
} from "@/arcade/constants";
import { damageEnemy, enemyVisible, nearestEnemy } from "@/arcade/enemies";
import type { Game } from "@/arcade/engine";
import { alpha, angDiff, clamp, rand } from "@/arcade/math";
import type { Bullet } from "@/arcade/types";
import {
	CHAR_BLANK_CLASS,
	type Glyph,
	KEEP_SELECTOR,
	type Rect,
} from "@/arcade/world";

interface Hit {
	el?: Element;
	g?: Glyph;
	/** The rect that actually blocked, which for a border is the band, not the box. */
	rect?: Rect;
	key: string;
	keep: boolean;
	/** Only a filled surface can be destroyed; a rule is bounced off. */
	destructible: boolean;
}

// ------------------------------------------------------------------- geometry

export function pointSegmentDistanceSquared(
	px: number,
	py: number,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
): number {
	const dx = x1 - x0;
	const dy = y1 - y0;
	const lengthSquared = dx * dx + dy * dy;
	const t = lengthSquared
		? clamp(((px - x0) * dx + (py - y0) * dy) / lengthSquared, 0, 1)
		: 0;
	const ex = px - (x0 + dx * t);
	const ey = py - (y0 + dy * t);
	return ex * ex + ey * ey;
}

/**
 * Do two segments come within `radius` of each other?
 *
 * Segments, not points, because a bullet travels ~27 px per frame at 60 Hz.
 * Testing only the endpoints means two bullets crossing at speed pass straight
 * through each other, and a bullet crossing a 1 px rule never touches it.
 */
export function segmentsWithinDistance(
	ax: number,
	ay: number,
	bx: number,
	by: number,
	cx: number,
	cy: number,
	dx: number,
	dy: number,
	radius: number,
): boolean {
	const abx = bx - ax;
	const aby = by - ay;
	const cdx = dx - cx;
	const cdy = dy - cy;
	const acx = cx - ax;
	const acy = cy - ay;
	const denominator = abx * cdy - aby * cdx;
	if (Math.abs(denominator) > 1e-6) {
		const t = (acx * cdy - acy * cdx) / denominator;
		const u = (acx * aby - acy * abx) / denominator;
		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
	}
	// Parallel, or crossing outside both spans: fall back to the closest
	// approach of the four endpoint-to-segment distances.
	return (
		Math.min(
			pointSegmentDistanceSquared(ax, ay, cx, cy, dx, dy),
			pointSegmentDistanceSquared(bx, by, cx, cy, dx, dy),
			pointSegmentDistanceSquared(cx, cy, ax, ay, bx, by),
			pointSegmentDistanceSquared(dx, dy, ax, ay, bx, by),
		) <=
		radius * radius
	);
}

/** The segment a bullet's body occupied between the last frame and this one. */
export function bulletPath(b: {
	x: number;
	y: number;
	a: number;
	previousX: number;
	previousY: number;
	previousA: number;
}): { x0: number; y0: number; x1: number; y1: number } {
	const half = BULLET_LENGTH / 2;
	const pa = Number.isFinite(b.previousA) ? b.previousA : b.a;
	const px = Number.isFinite(b.previousX) ? b.previousX : b.x;
	const py = Number.isFinite(b.previousY) ? b.previousY : b.y;
	return {
		x0: px + Math.cos(pa) * half,
		y0: py + Math.sin(pa) * half,
		x1: b.x + Math.cos(b.a) * half,
		y1: b.y + Math.sin(b.a) * half,
	};
}

export function bulletHitsObstacle(
	game: Game,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
): boolean {
	const dx = x1 - x0;
	const dy = y1 - y0;
	const steps = Math.max(
		1,
		Math.ceil(Math.hypot(dx, dy) / BULLET_COLLISION_STEP),
	);
	for (let step = 1; step <= steps; step++) {
		const t = step / steps;
		if (game.world.blockingWorldRect(x0 + dx * t, y0 + dy * t)) return true;
	}
	return false;
}

// ----------------------------------------------------------------- destruction

/**
 * Remove one character from the page, and register how to put it back.
 *
 * The character is replaced by a hidden span holding the same text, not
 * deleted: the line keeps its width, so shooting a heading does not reflow the
 * paragraph under it — and the span is the undo record.
 */
export function destroyChar(game: Game, g: Glyph): void {
	const { node, index, len, rect } = g;
	const parent = node.parentNode;
	if (!parent || index >= node.data.length) return;
	if (node.parentElement?.closest(KEEP_SELECTOR)) return;

	const after = node.splitText(index);
	const char = after.data.slice(0, len);
	if (!char) return;
	after.data = after.data.slice(len);
	game.world.invalidate();

	const blank = document.createElement("span");
	blank.className = CHAR_BLANK_CLASS;
	blank.setAttribute("aria-hidden", "true");
	blank.style.visibility = "hidden";
	blank.textContent = char;
	parent.insertBefore(blank, after);

	game.stats.broken++;
	game.recordStats();

	const cx = rect.left + (rect.right - rect.left) / 2;
	const cy = rect.top + (rect.bottom - rect.top) / 2 + window.scrollY;
	game.effects.spawn(cx, cy, 1, 2, 3, 40, 120, "oklch(var(--color-ink))");

	game.undo.register(() => {
		if (!blank.isConnected) return;
		const text = document.createTextNode(char);
		blank.replaceWith(text);
		game.world.invalidate();
		// A character that reappears on top of the rocket kills it. That is
		// the reference's rule and it is what makes destroyed text a hazard
		// rather than free points.
		const range = document.createRange();
		range.setStart(text, 0);
		range.setEnd(text, char.length);
		const rects = range.getClientRects();
		if (rects.length) {
			const rr = rects[0];
			game.crushCar({
				left: rr.left - 4,
				top: rr.top - 4,
				right: rr.right + 4,
				bottom: rr.bottom + 4,
			});
		}
	}, RESPAWN_AFTER);
}

export function destroyElement(game: Game, el: Element): void {
	const target = el as HTMLElement;
	if (target.dataset.arcadeDestroyed) return;
	if (target.closest(KEEP_SELECTOR)) return;
	target.dataset.arcadeDestroyed = "1";

	const r = target.getBoundingClientRect();
	const cx = r.left + r.width / 2;
	const cy = r.top + r.height / 2 + window.scrollY;
	const cs = getComputedStyle(target);
	const bg = alpha(cs.backgroundColor) > 0.06 ? cs.backgroundColor : undefined;

	game.effects.ringAt(cx, cy);
	// Debris count scales with area, capped: a full-width section should not
	// produce a thousand particles.
	const count = Math.min(
		16,
		Math.max(8, Math.round((r.width * r.height) / 2600)),
	);
	game.effects.spawn(cx, cy, count, 3, 9, 90, 320, bg);

	const previousVisibility = target.style.visibility;
	const previousPointerEvents = target.style.pointerEvents;
	target.style.visibility = "hidden";
	target.style.pointerEvents = "none";
	game.world.invalidate();
	game.stats.broken++;
	game.recordStats();

	game.undo.register(() => {
		delete target.dataset.arcadeDestroyed;
		target.style.visibility = previousVisibility;
		target.style.pointerEvents = previousPointerEvents;
		game.world.invalidate();
		target.classList.add("arcade-respawn");
		window.setTimeout(() => target.classList.remove("arcade-respawn"), 600);
		game.crushCar(target.getBoundingClientRect());
	}, RESPAWN_AFTER);
}

// --------------------------------------------------------------------- firing

export function setGunMode(game: Game, mode: GunMode): void {
	if (game.gunMode === mode) return;
	game.gunMode = mode;
	try {
		localStorage.setItem(STORAGE.gunMode, mode);
	} catch {
		// Mode lasts the session instead.
	}
	game.telemetry.gunMode(mode);
	game.audio.mode(mode);
}

function spawnBullet(
	game: Game,
	tx: number,
	ty: number,
	offset: number,
): boolean {
	if (game.bullets.length >= MAX_PLAYER_BULLETS) return false;
	const m = game.muzzle();
	const a =
		Math.atan2(ty - game.car.y, tx - game.car.x) +
		offset +
		rand(-SPREAD, SPREAD);
	const sp = BULLET_SPEED * rand(0.92, 1.08);
	const el = document.createElement("div");
	el.className = "arcade-bullet";
	game.root.appendChild(el);
	game.bullets.push({
		x: m.x,
		y: m.y,
		vx: Math.cos(a) * sp,
		vy: Math.sin(a) * sp,
		a,
		previousX: m.x,
		previousY: m.y,
		previousA: a,
		curve:
			game.gunMode === "curve"
				? (Math.random() < 0.5 ? -1 : 1) * rand(1.5, 2.5)
				: 0,
		target: game.gunMode === "curve" ? nearestEnemy(game, m.x, m.y) : null,
		el,
		life: BULLET_LIFE,
		mode: game.gunMode,
		hit: new Set(),
	});
	game.stats.shots++;
	return true;
}

export function fireShot(game: Game, tx: number, ty: number): void {
	if (game.state !== "drive") return;
	if (game.bullets.length >= MAX_PLAYER_BULLETS) return;
	game.car.angle = Math.atan2(ty - game.car.y, tx - game.car.x) + Math.PI / 2;
	const m = game.muzzle();
	game.effects.muzzleAt(m.x, m.y);
	const offsets =
		performance.now() < game.gunMultiplierUntil ? [-0.1, 0, 0.1] : [0];
	let fired = false;
	for (const offset of offsets) {
		fired = spawnBullet(game, tx, ty, offset) || fired;
	}
	if (fired) {
		game.audio.shot();
		game.recordStats();
	}
}

// ------------------------------------------------------------------ collision

function probeHit(game: Game, px: number, py: number): Hit | null {
	if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
	for (const el of game.world.elementsAt(px, py)) {
		if (el === document.body || el === document.documentElement) break;
		if (game.root.contains(el)) continue;
		if (el.classList.contains(CHAR_BLANK_CLASS)) continue;
		const keep = el.closest(KEEP_SELECTOR);
		if (keep) return { el: keep, key: "keep", keep: true, destructible: false };
		const solidity = game.world.solidity(el);
		if (solidity === "filled") {
			return { el, key: "el", keep: false, destructible: true };
		}
		if (solidity === "edge") {
			// A border paints a line, so only the line blocks. Testing the whole
			// box here — which is what asking `solid()` would do — kills every
			// bullet fired anywhere inside a section that has a rule on top,
			// which on this site is every section.
			const band = game.world.edgeRectAt(el, px, py);
			if (band) {
				return {
					el,
					rect: band,
					key: "edge",
					keep: false,
					destructible: false,
				};
			}
		}
	}
	const g = game.world.glyphAt(px, py);
	if (!g) return null;
	if (g.node.parentElement?.classList.contains(CHAR_BLANK_CLASS)) return null;
	const keep = g.node.parentElement?.closest(KEEP_SELECTOR);
	if (keep) return { el: keep, key: "keep", keep: true, destructible: false };
	// Keyed by rect rather than by node: the node is re-split on every hit, so
	// a node identity would let a piercing shot delete the same glyph twice.
	const key = `t:${[g.rect.left, g.rect.top, g.rect.right, g.rect.bottom]
		.map((v) => v.toFixed(1))
		.join(",")}`;
	return { g, key, keep: false, destructible: true };
}

function bounceBullet(
	b: Bullet,
	rect: Rect | null,
	px: number,
	py: number,
): void {
	if (!rect) return;
	const world = {
		left: rect.left,
		right: rect.right,
		top: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
	};
	const dx = px - b.x;
	const dy = py - b.y;
	// Which face did the segment cross first? Falls back to the nearest face
	// when the bullet started inside the rect.
	const crossings: Array<{ t: number; nx: number; ny: number }> = [];
	if (dx > 0 && b.x <= world.left && px >= world.left) {
		crossings.push({ t: (world.left - b.x) / dx, nx: -1, ny: 0 });
	}
	if (dx < 0 && b.x >= world.right && px <= world.right) {
		crossings.push({ t: (world.right - b.x) / dx, nx: 1, ny: 0 });
	}
	if (dy > 0 && b.y <= world.top && py >= world.top) {
		crossings.push({ t: (world.top - b.y) / dy, nx: 0, ny: -1 });
	}
	if (dy < 0 && b.y >= world.bottom && py <= world.bottom) {
		crossings.push({ t: (world.bottom - b.y) / dy, nx: 0, ny: 1 });
	}
	const normal =
		crossings.sort((a, z) => a.t - z.t)[0] ??
		[
			{ distance: Math.abs(px - world.left), nx: -1, ny: 0 },
			{ distance: Math.abs(world.right - px), nx: 1, ny: 0 },
			{ distance: Math.abs(py - world.top), nx: 0, ny: -1 },
			{ distance: Math.abs(world.bottom - py), nx: 0, ny: 1 },
		].sort((a, z) => a.distance - z.distance)[0];

	const dot = b.vx * normal.nx + b.vy * normal.ny;
	b.vx -= 2 * dot * normal.nx;
	b.vy -= 2 * dot * normal.ny;
	b.x = px + normal.nx * 2;
	b.y = py + normal.ny * 2;
	b.a = Math.atan2(b.vy, b.vx);
}

export function updateBullets(game: Game, dt: number): void {
	let probesLeft = MAX_BULLET_PROBES_PER_FRAME;
	for (let i = game.bullets.length - 1; i >= 0; i--) {
		const b = game.bullets[i];
		b.life -= dt;
		if (b.life <= 0) {
			b.el.remove();
			game.bullets.splice(i, 1);
			continue;
		}
		b.previousX = b.x;
		b.previousY = b.y;
		b.previousA = b.a;

		if (b.curve) {
			let turn = b.curve * dt;
			if (b.mode === "curve") {
				b.target = nearestEnemy(game, b.x, b.y);
				if (b.target) {
					const targetAngle = Math.atan2(b.target.y - b.y, b.target.x - b.x);
					turn += clamp(
						angDiff(b.a, targetAngle) - turn,
						-CURVE_HOMING_TURN_RATE * dt,
						CURVE_HOMING_TURN_RATE * dt,
					);
				}
			}
			const cos = Math.cos(turn);
			const sin = Math.sin(turn);
			const vx = b.vx * cos - b.vy * sin;
			const vy = b.vx * sin + b.vy * cos;
			b.vx = vx;
			b.vy = vy;
		}

		const nx = b.x + b.vx * dt;
		const ny = b.y + b.vy * dt;
		const steps = Math.max(
			1,
			Math.ceil(Math.hypot(nx - b.x, ny - b.y) / BULLET_COLLISION_STEP),
		);
		let dead = false;
		let bounced = false;

		for (let s = 1; s <= steps; s++) {
			if (probesLeft <= 0) break;
			probesLeft--;
			const px = b.x + ((nx - b.x) * s) / steps;
			const py = b.y + ((ny - b.y) * s) / steps;
			// Enemies before the page. They are drawn on top of it and they fly
			// over it, so a shot that reaches one should hit it rather than the
			// paragraph behind it — the reference tests the page first, which
			// on a page as dense with text as this one means almost every
			// aimed shot dies on a glyph a few pixels short of its target.
			for (const enemy of game.enemies) {
				const ex = enemy.x - px;
				const ey = enemy.y - py;
				const radius = enemy.config.radius + 6;
				if (enemyVisible(enemy) && ex * ex + ey * ey < radius * radius) {
					damageEnemy(game, enemy);
					dead = true;
					break;
				}
			}
			if (dead) break;

			const hit = probeHit(game, px, py - window.scrollY);
			if (hit) {
				if (hit.keep || b.mode === "tetris") {
					bounceBullet(
						b,
						hit.rect ?? hit.el?.getBoundingClientRect() ?? hit.g?.rect ?? null,
						px,
						py,
					);
					if (b.mode === "tetris" && hit.g) destroyChar(game, hit.g);
					else if (b.mode === "tetris" && hit.el && hit.destructible) {
						destroyElement(game, hit.el);
					}
					bounced = true;
				} else if (b.mode === "character" && hit.g) {
					if (!b.hit.has(hit.key)) {
						b.hit.add(hit.key);
						destroyChar(game, hit.g);
					}
				} else {
					dead = true;
				}
				if (dead || bounced) break;
			}
		}

		if (dead) {
			b.el.remove();
			game.bullets.splice(i, 1);
			continue;
		}
		if (!bounced) {
			b.x = nx;
			b.y = ny;
			b.a = Math.atan2(b.vy, b.vx);
		}
		b.el.style.transform = `translate(${b.x}px, ${b.y - window.scrollY}px) rotate(${
			(b.a * 180) / Math.PI
		}deg)`;
		b.el.style.opacity = String(Math.min(1, b.life * 3));
	}
}

/** Player and enemy fire shoot each other down. */
export function resolveBulletCollisions(game: Game): void {
	for (let i = game.bullets.length - 1; i >= 0; i--) {
		const playerBullet = game.bullets[i];
		const playerPath = bulletPath(playerBullet);
		for (let j = game.enemyBullets.length - 1; j >= 0; j--) {
			const enemyBullet = game.enemyBullets[j];
			const enemyPath = bulletPath(enemyBullet);
			if (
				!segmentsWithinDistance(
					playerPath.x0,
					playerPath.y0,
					playerPath.x1,
					playerPath.y1,
					enemyPath.x0,
					enemyPath.y0,
					enemyPath.x1,
					enemyPath.y1,
					BULLET_CLASH_RADIUS,
				)
			) {
				continue;
			}
			game.effects.boomAt(
				(playerPath.x1 + enemyPath.x1) / 2,
				(playerPath.y1 + enemyPath.y1) / 2,
				8,
				2,
				5,
				40,
				150,
			);
			playerBullet.el.remove();
			enemyBullet.el.remove();
			game.bullets.splice(i, 1);
			game.enemyBullets.splice(j, 1);
			break;
		}
	}
}
