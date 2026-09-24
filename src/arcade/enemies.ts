import { bulletHitsObstacle } from "@/arcade/bullets";
import {
	ENEMIES_MAX,
	ENEMIES_START,
	ENEMY_ALIVE_STEP,
	ENEMY_LEVEL_SPAWN_KILLS,
	ENEMY_LEVELS,
} from "@/arcade/constants";
import type { Game } from "@/arcade/engine";
import { angDiff, clamp, rand, TAU } from "@/arcade/math";
import type { Enemy } from "@/arcade/types";

export function enemyVisible(enemy: Enemy): boolean {
	const screenY = enemy.y - window.scrollY;
	return (
		enemy.x >= 0 &&
		enemy.x <= innerWidth &&
		screenY >= 0 &&
		screenY <= innerHeight
	);
}

export function enemyCount(game: Game, level: number): number {
	let count = 0;
	for (const enemy of game.enemies) if (enemy.level === level) count++;
	return count;
}

/**
 * How many level-1 enemies may be alive at once.
 *
 * The reference starts at one and adds another every 45 seconds, which suits a
 * game that starts itself: the first minute is quiet for a reader who never
 * asked for it. Here somebody pressed a button, so it opens at three and
 * reaches the ceiling of eight inside a minute and a half.
 */
export function enemyMaxAlive(game: Game, now = performance.now()): number {
	return Math.min(
		ENEMIES_MAX,
		ENEMIES_START + Math.floor((now - game.gameStartedAt) / ENEMY_ALIVE_STEP),
	);
}

/**
 * Enemies get faster with both the session clock and the number spawned, so a
 * long run escalates whether or not the player is killing anything — but never
 * past the level's own speed limit.
 */
export function enemyMaxSpeed(
	game: Game,
	level: number,
	now = performance.now(),
): number {
	const config = ENEMY_LEVELS[level];
	const elapsed = Math.max(0, (now - game.gameStartedAt) / 1000);
	return Math.min(
		config.speedLimit,
		config.baseSpeed +
			game.enemySpawnCount * (level === 1 ? 3 : 4) +
			elapsed * (level === 1 ? 0.15 : 0.25),
	);
}

export function nearestEnemy(game: Game, x: number, y: number): Enemy | null {
	// 900 px, squared — homing that reaches across the whole document would
	// make the curve gun a guaranteed hit rather than a trade-off.
	let nearestDistance = 900 * 900;
	let nearest: Enemy | null = null;
	for (const enemy of game.enemies) {
		if (!enemyVisible(enemy)) continue;
		const dx = enemy.x - x;
		const dy = enemy.y - y;
		const distance = dx * dx + dy * dy;
		if (distance < nearestDistance) {
			nearest = enemy;
			nearestDistance = distance;
		}
	}
	return nearest;
}

export function spawnEnemy(game: Game, level: number): boolean {
	const config = ENEMY_LEVELS[level];
	if (game.state === "parked" || !config) return false;
	if (level === 1 && enemyCount(game, 1) >= enemyMaxAlive(game)) return false;

	let x: number;
	let y: number;
	if (level === 1) {
		// Level 1 arrives from off-screen on any edge. The reference uses only
		// top and bottom, which bunches every arrival into the same two lanes —
		// visible here as a queue along the top of the page.
		const margin = config.clearRadius * 2;
		const edge = Math.floor(Math.random() * 4);
		if (edge === 0) {
			x = rand(config.clearRadius + 8, innerWidth - config.clearRadius - 8);
			y = window.scrollY - margin;
		} else if (edge === 1) {
			x = rand(config.clearRadius + 8, innerWidth - config.clearRadius - 8);
			y = window.scrollY + innerHeight + margin;
		} else if (edge === 2) {
			x = -margin;
			y = rand(window.scrollY + margin, window.scrollY + innerHeight - margin);
		} else {
			x = innerWidth + margin;
			y = rand(window.scrollY + margin, window.scrollY + innerHeight - margin);
		}
	} else {
		const spot =
			game.clearSpot(
				config.clearRadius + 8,
				game.car.x,
				game.car.y,
				level * 180,
			) ?? game.clearSpot(config.clearRadius + 8);
		if (!spot) return false;
		x = spot.x;
		y = spot.y;
	}

	const maxSpeed = enemyMaxSpeed(game, level);
	const el = document.createElement("div");
	el.className = `arcade-enemy arcade-enemy-level-${level}`;
	el.setAttribute("aria-hidden", "true");
	el.innerHTML = game.enemyMarkup();
	const healthEl = document.createElement("span");
	healthEl.className = "arcade-enemy-health";
	healthEl.setAttribute("aria-hidden", "true");
	el.appendChild(healthEl);
	game.root.appendChild(el);
	game.enemySpawnCount++;

	const enemy: Enemy = {
		level,
		config,
		x,
		y,
		angle: Math.atan2(game.car.x - x, -(game.car.y - y)),
		speed: rand(
			maxSpeed * config.startSpeedMin,
			maxSpeed * config.startSpeedMax,
		),
		maxSpeed,
		health: config.health,
		maxHealth: config.health,
		el,
		healthEl,
		fireT: performance.now() + rand(config.fireDelayMin, config.fireDelayMax),
	};
	game.enemies.push(enemy);
	if (level > game.allTimeMaxLevel) {
		game.allTimeMaxLevel = level;
		game.stats.maxLevel = level;
		game.recordStats();
	}
	renderEnemyHealth(enemy);
	return true;
}

