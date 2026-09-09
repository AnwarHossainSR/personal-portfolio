import { Audio } from "@/arcade/audio";
import {
	fireShot,
	resolveBulletCollisions,
	setGunMode,
	updateBullets,
} from "@/arcade/bullets";
import {
	BARREL_LEN,
	BLAST_AFTER,
	CAMERA_ACCEL,
	CAMERA_MAX,
	CAR_CLEAR_R,
	CAR_H,
	CAR_R,
	CAR_RESPAWN_DELAY,
	CAR_W,
	ENEMY_FIRST,
	ENEMY_LEVEL_NUMBERS,
	ENEMY_LEVEL_SPAWN_KILLS,
	GUN_MODES,
	GUN_MULTIPLIER_DURATION,
	GUN_POWERUP_FIRST_MAX,
	GUN_POWERUP_FIRST_MIN,
	GUN_POWERUP_NEXT_MAX,
	GUN_POWERUP_NEXT_MIN,
	type GunMode,
	PLAYER_HIT_COOLDOWN,
	PLAYER_MAX_HEALTH,
	PLAYER_SPAWN_PROTECTION,
	ROCKET_SPEED,
	SCORE_BALL_DELAY,
	SCORE_BALL_FIRST,
	SCORE_BALL_RELOCATE_AFTER,
	STORAGE,
} from "@/arcade/constants";
import { Effects } from "@/arcade/effects";
import {
	enemyCount,
	enemyMaxAlive,
	enemyMaxSpeed,
	enemyVisible,
	spawnEnemy,
	updateEnemies,
	updateEnemyBullets,
} from "@/arcade/enemies";
import { clamp, rand, TAU } from "@/arcade/math";
import {
	emptyStats,
	mergeSavedStats,
	ScoreStore,
	type Stats,
} from "@/arcade/score";
import { ENEMY_SVG, ROCKET_SVG } from "@/arcade/sprites";
import { Telemetry } from "@/arcade/telemetry";
import type {
	Bullet,
	Enemy,
	EnemyBullet,
	GameState,
	Pickup,
} from "@/arcade/types";
import { UndoLog } from "@/arcade/undo";
import { circleRect, type Rect, World } from "@/arcade/world";

/**
 * The game.
 *
 * Framework-agnostic on purpose: no React, no router, no imports from the rest
 * of `src` beyond the design tokens it reads through CSS. The only contract
 * the application sees is `start()` / `stop()` in index.ts, and the only thing
 * that makes this different from the Astro original is that `stop()` has to
 * genuinely exist — see undo.ts.
 */
export class Game {
	readonly root: HTMLElement;
	readonly carEl: HTMLElement;
	private readonly boundaryCanvas: HTMLCanvasElement;
	readonly world: World;
	readonly effects: Effects;
	readonly audio = new Audio();
	readonly telemetry = new Telemetry();
	readonly undo = new UndoLog();
	readonly scoreStore = new ScoreStore();

	readonly car = { x: 0, y: 0, angle: -Math.PI / 2, speed: 0 };
	readonly mouse = { x: 0, y: 0 };
	readonly keys = new Set<string>();

	state: GameState = "parked";
	playerHealth = PLAYER_MAX_HEALTH;
	invulnUntil = 0;
	stats: Stats = emptyStats();

	readonly bullets: Bullet[] = [];
	readonly enemyBullets: EnemyBullet[] = [];
	readonly enemies: Enemy[] = [];

	gunMode: GunMode = "normal";
	gunMultiplierUntil = 0;
	nextShotAt = 0;
	pointerFiring = false;
	keyFiring = false;

	readonly gameStartedAt = performance.now();
	enemySpawnCount = 0;
	allTimeMaxLevel = 1;
	readonly sessionKillsByLevel: Record<number, number> = {};
	readonly defeatsByLevel: Record<number, number> = {};
	readonly nextLevelSpawnAt: Record<number, number> = {};

	private scoreBall: Pickup | null = null;
	private nextBallAt = this.gameStartedAt + SCORE_BALL_FIRST;
	private gunPowerup: Pickup | null = null;
	private nextGunPowerupAt =
		this.gameStartedAt + rand(GUN_POWERUP_FIRST_MIN, GUN_POWERUP_FIRST_MAX);

	private raf = 0;
	private last = performance.now();
	private cameraVelocity = 0;
	private respawnAt = 0;
	private outsideAt = 0;
	private blastAt = { x: 0, y: 0 };
	private boundariesVisible = false;
	private nextBoundaryRenderAt = 0;
	private spawnProtectionTimer = 0;
	private enemyLoopTimer = 0;
	private initialSpawnTimer = 0;
	private disposed = false;
	private readonly listeners: Array<() => void> = [];

