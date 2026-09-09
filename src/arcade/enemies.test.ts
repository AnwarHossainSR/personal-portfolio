import { afterEach, describe, expect, it } from "vitest";
import { ENEMY_LEVELS } from "@/arcade/constants";
import { enemyMaxSpeed, enemyVisible, steerAround } from "@/arcade/enemies";
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