function renderEnemyHealth(enemy: Enemy): void {
	enemy.healthEl.style.transform = `scaleX(${clamp(
		enemy.health / enemy.maxHealth,
		0,
		1,
	)})`;
}

export function damageEnemy(game: Game, enemy: Enemy): boolean {
	if (!game.enemies.includes(enemy)) return false;
	enemy.health = Math.max(0, enemy.health - 1);
	renderEnemyHealth(enemy);
	if (enemy.health > 0) return false;
	defeatEnemy(game, enemy);
	return true;
}

export function defeatEnemy(game: Game, enemy: Enemy): void {
	game.effects.boomAt(
		enemy.x,
		enemy.y,
		10 + enemy.level * 6,
		3 + enemy.level,
		7 + enemy.level * 2,
		60 + enemy.level * 20,
		260 + enemy.level * 50,
	);
	enemy.el.remove();
	const i = game.enemies.indexOf(enemy);
	if (i >= 0) game.enemies.splice(i, 1);
	registerEnemyDefeat(game, enemy.level);
	game.recordStats();
}

function registerEnemyDefeat(game: Game, level: number): void {
	game.stats.kills++;
	const key = `level${level}Kills` as
		| "level1Kills"
		| "level2Kills"
		| "level3Kills";
	game.stats[key] = (game.stats[key] || 0) + 1;
	game.sessionKillsByLevel[level] = (game.sessionKillsByLevel[level] || 0) + 1;
	game.defeatsByLevel[level] = (game.defeatsByLevel[level] || 0) + 1;
	const threshold = game.nextLevelSpawnAt[level];
	if (
		threshold &&
		game.defeatsByLevel[level] >= threshold &&
		spawnEnemy(game, level + 1)
	) {
		game.nextLevelSpawnAt[level] = threshold + ENEMY_LEVEL_SPAWN_KILLS;
	}
}

/**
 * Steer toward the player, around whatever is in the way.
 *
 * Eight headings are sampled on a ring at the enemy's own radius and again at
 * twice it; each obstacle found pushes the desired direction away from itself,
 * weighted by how close it is. The result is turned into with a rate limit, so
 * enemies arc around a case-study card rather than grinding into its edge —
 * which is the whole difference between this reading as an opponent and
 * reading as a bug.
 */