	constructor(root: HTMLElement) {
		this.root = root;
		this.world = new World(root);
		this.effects = new Effects(root);

		this.boundaryCanvas = document.createElement("canvas");
		this.boundaryCanvas.id = "arcade-boundaries";
		this.boundaryCanvas.setAttribute("aria-hidden", "true");
		root.appendChild(this.boundaryCanvas);

		this.carEl = document.createElement("div");
		this.carEl.id = "arcade-car";
		this.carEl.setAttribute("aria-hidden", "true");
		this.carEl.innerHTML = ROCKET_SVG;
		root.appendChild(this.carEl);

		for (const level of ENEMY_LEVEL_NUMBERS) {
			this.sessionKillsByLevel[level] = 0;
			this.defeatsByLevel[level] = 0;
		}
		// Killing a hundred of a level unlocks the next one, once per hundred.
		this.nextLevelSpawnAt[1] = ENEMY_LEVEL_SPAWN_KILLS;
		this.nextLevelSpawnAt[2] = ENEMY_LEVEL_SPAWN_KILLS;

		try {
			const saved = localStorage.getItem(STORAGE.gunMode);
			if (saved && (GUN_MODES as readonly string[]).includes(saved)) {
				this.gunMode = saved as GunMode;
			}
		} catch {
			// Storage unavailable. Start on the default gun.
		}
	}

	// ---------------------------------------------------------------- lifecycle

	start(): void {
		this.bindInput();
		this.telemetry.gunMode(this.gunMode);
		this.telemetry.hull(this.playerHealth);
		this.telemetry.stats(this.stats);

		void this.scoreStore.load().then((saved) => {
			if (this.disposed || !saved) return;
			mergeSavedStats(this.stats, saved);
			this.allTimeMaxLevel = Math.max(1, this.stats.maxLevel);
			this.defeatsByLevel[1] = this.stats.kills;
			this.nextLevelSpawnAt[1] =
				(Math.floor(this.stats.kills / ENEMY_LEVEL_SPAWN_KILLS) + 1) *
				ENEMY_LEVEL_SPAWN_KILLS;
			this.telemetry.stats(this.stats);
		});

		this.initialSpawn();
		this.raf = requestAnimationFrame(this.loop);
		this.enemyLoopTimer = window.setTimeout(this.enemyLoop, ENEMY_FIRST);
	}

	/**
	 * Full teardown. Everything this class created is removed, every listener
	 * is unbound, and the page is put back exactly as it was found. There is no
	 * "mostly stopped" state: a reader who turns the overlay off is entitled to
	 * their page, not to a page with holes in it and a dead event handler on
	 * the document.
	 */
	stop(): void {
		if (this.disposed) return;
		this.disposed = true;

		cancelAnimationFrame(this.raf);
		window.clearTimeout(this.enemyLoopTimer);
		window.clearTimeout(this.initialSpawnTimer);
		window.clearTimeout(this.spawnProtectionTimer);

		for (const off of this.listeners) off();
		this.listeners.length = 0;

		this.undo.restoreAll();

		for (const bullet of this.bullets) bullet.el.remove();
		for (const bullet of this.enemyBullets) bullet.el.remove();
		for (const enemy of this.enemies) enemy.el.remove();
		this.bullets.length = 0;
		this.enemyBullets.length = 0;
		this.enemies.length = 0;
		this.scoreBall?.el.remove();
		this.scoreBall = null;
		this.gunPowerup?.el.remove();
		this.gunPowerup = null;

		this.effects.dispose();
		this.scoreStore.dispose();
		this.audio.close();
		this.telemetry.forget();
		this.carEl.remove();
		this.root.remove();
		document.documentElement.classList.remove("arcade-no-select");
	}

	get isDisposed(): boolean {
		return this.disposed;
	}

	private on<K extends keyof DocumentEventMap>(
		target: EventTarget,
		type: K | string,
		handler: EventListenerOrEventListenerObject,
		options?: AddEventListenerOptions,
	): void {
		target.addEventListener(type, handler, options);
		this.listeners.push(() =>
			target.removeEventListener(type, handler, options),
		);
	}

