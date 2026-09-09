import { afterEach, describe, expect, it } from "vitest";
import { ENEMY_LEVELS } from "@/arcade/constants";
import {
	enemyMaxSpeed,
	enemyVisible,
	steerAround,
	updateEnemies,
} from "@/arcade/enemies";
import { Game } from "@/arcade/engine";
import { angDiff } from "@/arcade/math";
import type { Enemy } from "@/arcade/types";

function newGame(): Game {
	document.body.innerHTML = "";
	const root = document.createElement("div");
	root.id = "arcade-root";
	document.body.appendChild(root);
	return new Game(root);
}

afterEach(() => {
	document.body.innerHTML = "";
	document.elementsFromPoint = (() => []) as typeof document.elementsFromPoint;
	window.scrollY = 0;
});

describe("enemyMaxSpeed", () => {
	it("rises with the level", () => {
		const game = newGame();
		const now = performance.now();
		expect(enemyMaxSpeed(game, 2, now)).toBeGreaterThan(
			enemyMaxSpeed(game, 1, now),
		);
		expect(enemyMaxSpeed(game, 3, now)).toBeGreaterThan(
			enemyMaxSpeed(game, 2, now),
		);
		game.stop();
	});

	it("rises with elapsed time", () => {
		const game = newGame();
		const now = performance.now();
		expect(enemyMaxSpeed(game, 1, now + 600_000)).toBeGreaterThan(
			enemyMaxSpeed(game, 1, now),
		);
		game.stop();
	});

	it("never exceeds the level's own speed limit", () => {
		const game = newGame();
		// An hour in, with a large spawn count: still capped.
		game.enemySpawnCount = 10_000;
		for (const level of [1, 2, 3]) {
			expect(enemyMaxSpeed(game, level, performance.now() + 3_600_000)).toBe(
				ENEMY_LEVELS[level].speedLimit,
			);
		}
		game.stop();
	});
});

describe("enemyVisible", () => {
	it("is false for an enemy above the viewport", () => {
		const enemy = { x: 100, y: -400 } as Enemy;
		expect(enemyVisible(enemy)).toBe(false);
	});

	it("follows the scroll position, not the document origin", () => {
		const enemy = { x: 100, y: 900 } as Enemy;
		expect(enemyVisible(enemy)).toBe(false);
		window.scrollY = 800;
		expect(enemyVisible(enemy)).toBe(true);
	});
});

describe("arrivals", () => {
	/**
	 * Regression. Enemies spawn off all four edges; `moveEnemy` rejects any
	 * candidate position outside `radius .. innerWidth - radius`. Without an
	 * escape for candidates that are heading back in, an arrival from the left
	 * or right stops dead in the strip between the viewport edge and `radius`
	 * — every option it has is out of bounds, so it picks none of them and
	 * hangs there for the rest of the session.
	 */
	function enemyAt(game: Game, x: number, y: number): Enemy {
		const config = ENEMY_LEVELS[1];
		const el = document.createElement("div");
		const healthEl = document.createElement("span");
		el.appendChild(healthEl);
		game.root.appendChild(el);
		const enemy: Enemy = {
			level: 1,
			config,
			x,
			y,
			// Pointing at the car, which sits in the middle of the viewport.
			angle: Math.atan2(game.car.x - x, -(game.car.y - y)),
			speed: config.baseSpeed,
			maxSpeed: config.speedLimit,
			health: config.health,
			maxHealth: config.health,
			el,
			healthEl,
			fireT: Number.POSITIVE_INFINITY,
		};
		game.enemies.push(enemy);
		return enemy;
	}

	function arrives(spawnX: number): boolean {
		const game = newGame();
		game.state = "drive";
		game.car.x = innerWidth / 2;
		game.car.y = innerHeight / 2;
		const enemy = enemyAt(game, spawnX, innerHeight / 2);
		const startDistance = Math.abs(enemy.x - game.car.x);
		for (let frame = 0; frame < 120; frame++) updateEnemies(game, 1 / 60);
		const moved = startDistance - Math.abs(enemy.x - game.car.x);
		game.stop();
		return moved > 1;
	}

	it("closes in from beyond the right edge", () => {
		expect(arrives(innerWidth + 32)).toBe(true);
	});

	it("closes in from beyond the left edge", () => {
		expect(arrives(-32)).toBe(true);
	});

	it("closes in from the dead strip just inside the right edge", () => {
		// The exact band the missing escape trapped them in.
		expect(arrives(innerWidth - ENEMY_LEVELS[1].clearRadius / 2)).toBe(true);
	});
});

describe("steerAround", () => {
	/**
	 * The behaviour that separates this from a straight-line chase. With a
	 * blocker between the enemy and the player, the chosen heading must not be
	 * the direct one — otherwise enemies grind into the edge of a case-study
	 * card and the whole thing reads as a bug rather than an opponent.
	 */
	function blockAt(left: number, right: number, top: number, bottom: number) {
		const wall = document.createElement("div");
		wall.style.backgroundColor = "rgb(0, 0, 0)";
		wall.getBoundingClientRect = () =>
			({
				left,
				right,
				top,
				bottom,
				width: right - left,
				height: bottom - top,
			}) as DOMRect;
		document.body.appendChild(wall);
		document.elementsFromPoint = ((x: number, y: number) =>
			x >= left && x <= right && y >= top && y <= bottom
				? [wall]
				: []) as typeof document.elementsFromPoint;
	}

	it("turns away from a blocker directly ahead", () => {
		const game = newGame();
		// Enemy at (200, 200) heading straight up-page at the player above it,
		// with a wall filling the gap between them.
		blockAt(140, 260, 150, 190);
		const straightUp = 0;
		const steered = steerAround(
			game,
			200,
			200,
			straightUp,
			200,
			100,
			16,
			10,
			0.1,
		);
		expect(Math.abs(angDiff(straightUp, steered))).toBeGreaterThan(0.001);
		game.stop();
	});

	it("holds its heading when the way is clear", () => {
		const game = newGame();
		const angle = 0;
		const steered = steerAround(game, 200, 200, angle, 200, 100, 16, 10, 0.1);
		expect(Math.abs(angDiff(angle, steered))).toBeLessThan(0.001);
		game.stop();
	});

	it("cannot turn faster than the level's turn rate", () => {
		const game = newGame();
		// Player directly behind: the wanted turn is a half circle, and the
		// rate limit is what stops enemies snapping round instantly.
		const turnRate = 2;
		const dt = 0.1;
		const steered = steerAround(game, 200, 200, 0, 200, 300, 16, turnRate, dt);
		expect(Math.abs(angDiff(0, steered))).toBeLessThanOrEqual(
			turnRate * dt + 1e-9,
		);
		game.stop();
	});
});