export function steerAround(
	game: Game,
	ox: number,
	oy: number,
	angle: number,
	tx: number,
	ty: number,
	radius: number,
	turnRate: number,
	dt: number,
): number {
	const dx = tx - ox;
	const dy = ty - oy;
	const dist = Math.hypot(dx, dy);
	let sx = dist > 0.5 ? dx / dist : 1;
	let sy = dist > 0.5 ? dy / dist : 0;

	const here = game.world.blockingWorldRect(ox, oy);
	if (here) {
		// Already inside something: the only goal is to get out of it.
		const nx = clamp(ox, here.left, here.right);
		const ny = clamp(oy, here.top, here.bottom);
		let ex = ox - nx;
		let ey = oy - ny;
		if (Math.hypot(ex, ey) < 1) {
			ex = dx;
			ey = dy;
		}
		sx = ex;
		sy = ey;
	} else {
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * TAU;
			const reach = i % 2 === 0 ? radius + 2 : radius * 2 + 4;
			const r = game.world.blockingWorldRect(
				ox + Math.cos(a) * reach,
				oy + Math.sin(a) * reach,
			);
			if (!r) continue;
			const nx = clamp(ox, r.left, r.right);
			const ny = clamp(oy, r.top, r.bottom);
			const ex = ox - nx;
			const ey = oy - ny;
			const d = Math.hypot(ex, ey);
			if (d < 1) continue;
			const w = Math.max(0, 1 - d / (radius * 2.8)) * 4;
			sx += (ex / d) * w;
			sy += (ey / d) * w;
		}
	}

	const sl = Math.hypot(sx, sy);
	if (sl < 1e-6) return angle;
	sx /= sl;
	sy /= sl;
	const want = Math.atan2(sx, -sy);
	const maxTurn = turnRate * dt;
	return angle + clamp(angDiff(angle, want), -maxTurn, maxTurn);
}

function moveEnemy(game: Game, enemy: Enemy, dt: number): void {
	const radius = enemy.config.clearRadius;
	const step = Math.max(0.35, enemy.speed * dt);
	if (!enemyVisible(enemy)) {
		// Off-screen enemies fly straight; running the full sampler for
		// something nobody can see is the easiest frame budget to give back.
		enemy.x += Math.sin(enemy.angle) * step;
		enemy.y -= Math.cos(enemy.angle) * step;
		return;
	}
	const maxWorldY =
		Math.max(innerHeight, document.documentElement.scrollHeight) - radius;
	const offsets = [0, 0.3, -0.3, 0.65, -0.65, 1.05, -1.05, Math.PI];
	let best: { x: number; y: number; angle: number } | null = null;
	let bestScore = Number.POSITIVE_INFINITY;
	for (const offset of offsets) {
		const angle = enemy.angle + offset;
		const x = enemy.x + Math.sin(angle) * step;
		const y = enemy.y - Math.cos(angle) * step;
		// Out of bounds is only a reason to reject a candidate when it is not
		// heading back in. The reference has this escape hatch on the vertical
		// axis only, because it spawns nothing off the left or right edge; with
		// four-edge spawning, a hard horizontal reject traps an arrival in the
		// strip between the viewport edge and `radius` — every candidate is out
		// of bounds, including the ones moving inward, so it stops dead a few
		// pixels off screen and never arrives.
		const withinX = x >= radius && x <= innerWidth - radius;
		const enteringX =
			(enemy.x > innerWidth - radius && x < enemy.x) ||
			(enemy.x < radius && x > enemy.x);
		if (!withinX && !enteringX) continue;

		if (y < -radius || y > maxWorldY + radius) continue;
		const inBand =
			y >= window.scrollY - radius &&
			y <= window.scrollY + innerHeight + radius;
		const entering =
			(enemy.y > window.scrollY + innerHeight && y < enemy.y) ||
			(enemy.y < window.scrollY && y > enemy.y);
		if (!inBand && !entering) continue;
		if (!game.spotClearFast(x, y, radius)) continue;
		const score =
			Math.hypot(game.car.x - x, game.car.y - y) + Math.abs(offset) * 22;
		if (score < bestScore) {
			bestScore = score;
			best = { x, y, angle };
		}
	}
	if (best) {
		enemy.x = best.x;
		enemy.y = best.y;
		enemy.angle = best.angle;
	} else {
		enemy.speed = Math.max(4, enemy.speed - enemy.config.acceleration * dt * 2);
	}
}