	private bindInput(): void {
		const onMove = (event: Event) => {
			const e = event as MouseEvent;
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;
			this.outsideAt = 0;
		};
		this.on(document, "mousemove", onMove, { passive: true });
		this.on(document, "pointermove", onMove, { passive: true });
		this.on(document, "mouseenter", onMove, { passive: true });
		this.on(document.documentElement, "mouseleave", () => {
			this.outsideAt = performance.now();
		});

		this.on(
			document,
			"pointerdown",
			(event) => {
				const e = event as PointerEvent;
				if (e.button !== 0) return;
				const target = e.target;
				if (!(target instanceof Element)) return;
				// Anything the reader can operate wins the click. Selecting
				// text wins it too: a portfolio whose copy cannot be copied is
				// not a portfolio.
				if (
					target.closest(
						"a, button, input, textarea, select, label, canvas, [contenteditable], [data-arcade-keep]",
					)
				) {
					return;
				}
				if (this.world.glyphAt(e.clientX, e.clientY)) return;
				this.mouse.x = e.clientX;
				this.mouse.y = e.clientY;
				this.pointerFiring = true;
				this.nextShotAt = 0;
				e.preventDefault();
				fireShot(this, this.mouse.x, this.mouse.y + window.scrollY);
			},
			{ passive: false },
		);

		const stopFiring = () => {
			this.pointerFiring = false;
		};
		this.on(document, "pointerup", stopFiring);
		this.on(document, "pointercancel", stopFiring);

		this.on(document, "keydown", (event) => {
			const e = event as KeyboardEvent;
			const target = e.target;
			if (
				target instanceof HTMLElement &&
				target.closest("input, textarea, select, [contenteditable]")
			) {
				return;
			}
			const k = e.key.toLowerCase();
			if (k === "v") {
				this.setBoundariesVisible(true);
				return;
			}
			if (!e.repeat && k >= "1" && k <= "4") {
				setGunMode(this, GUN_MODES[Number(k) - 1]);
				return;
			}
			if (k === "f" && !e.repeat) {
				this.keyFiring = true;
				this.nextShotAt = 0;
				fireShot(this, this.mouse.x, this.mouse.y + window.scrollY);
				return;
			}
			if (k === "r" && !e.repeat) {
				if (this.state === "drive") this.blast("r");
				return;
			}
			if ("wasd".includes(k)) this.keys.add(k);
		});

		this.on(document, "keyup", (event) => {
			const e = event as KeyboardEvent;
			const k = e.key.toLowerCase();
			if (k === "v") {
				this.setBoundariesVisible(false);
				return;
			}
			if (k === "f") this.keyFiring = false;
			this.keys.delete(k);
		});

		this.on(window, "blur", () => {
			this.pointerFiring = false;
			this.keyFiring = false;
			this.keys.clear();
			this.setBoundariesVisible(false);
		});
	}

	// ---------------------------------------------------------------- debugging

	private setBoundariesVisible(visible: boolean): void {
		this.boundariesVisible = visible;
		this.boundaryCanvas.style.display = visible ? "block" : "none";
		if (visible) this.nextBoundaryRenderAt = 0;
	}

	/**
	 * Hold V to see the collision world.
	 *
	 * Drawn from the same classifier the engine collides against — filled
	 * elements as their box, bordered ones as the bands their borders paint,
	 * text as its measured rect — so this is what the collision code sees
	 * rather than a description of it. Redrawn a few times a second, not every
	 * frame: it walks every element on the page.
	 */
	private renderBoundaries(now: number): void {
		if (!this.boundariesVisible || now < this.nextBoundaryRenderAt) return;
		this.nextBoundaryRenderAt = now + 220;
		const context = this.boundaryCanvas.getContext("2d");
		if (!context) return;

		const width = Math.max(1, innerWidth);
		const height = Math.max(1, innerHeight);
		const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
		const pixelWidth = Math.round(width * dpr);
		const pixelHeight = Math.round(height * dpr);
		if (
			this.boundaryCanvas.width !== pixelWidth ||
			this.boundaryCanvas.height !== pixelHeight
		) {
			this.boundaryCanvas.width = pixelWidth;
			this.boundaryCanvas.height = pixelHeight;
		}
		context.setTransform(dpr, 0, 0, dpr, 0, 0);
		context.clearRect(0, 0, width, height);
		context.beginPath();
		context.rect(0.5, 0.5, width - 1, height - 1);

		for (const el of document.querySelectorAll("body *")) {
			if (this.root.contains(el)) continue;
			if (el.closest("[data-arcade-keep]")) continue;
			const cs = getComputedStyle(el);
			if (cs.display === "none" || cs.visibility === "hidden") continue;
			if (Number(cs.opacity) < 0.02) continue;

			const solidity = this.world.solidity(el);
			const rects: Array<Rect | DOMRect | null> =
				solidity === "filled"
					? [el.getBoundingClientRect()]
					: solidity === "edge"
						? this.world.edgeBands(el)
						: [this.world.textRect(el)];

			for (const rect of rects) {
				if (!rect) continue;
				if (rect.right <= 0 || rect.bottom <= 0) continue;
				if (rect.left >= width || rect.top >= height) continue;
				context.rect(
					rect.left + 0.5,
					rect.top + 0.5,
					rect.right - rect.left,
					rect.bottom - rect.top,
				);
			}
		}

		// Canvas does not resolve custom properties, so the token is read off
		// the document and rebuilt as a literal colour.
		const danger = getComputedStyle(document.documentElement)
			.getPropertyValue("--color-arcade-danger")
			.trim();
		context.strokeStyle = danger
			? `oklch(${danger} / 0.35)`
			: "rgba(220, 90, 70, 0.35)";
		context.lineWidth = 1;
		context.stroke();
	}

