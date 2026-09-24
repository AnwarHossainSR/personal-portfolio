import { afterEach, describe, expect, it } from "vitest";
import {
	bulletHitsObstacle,
	bulletPath,
	pointSegmentDistanceSquared,
	segmentsWithinDistance,
} from "@/arcade/bullets";
import { Game } from "@/arcade/engine";

afterEach(() => {
	document.body.innerHTML = "";
});

describe("pointSegmentDistanceSquared", () => {
	it("measures to the nearest point on the segment, not the nearest endpoint", () => {
		// (5, 3) is beside the middle of a horizontal segment.
		expect(pointSegmentDistanceSquared(5, 3, 0, 0, 10, 0)).toBe(9);
	});

	it("clamps past the ends", () => {
		expect(pointSegmentDistanceSquared(-4, 0, 0, 0, 10, 0)).toBe(16);
	});

	it("treats a zero-length segment as a point", () => {
		expect(pointSegmentDistanceSquared(3, 4, 1, 1, 1, 1)).toBe(13);
	});
});

describe("segmentsWithinDistance", () => {
	it("is true for crossing segments", () => {
		expect(segmentsWithinDistance(-10, 0, 10, 0, 0, -10, 0, 10, 1)).toBe(true);
	});

	it("is false for parallel segments further apart than the radius", () => {
		expect(segmentsWithinDistance(0, 0, 10, 0, 0, 40, 10, 40, 10)).toBe(false);
	});

	it("is true for parallel segments inside the radius", () => {
		expect(segmentsWithinDistance(0, 0, 10, 0, 0, 6, 10, 6, 10)).toBe(true);
	});

	it("is true when the segments miss but pass within the radius", () => {
		// Endpoints 5 apart, no intersection: the endpoint-distance fallback is
		// what catches two bullets that cross just short of each other.
		expect(segmentsWithinDistance(0, 0, 10, 0, 15, 0, 25, 0, 6)).toBe(true);
	});
});

describe("bulletPath", () => {
	it("spans from the previous frame's position to this one", () => {
		const path = bulletPath({
			x: 100,
			y: 0,
			a: 0,
			previousX: 0,
			previousY: 0,
			previousA: 0,
		});
		expect(path.x0).toBeCloseTo(23);
		expect(path.x1).toBeCloseTo(123);
	});

	it("falls back to the current position on the first frame", () => {
		const path = bulletPath({
			x: 50,
			y: 5,
			a: 0,
			previousX: Number.NaN,
			previousY: Number.NaN,
			previousA: Number.NaN,
		});
		expect(path.x0).toBeCloseTo(path.x1);
	});
});

describe("bulletHitsObstacle", () => {
	/**
	 * The tunnelling case, which is the whole reason collision is stepped.
	 *
	 * A bullet travels 1650 px/s — about 27 px per frame at 60 Hz, and further
	 * on a slow frame. Testing only where it started and where it ended up
	 * means it passes straight through anything thinner than one frame of
	 * travel: a rule, a border, a one-line heading.
	 */
	function gameWithBandAt(top: number, bottom: number): Game {
		document.body.innerHTML = "";
		const rule = document.createElement("div");
		rule.style.backgroundColor = "rgb(0, 0, 0)";
		rule.getBoundingClientRect = () =>
			({
				left: 0,
				right: 500,
				top,
				bottom,
				width: 500,
				height: bottom - top,
			}) as DOMRect;
		document.body.appendChild(rule);
		document.elementsFromPoint = (_x: number, y: number) =>
			y >= top && y <= bottom ? [rule] : [];
		const root = document.createElement("div");
		root.id = "arcade-root";
		document.body.appendChild(root);
		return new Game(root);
	}

	it("catches an obstacle the segment passes through but neither end touches", () => {
		const game = gameWithBandAt(90, 110);
		expect(bulletHitsObstacle(game, 10, 0, 10, 200)).toBe(true);
		game.stop();
	});

	it("is false when nothing lies along the segment", () => {
		const game = gameWithBandAt(900, 920);
		expect(bulletHitsObstacle(game, 10, 0, 10, 200)).toBe(false);
		game.stop();
	});
});