function fireEnemyBullet(game: Game, enemy: Enemy, offset: number): void {
	const config = enemy.config;
	const a =
		Math.atan2(game.car.y - enemy.y, game.car.x - enemy.x) +
		offset +
		rand(-config.projectileSpread, config.projectileSpread);
	const sp = rand(config.projectileMinSpeed, config.projectileMaxSpeed);
	const el = document.createElement("div");
	el.className = `arcade-bullet arcade-enemy-level-${enemy.level}-bullet`;
	game.root.appendChild(el);
	game.enemyBullets.push({
		x: enemy.x,
		y: enemy.y,
		vx: Math.cos(a) * sp,
		vy: Math.sin(a) * sp,
		a,
		previousX: enemy.x,
		previousY: enemy.y,
		previousA: a,
		el,
		life: 1.8,
	});
	game.effects.enemyFlashAt(enemy.x, enemy.y);
}

export function updateEnemyBullets(game: Game, dt: number): void {
	for (let i = game.enemyBullets.length - 1; i >= 0; i--) {
		const b = game.enemyBullets[i];
		b.life -= dt;
		if (b.life <= 0) {
			b.el.remove();
			game.enemyBullets.splice(i, 1);
			continue;
		}
		b.previousX = b.x;
		b.previousY = b.y;
		b.previousA = b.a;
		const nextX = b.x + b.vx * dt;
		const nextY = b.y + b.vy * dt;
		if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) {
			b.el.remove();
			game.enemyBullets.splice(i, 1);
			continue;
		}
		// Enemy fire does not destroy the page — it stops at the first thing it
		// hits. Only the player gets to break the site.
		if (bulletHitsObstacle(game, b.x, b.y, nextX, nextY)) {
			b.el.remove();
			game.enemyBullets.splice(i, 1);
			continue;
		}
		b.x = nextX;
		b.y = nextY;
		b.a = Math.atan2(b.vy, b.vx);
		b.el.style.transform = `translate(${b.x}px, ${b.y - window.scrollY}px) rotate(${
			(b.a * 180) / Math.PI
		}deg)`;
		b.el.style.opacity = String(Math.min(1, b.life * 3));
		const dx = b.x - game.car.x;
		const dy = b.y - game.car.y;
		const reach = game.carRadius + 6;
		if (game.state === "drive" && dx * dx + dy * dy < reach * reach) {
			game.damagePlayer();
			b.el.remove();
			game.enemyBullets.splice(i, 1);
		}
	}
}

export function updateEnemies(game: Game, dt: number): void {
	const now = performance.now();
	for (let i = game.enemies.length - 1; i >= 0; i--) {
		const enemy = game.enemies[i];
		const config = enemy.config;
		if (!game.spotClearFast(enemy.x, enemy.y, config.clearRadius)) {
			const safe = game.safePointAround(enemy.x, enemy.y, config.clearRadius);
			if (safe && (safe.x !== enemy.x || safe.y !== enemy.y)) {
				enemy.x = safe.x;
				enemy.y = safe.y;
				enemy.speed = Math.max(4, enemy.speed * 0.5);
			}
		}

		const dist = Math.hypot(game.car.x - enemy.x, game.car.y - enemy.y) || 1;
		const visible = enemyVisible(enemy);
		if (visible && dist < config.contactRadius) game.damagePlayer();

		enemy.angle = steerAround(
			game,
			enemy.x,
			enemy.y,
			enemy.angle,
			game.car.x,
			game.car.y,
			config.clearRadius,
			config.turnRate,
			dt,
		);
		enemy.speed = Math.min(
			enemy.maxSpeed,
			enemy.speed + config.acceleration * dt,
		);
		moveEnemy(game, enemy, dt);

		if (!Number.isFinite(enemy.x) || !Number.isFinite(enemy.y)) {
			defeatEnemy(game, enemy);
			continue;
		}

		if (visible && game.state === "drive" && dist < config.fireRange) {
			if (now > enemy.fireT) {
				enemy.fireT = now + rand(config.fireDelayMin, config.fireDelayMax);
				// Do not shoot through a heading. An enemy that can hit you
				// from behind a card is not an opponent, it is a nuisance.
				if (game.world.lineClear(enemy.x, enemy.y, game.car.x, game.car.y)) {
					for (const offset of config.fireOffsets) {
						fireEnemyBullet(game, enemy, offset);
					}
					game.audio.shot();
				}
			}
		}

		enemy.el.style.transform = `translate(${enemy.x - config.width / 2}px, ${
			enemy.y - window.scrollY - config.height / 2
		}px) rotate(${(enemy.angle * 180) / Math.PI}deg)`;
	}
}