	// ------------------------------------------------------------------ scoring

	/**
	 * Back to zero, without a reload.
	 *
	 * The reference clears the stored ciphertext and reloads the page, which
	 * an MPA can afford. Here a reload would throw away the run in progress
	 * and, worse, the restored page — so the live counters are reset in place
	 * instead. The telemetry sweep in the loop picks the new values up on the
	 * next frame; nothing has to be pushed from here.
	 */
	resetScore(): void {
		this.scoreStore.reset();
		this.stats = emptyStats();
		this.allTimeMaxLevel = 1;
		for (const level of ENEMY_LEVEL_NUMBERS) {
			this.sessionKillsByLevel[level] = 0;
			this.defeatsByLevel[level] = 0;
		}
		this.nextLevelSpawnAt[1] = ENEMY_LEVEL_SPAWN_KILLS;
		this.nextLevelSpawnAt[2] = ENEMY_LEVEL_SPAWN_KILLS;
	}

	recordStats(): void {
		this.telemetry.stats(this.stats);
		this.scoreStore.queueSave(this.stats);
	}

	// ------------------------------------------------------------------ placing

	spotClear(x: number, y: number, r: number, avoidRect?: Rect): boolean {
		return this.world.spotClear(x, y, r, 16, avoidRect);
	}

	spotClearFast(x: number, y: number, r: number): boolean {
		return this.world.spotClear(x, y, r, 8);
	}

	/** A free circle somewhere in the current viewport, or null if there is none. */
	clearSpot(
		r: number,
		avoidX?: number,
		avoidY?: number,
		minDistance = 0,
		avoidRect?: Rect,
	): { x: number; y: number } | null {
		const inset = Math.max(40, r + 8);
		const usable = (x: number, y: number) => {
			if (
				Number.isFinite(avoidX) &&
				Number.isFinite(avoidY) &&
				Math.hypot(x - (avoidX as number), y - (avoidY as number)) < minDistance
			) {
				return false;
			}
			return this.spotClear(x, y, r, avoidRect);
		};
		// Random darts first — usually one lands. The grid sweep below is the
		// fallback for a dense page where most of the viewport is occupied.
		for (let i = 0; i < 64; i++) {
			const x = rand(inset, innerWidth - inset);
			const y = rand(
				window.scrollY + inset,
				window.scrollY + innerHeight - inset,
			);
			if (usable(x, y)) return { x, y };
		}
		const step = Math.max(36, r * 1.5);
		for (
			let y = window.scrollY + inset;
			y <= window.scrollY + innerHeight - inset;
			y += step
		) {
			for (let x = inset; x <= innerWidth - inset; x += step) {
				if (usable(x, y)) return { x, y };
			}
		}
		return null;
	}

	safePointAround(
		x: number,
		y: number,
		r: number,
	): { x: number; y: number } | null {
		if (this.spotClearFast(x, y, r)) return { x, y };
		const maxWorldY = Math.max(
			innerHeight,
			document.documentElement.scrollHeight,
		);
		for (let d = r + 12; d <= 320; d += 20) {
			for (let i = 0; i < 16; i++) {
				const a = (i / 16) * TAU;
				const cx = clamp(x + Math.cos(a) * d, r + 4, innerWidth - r - 4);
				const cy = clamp(y + Math.sin(a) * d, r + 4, maxWorldY - r - 4);
				if (this.spotClearFast(cx, cy, r)) return { x: cx, y: cy };
			}
		}
		return null;
	}

	// ------------------------------------------------------------------- player

	/** The middle of what the reader is currently looking at. */
	private viewportCentre(): { x: number; y: number } {
		return {
			x: innerWidth / 2,
			y: window.scrollY + innerHeight / 2,
		};
	}

	private initialSpawn = (): void => {
		if (this.disposed || this.state !== "parked") return;
		// Start in the middle of the screen and search outwards, rather than
		// taking the first free spot anywhere in the viewport. clearSpot throws
		// 64 random darts, which on a page with wide margins usually lands the
		// rocket in the gutter — somebody who just switched this on should not
		// have to go looking for it.
		const centre = this.viewportCentre();
		const spot =
			this.safePointAround(centre.x, centre.y, CAR_CLEAR_R + 6) ??
			this.clearSpot(CAR_CLEAR_R + 6);
		if (spot) this.spawn(spot.x, spot.y);
		else this.initialSpawnTimer = window.setTimeout(this.initialSpawn, 500);
	};

	private spawn(x: number, y: number): void {
		const safe =
			Number.isFinite(x) &&
			Number.isFinite(y) &&
			this.spotClear(x, y, CAR_CLEAR_R)
				? { x, y }
				: this.clearSpot(CAR_CLEAR_R + 6);
		if (!safe) return;
		this.car.x = safe.x;
		this.car.y = safe.y;
		this.car.angle = Math.atan2(
			safe.x - this.mouse.x,
			-(safe.y - (this.mouse.y + window.scrollY)),
		);
		this.car.speed = 0;
		this.playerHealth = PLAYER_MAX_HEALTH;
		this.telemetry.hull(this.playerHealth);
		this.carEl.style.display = "block";
		this.revive();
		this.state = "drive";
	}

	private revive(): void {
		this.carEl.classList.remove("arcade-revive");
		void this.carEl.offsetWidth;
		this.carEl.classList.add("arcade-revive");
		this.startSpawnProtection();
	}

	private startSpawnProtection(): void {
		this.invulnUntil = performance.now() + PLAYER_SPAWN_PROTECTION;
		if (this.spawnProtectionTimer) {
			window.clearTimeout(this.spawnProtectionTimer);
		}
		this.carEl.classList.remove("arcade-spawn-protected");
		void this.carEl.offsetWidth;
		this.carEl.classList.add("arcade-spawn-protected");
		this.spawnProtectionTimer = window.setTimeout(() => {
			this.carEl.classList.remove("arcade-spawn-protected");
			this.spawnProtectionTimer = 0;
		}, PLAYER_SPAWN_PROTECTION);
	}

	blast(reason: "idle" | "enemy" | "r" | "crush"): void {
		// Clearing this is not optional. The idle timer fires when the cursor
		// leaves the document; if it survives the blast, the very next frame
		// after the respawn sees an expired timer and blasts again, and the
		// rocket flickers once every five seconds forever. The reference has
		// the same hole — it is just harder to notice on a page you did not
		// deliberately switch the game on for.
		this.outsideAt = 0;
		this.state = "blasted";
		this.respawnAt = performance.now() + CAR_RESPAWN_DELAY;
		this.blastAt = { x: this.car.x, y: this.car.y };
		if (this.spawnProtectionTimer) {
			window.clearTimeout(this.spawnProtectionTimer);
			this.spawnProtectionTimer = 0;
		}
		this.carEl.classList.remove("arcade-spawn-protected");
		this.carEl.style.display = "none";
		this.effects.boomAt(this.car.x, this.car.y, 16, 4, 8, 70, 280);
		if (reason === "idle") this.stats.idle++;
		else if (reason === "enemy") this.stats.deaths++;
		else if (reason === "r") this.stats.respawns++;
		this.recordStats();
	}

	private respawn(px: number, py: number): boolean {
		const safe =
			Number.isFinite(px) &&
			Number.isFinite(py) &&
			this.spotClear(px, py, CAR_CLEAR_R)
				? { x: px, y: py }
				: this.clearSpot(CAR_CLEAR_R + 6);
		if (!safe) return false;
		this.car.x = safe.x;
		this.car.y = safe.y;
		this.car.angle = Math.atan2(
			this.mouse.x - this.car.x,
			-(this.mouse.y + window.scrollY - this.car.y),
		);
		this.car.speed = 0;
		this.playerHealth = PLAYER_MAX_HEALTH;
		this.telemetry.hull(this.playerHealth);
		this.carEl.style.display = "block";
		this.revive();
		// Debris pulled inwards rather than blown outwards: the rocket is
		// arriving, not exploding.
		for (let i = 0; i < 10; i++) {
			const a = rand(0, TAU);
			const d = rand(26, 62);
			this.effects.spawn(
				this.car.x + Math.cos(a) * d,
				this.car.y + Math.sin(a) * d,
				1,
				3,
				6,
				150,
				150,
			);
		}
		this.state = "drive";
		return true;
	}

	damagePlayer(): void {
		if (this.state !== "drive") return;
		const now = performance.now();
		if (now < this.invulnUntil) return;
		this.invulnUntil = now + PLAYER_HIT_COOLDOWN;
		this.playerHealth = Math.max(0, this.playerHealth - 1);
		this.telemetry.hull(this.playerHealth);
		if (this.playerHealth <= 0) this.blast("enemy");
	}

	/** A restored element that reappears on top of the rocket kills it. */
	crushCar(rect: Rect): void {
		if (this.state === "parked") return;
		if (performance.now() < this.invulnUntil) return;
		const world = {
			left: rect.left,
			right: rect.right,
			top: rect.top + window.scrollY,
			bottom: rect.bottom + window.scrollY,
		};
		if (!circleRect(this.car.x, this.car.y, CAR_CLEAR_R, world)) return;
		this.blast("crush");
	}

	private moveRocket(dt: number): void {
		if (this.state !== "drive") return;
		if (!this.spotClearFast(this.car.x, this.car.y, CAR_CLEAR_R)) {
			const safe = this.safePointAround(this.car.x, this.car.y, CAR_CLEAR_R);
			if (safe && (safe.x !== this.car.x || safe.y !== this.car.y)) {
				this.car.x = safe.x;
				this.car.y = safe.y;
				this.car.speed = 0;
			}
		}
		const dx = (this.keys.has("d") ? 1 : 0) - (this.keys.has("a") ? 1 : 0);
		const dy = (this.keys.has("s") ? 1 : 0) - (this.keys.has("w") ? 1 : 0);
		if (dx === 0 && dy === 0) {
			this.car.speed = 0;
			return;
		}
		const length = Math.hypot(dx, dy);
		const nx = dx / length;
		const ny = dy / length;
		const desired = Math.atan2(nx, -ny);
		const step = ROCKET_SPEED * dt;
		const maxWorldY =
			Math.max(innerHeight, document.documentElement.scrollHeight) -
			CAR_CLEAR_R;
		// Sample the wanted heading first, then progressively wider deflections
		// either side, and finally straight back. This is what lets the rocket
		// slide along the edge of a card instead of sticking to it.
		const offsets = [0, 0.3, -0.3, 0.65, -0.65, 1.05, -1.05, Math.PI];
		let best: { x: number; y: number; angle: number } | null = null;
		let bestScore = Number.POSITIVE_INFINITY;
		for (const offset of offsets) {
			const angle = desired + offset;
			const x = this.car.x + Math.sin(angle) * step;
			const y = this.car.y - Math.cos(angle) * step;
			if (x < CAR_CLEAR_R || x > innerWidth - CAR_CLEAR_R) continue;
			if (y < CAR_CLEAR_R || y > maxWorldY) continue;
			if (!this.spotClear(x, y, CAR_CLEAR_R)) continue;
			const score =
				Math.hypot(x - (this.car.x + nx * step), y - (this.car.y + ny * step)) +
				Math.abs(offset) * 22;
			if (score < bestScore) {
				bestScore = score;
				best = { x, y, angle };
			}
		}
		if (best) {
			this.car.x = best.x;
			this.car.y = best.y;
			this.car.angle = best.angle;
			this.car.speed = ROCKET_SPEED;
		} else {
			this.car.speed = 0;
		}
	}

	private scrollWithRocket(dt: number): void {
		const dy = (this.keys.has("s") ? 1 : 0) - (this.keys.has("w") ? 1 : 0);
		const edge = Math.min(150, innerHeight * 0.25);
		const maxScroll = Math.max(
			0,
			document.documentElement.scrollHeight - innerHeight - window.scrollY,
		);
		const screenY = this.car.y - window.scrollY;
		const direction =
			dy > 0 && screenY > innerHeight - edge && maxScroll > 0
				? 1
				: dy < 0 && screenY < edge && window.scrollY > 0
					? -1
					: 0;
		const wanted = direction * CAMERA_MAX;
		const delta = CAMERA_ACCEL * dt;
		this.cameraVelocity += clamp(wanted - this.cameraVelocity, -delta, delta);
		if (direction === 0) this.cameraVelocity *= Math.exp(-8 * dt);
		const limit = document.documentElement.scrollHeight - innerHeight;
		const next = clamp(window.scrollY + this.cameraVelocity * dt, 0, limit);
		document.documentElement.scrollTop = next;
		document.body.scrollTop = next;
		if (next <= 0 || next >= limit) this.cameraVelocity = 0;
	}

	// ------------------------------------------------------------------ pickups

	private findSpot(
		radius: number,
		minPlayerDistance: number,
		avoid?: { x: number; y: number },
	): { x: number; y: number } | null {
		const inset = radius + 16;
		for (let i = 0; i < 64; i++) {
			const x = rand(inset, innerWidth - inset);
			const y = rand(
				window.scrollY + inset,
				window.scrollY + innerHeight - inset,
			);
			if (!this.spotClear(x, y, radius)) continue;
			if (Math.hypot(x - this.car.x, y - this.car.y) < minPlayerDistance) {
				continue;
			}
			if (avoid && Math.hypot(x - avoid.x, y - avoid.y) < 160) continue;
			const crowded = this.enemies.some(
				(enemy) =>
					enemyVisible(enemy) &&
					Math.hypot(x - enemy.x, y - enemy.y) < enemy.config.clearRadius * 8,
			);
			if (crowded) continue;
			return { x, y };
		}
		return this.clearSpot(radius, this.car.x, this.car.y, minPlayerDistance);
	}

	private updateScoreBall(now: number): void {
		if (!this.scoreBall) {
			if (this.state === "drive" && now >= this.nextBallAt) {
				const spot = this.findSpot(12, 140);
				if (spot) {
					const el = document.createElement("div");
					el.className = "arcade-score-ball";
					this.root.appendChild(el);
					this.scoreBall = {
						x: spot.x,
						y: spot.y,
						el,
						moveAt: now + SCORE_BALL_RELOCATE_AFTER,
					};
					this.nextBallAt = now + SCORE_BALL_DELAY;
				} else {
					this.nextBallAt = now + 1000;
				}
			}
			return;
		}
		// An orb nobody collects moves, rather than sitting on a paragraph
		// nobody wants to fly into.
		if (now >= this.scoreBall.moveAt) {
			const spot = this.findSpot(12, 140, this.scoreBall);
			if (spot) {
				this.scoreBall.x = spot.x;
				this.scoreBall.y = spot.y;
				this.scoreBall.moveAt = now + SCORE_BALL_RELOCATE_AFTER;
			} else {
				this.scoreBall.moveAt = now + 1000;
			}
		}
		this.scoreBall.el.style.left = `${this.scoreBall.x - 10}px`;
		this.scoreBall.el.style.top = `${this.scoreBall.y - window.scrollY - 10}px`;
		const reach = CAR_CLEAR_R + 18;
		if (
			this.state === "drive" &&
			Math.hypot(this.car.x - this.scoreBall.x, this.car.y - this.scoreBall.y) <
				reach
		) {
			this.stats.grabs++;
			this.recordStats();
			this.scoreBall.el.remove();
			this.scoreBall = null;
			this.nextBallAt = now + SCORE_BALL_DELAY;
		}
	}

	private updateGunPowerup(now: number): void {
		if (!this.gunPowerup) {
			if (this.state === "drive" && now >= this.nextGunPowerupAt) {
				const spot = this.findSpot(15, 180);
				if (spot) {
					const el = document.createElement("div");
					el.className = "arcade-gun-powerup";
					el.textContent = "3X";
					this.root.appendChild(el);
					this.gunPowerup = { x: spot.x, y: spot.y, el, moveAt: 0 };
					this.nextGunPowerupAt =
						now + rand(GUN_POWERUP_NEXT_MIN, GUN_POWERUP_NEXT_MAX);
				} else {
					this.nextGunPowerupAt = now + 1000;
				}
			}
			return;
		}
		this.gunPowerup.el.style.left = `${this.gunPowerup.x - 15}px`;
		this.gunPowerup.el.style.top = `${this.gunPowerup.y - window.scrollY - 15}px`;
		const reach = CAR_CLEAR_R + 18;
		if (
			this.state === "drive" &&
			Math.hypot(
				this.car.x - this.gunPowerup.x,
				this.car.y - this.gunPowerup.y,
			) < reach
		) {
			this.gunMultiplierUntil = now + GUN_MULTIPLIER_DURATION;
			this.gunPowerup.el.remove();
			this.gunPowerup = null;
			this.nextGunPowerupAt =
				now + rand(GUN_POWERUP_NEXT_MIN, GUN_POWERUP_NEXT_MAX);
		}
	}

	// --------------------------------------------------------------------- loop

	private updateFire(now: number): void {
		if (!(this.pointerFiring || this.keyFiring)) return;
		if (this.state !== "drive" || now < this.nextShotAt) return;
		this.nextShotAt = now + 78;
		fireShot(this, this.mouse.x, this.mouse.y + window.scrollY);
	}

	private enemyLoop = (): void => {
		if (this.disposed) return;
		const now = performance.now();
		if (
			this.state === "drive" &&
			enemyCount(this, 1) < enemyMaxAlive(this, now)
		) {
			spawnEnemy(this, 1);
		}
		// Spawn pressure ramps and then holds. Faster than the reference's
		// 8200ms opening for the same reason the cap starts higher: this
		// overlay was asked for.
		const elapsed = Math.max(0, (now - this.gameStartedAt) / 1000);
		const interval = Math.max(1400, 4200 - elapsed * 35);
		this.enemyLoopTimer = window.setTimeout(this.enemyLoop, interval);
	};

	private loop = (now: number): void => {
		if (this.disposed) return;
		const dt = Math.min(0.05, (now - this.last) / 1000);
		this.last = now;

		if (this.state === "drive") {
			this.scrollWithRocket(dt);
			this.moveRocket(dt);
			// car.x going non-finite is reachable — a division by a zero-length
			// heading, a layout that reports NaN mid-transition. Relocate
			// rather than crash; the reference does the same and it matters
			// more here, where a thrown error takes React's tree with it.
			if (!Number.isFinite(this.car.x) || !Number.isFinite(this.car.y)) {
				const spot = this.clearSpot(CAR_CLEAR_R + 6);
				if (spot) {
					this.car.x = spot.x;
					this.car.y = spot.y;
					this.car.speed = 0;
				} else {
					this.carEl.style.display = "none";
					this.state = "blasted";
					this.respawnAt = now + CAR_RESPAWN_DELAY;
				}
			}
			if (this.outsideAt && now - this.outsideAt > BLAST_AFTER) {
				this.blast("idle");
			}
			this.carEl.style.transform = `translate(${this.car.x - CAR_W / 2}px, ${
				this.car.y - window.scrollY - CAR_H / 2
			}px) rotate(${(this.car.angle * 180) / Math.PI}deg)`;
		} else if (this.state === "blasted" && now >= this.respawnAt) {
			// Back where you died if that spot is still free, otherwise the
			// middle of the screen; if the page is momentarily too dense for
			// either, try again shortly rather than dropping the rocket into a
			// heading.
			const centre = this.viewportCentre();
			const fallback = this.safePointAround(
				centre.x,
				centre.y,
				CAR_CLEAR_R + 6,
			);
			const from = this.spotClear(this.blastAt.x, this.blastAt.y, CAR_CLEAR_R)
				? this.blastAt
				: (fallback ?? this.blastAt);
			if (!this.respawn(from.x, from.y)) {
				this.respawnAt = now + 500;
			}
		}

		this.updateScoreBall(now);
		this.updateGunPowerup(now);
		this.updateFire(now);
		updateEnemies(this, dt);
		updateEnemyBullets(this, dt);
		this.effects.update(dt);
		updateBullets(this, dt);
		resolveBulletCollisions(this);
		this.renderBoundaries(now);

		// Everything the panel shows is pushed every frame, not on the events
		// that change it. The panel can be closed and reopened at any moment,
		// which unmounts and remounts every row, and an event-driven write that
		// happened while it was closed is a row stuck on its placeholder. The
		// writer compares against the DOM and does nothing when it already
		// says the right thing, so the cost of this is a handful of id lookups.
		this.telemetry.stats(this.stats);
		this.telemetry.gunMode(this.gunMode);
		this.telemetry.hull(this.playerHealth);
		this.telemetry.enemies(
			Object.fromEntries(
				ENEMY_LEVEL_NUMBERS.map((level) => [level, enemyCount(this, level)]),
			),
			this.sessionKillsByLevel,
			this.enemies.length
				? this.enemies.reduce((total, e) => total + e.maxSpeed, 0) /
						this.enemies.length /
						32
				: enemyMaxSpeed(this, 1, now) / 32,
		);

		this.raf = requestAnimationFrame(this.loop);
	};

	/** Element template for a new enemy, kept here so sprites.ts stays data. */
	enemyMarkup(): string {
		return ENEMY_SVG;
	}

	/** Player bullet muzzle, in document coordinates. */
	muzzle(): { x: number; y: number } {
		return {
			x: this.car.x + Math.sin(this.car.angle) * BARREL_LEN,
			y: this.car.y - Math.cos(this.car.angle) * BARREL_LEN,
		};
	}

	get carRadius(): number {
		return CAR_R;
	}
}
